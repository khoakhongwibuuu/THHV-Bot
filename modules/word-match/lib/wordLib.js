const db = require('#assets/library/db.js');
const { prisma, redisClient } = db;
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = require('#assets/library/state.js');

const dict = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/word-match/database/default.dict.min.json'), 'utf-8'));

const MODULE_NAME = 'word-match';

const emojiTable = Object.freeze({
    ok: '✅',
    not_ok: '❌',
    time: '⏳'
});

const penalty = Object.freeze({
    IDENTICAL_PREVIOUS_USER: -1,
    TOO_FAST_INPUT: -2,
    TAIL_NOT_MATCH: -3,
    UNDEFINED_WORD: -2,
    REUSED_WORD: -1,
    REWARD: 2
});

const getGuildConfig = async (guildId) => {
    const cached = await redisClient.get(`config:${MODULE_NAME}:${guildId}`);
    if (cached) return JSON.parse(cached);

    const record = await prisma.guildConfig.findUnique({
        where: { guildId_module: { guildId, module: MODULE_NAME } }
    });

    if (record) {
        await redisClient.set(`config:${MODULE_NAME}:${guildId}`, JSON.stringify(record.data));
        return record.data;
    }
    return null;
};

const saveGuildConfig = async (guildId, data) => {
    await prisma.guildConfig.upsert({
        where: { guildId_module: { guildId, module: MODULE_NAME } },
        update: { data },
        create: { guildId, module: MODULE_NAME, data }
    });
    await redisClient.set(`config:${MODULE_NAME}:${guildId}`, JSON.stringify(data));
};

const isSetup = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config !== null;
};

const guildSetup = async (guildId, channelId) => {
    if (await isSetup(guildId)) return;
    await saveGuildConfig(guildId, {
        channelId: channelId,
        recentUser: null,
        recentWord: null,
        recentSentTime: 0,
        playerScore: {},
        used: {}
    });
};

const guildUninstall = async (guildId) => {
    if (!(await isSetup(guildId))) return;
    await prisma.guildConfig.delete({
        where: { guildId_module: { guildId, module: MODULE_NAME } }
    });
    await redisClient.del(`config:${MODULE_NAME}:${guildId}`);
};

const guildReset = async (guildId, removeScore) => {
    const guildData = await getGuildConfig(guildId);
    if (!guildData) return;

    guildData.recentUser = null;
    guildData.recentWord = null;
    guildData.recentSentTime = 0;
    guildData.used = {};
    if (removeScore) guildData.playerScore = {};

    await saveGuildConfig(guildId, guildData);
};

const getRoomId = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config ? config.channelId : null;
};

const isInRoom = async (guildId, channelId) => {
    const roomId = await getRoomId(guildId);
    return roomId === channelId;
};

const resetRoomId = async (guildId, newChannelId) => {
    const guildData = await getGuildConfig(guildId);
    if (!guildData) return;
    guildData.channelId = newChannelId;
    await saveGuildConfig(guildId, guildData);
};

const hasPlayerData = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    return config && config.playerScore ? config.playerScore.hasOwnProperty(userId) : false;
};

const allPlayerList = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config && config.playerScore ? Object.keys(config.playerScore) : [];
};

const readPlayerScore = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    return config && config.playerScore && config.playerScore[userId] ? config.playerScore[userId] : null;
};

const modifyPlayerScore = (guildId, userId, offset, guildData) => {
    if (!guildData.playerScore.hasOwnProperty(userId)) {
        guildData.playerScore[userId] = [0, offset];
    } else {
        guildData.playerScore[userId].push(guildData.playerScore[userId].lastValue() + offset);
    }
};

const handleInput = async (msg) => {
    if (!msg || !msg.guild || !msg.guild.id) return;
    if (await isInRoom(msg.guild.id, msg.channel.id)) {
        let guildData = await getGuildConfig(msg.guild.id);
        if (!guildData) return;

        if (msg.author.id === guildData.recentUser) {
            await msg.reply(`Bạn đã nối từ trước đó. Trừ ${Math.abs(penalty.IDENTICAL_PREVIOUS_USER)} điểm.`);
            await msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.IDENTICAL_PREVIOUS_USER, guildData);
            await saveGuildConfig(msg.guild.id, guildData);
            return;
        }
        if (msg.createdTimestamp - guildData.recentSentTime < 3000) {
            await msg.reply(`Bạn sử dụng bot hơi nhanh rồi, hãy chậm lại. Trừ ${Math.abs(penalty.TOO_FAST_INPUT)} điểm.`);
            await msg.react(emojiTable.time);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.TOO_FAST_INPUT, guildData);
            await saveGuildConfig(msg.guild.id, guildData);
            return;
        }
        if (guildData.recentSentTime !== 0 && msg.content.toLowerCase().firstDigit() !== guildData.recentWord) {
            await msg.reply(`Từ mới phải bắt đầu bằng \`${guildData.recentWord}\`. Trừ ${Math.abs(penalty.TAIL_NOT_MATCH)} điểm.`);
            await msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.TAIL_NOT_MATCH, guildData);
            await saveGuildConfig(msg.guild.id, guildData);
            return;
        }
        if (!dict.hasOwnProperty(msg.content.toLowerCase())) {
            await msg.reply(`Từ \`${msg.content.toLowerCase()}\` không tồn tại trong từ điển. Trừ ${Math.abs(penalty.UNDEFINED_WORD)} điểm.`);
            await msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.UNDEFINED_WORD, guildData);
            await saveGuildConfig(msg.guild.id, guildData);
            return;
        }
        if (guildData.used.hasOwnProperty(msg.content.toLowerCase())) {
            await msg.reply(`Từ \`${msg.content.toLowerCase()}\` đã được nối. Trừ ${Math.abs(penalty.REUSED_WORD)} điểm.`);
            await msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.REUSED_WORD, guildData);
            await saveGuildConfig(msg.guild.id, guildData);
            return;
        }

        modifyPlayerScore(msg.guild.id, msg.author.id, penalty.REWARD, guildData);
        guildData.used[msg.content.toLowerCase()] = 1;
        guildData.recentWord = msg.content.toLowerCase().lastDigit();
        guildData.recentSentTime = msg.createdTimestamp;
        guildData.recentUser = msg.author.id;

        await msg.react(emojiTable.ok);
        await saveGuildConfig(msg.guild.id, guildData);
    }
};

module.exports = {
    isSetup,
    getGuildConfig,
    guildSetup,
    guildUninstall,
    guildReset,
    getRoomId,
    isInRoom,
    resetRoomId,

    hasPlayerData,
    allPlayerList,
    readPlayerScore,
    
    handleInput
};