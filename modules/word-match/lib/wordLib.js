// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

// Database
const dict = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/word-match/database/default.dict.min.json'), 'utf-8'));

// Module based
const configDirPath = path.join(dirname, 'configs/word-match/config');
const getGuildFilePath = (guildId) => path.join(configDirPath, `${guildId}.json`);

// Configuration
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

// In-memory caching
let channelIdList = {};

// Functions
const isSetup = (guildId) =>
    channelIdList.hasOwnProperty(guildId);

const loadRawGuildFile = (guildId) =>
    fs.readFileSync(getGuildFilePath(guildId), 'utf-8');

const loadGuildFile = (guildId) =>
    JSON.parse(loadRawGuildFile(guildId));

const writeGuildFile = (guildId, newData) =>
    fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

const guildSetup = (guildId, channelId) => {
    if (isSetup(guildId)) return;

    channelIdList[guildId] = channelId;

    writeGuildFile(guildId, {
        channelId: channelId,
        recentUser: null,
        recentWord: null,
        recentSentTime: 0,
        playerScore: {},
        used: {}
    });
}

const guildUninstall = (guildId) => {
    if (!isSetup(guildId)) return;
    fs.unlinkSync(getGuildFilePath(guildId));
    delete channelIdList[guildId];
}

const guildReset = (guildId, removeScore) => {
    if (!isSetup(guildId)) return;
    const guildData = loadGuildFile(guildId);
    guildData.recentUser = null;
    guildData.recentWord = null;
    guildData.recentSentTime = 0;
    guildData.used = {};
    if (removeScore) guildData.playerScore = {};
    writeGuildFile(guildId, guildData);
}

const getRoomId = (guildId) =>
    isSetup(guildId) ? channelIdList[guildId] : null;

const isInRoom = (guildId, channelId) =>
    isSetup(guildId) ? getRoomId(guildId) === channelId : false;

const preLoad = (guildId) => {
    if (!isSetup(guildId)) return;
    const guildData = loadGuildFile(guildId);
    channelIdList[guildId] = guildData.channelId;
}

const resetRoomId = (guildId, newChannelId) => {
    if (!isSetup(guildId)) return;
    const guildData = loadGuildFile(guildId);
    guildData.channelId = newChannelId;
    channelIdList[guildId] = newChannelId;
    writeGuildFile(guildId, guildData);
}

// ingame tasks
/// player data getters
const hasPlayerData = (guildId, userId) =>
    isSetup(guildId) ? loadGuildFile(guildId).playerScore.hasOwnProperty(userId) : false;

const allPlayerList = (guildId) =>
    isSetup(guildId) ? Object.keys(loadGuildFile(guildId).playerScore) : [];

const readPlayerScore = (guildId, userId) =>
    isSetup(guildId) ? hasPlayerData(guildId, userId) ? loadGuildFile(guildId).playerScore[userId] : null : null;

/// player data setters
const modifyPlayerScore = (guildId, userId, offset, guildData) => {
    if (!isSetup(guildId)) return;
    if (!guildData.playerScore.hasOwnProperty(userId)) {
        guildData.playerScore[userId] = [0, offset];
    } else {
        guildData.playerScore[userId].push(guildData.playerScore[userId].lastValue() + offset);
    }
}

const handleInput = (msg) => {
    if (!msg || !msg.guild || !msg.guild.id) return;
    if (isInRoom(msg.guild.id, msg.channel.id)) {
        let guildData = loadGuildFile(msg.guild.id);
        if (msg.author.id === guildData.recentUser) {
            msg.reply(`Bạn đã nối từ trước đó. Trừ ${Math.abs(penalty.IDENTICAL_PREVIOUS_USER)} điểm.`);
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.IDENTICAL_PREVIOUS_USER, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (msg.createdTimestamp - guildData.recentSentTime < 3000) {
            msg.reply(`Bạn sử dụng bot hơi nhanh rồi, hãy chậm lại. Trừ ${Math.abs(penalty.TOO_FAST_INPUT)} điểm.`);
            msg.react(emojiTable.time);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.TOO_FAST_INPUT, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (guildData.recentSentTime !== 0 && msg.content.toLowerCase().firstDigit() !== guildData.recentWord) {
            msg.reply(`Từ mới phải bắt đầu bằng \`${guildData.recentWord}\`. Trừ ${Math.abs(penalty.TAIL_NOT_MATCH)} điểm.`);
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.TAIL_NOT_MATCH, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (!dict.hasOwnProperty(msg.content.toLowerCase())) {
            msg.reply(`Từ \`${msg.content.toLowerCase()}\` không tồn tại trong từ điển. Trừ ${Math.abs(penalty.UNDEFINED_WORD)} điểm.`);
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.UNDEFINED_WORD, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (guildData.used.hasOwnProperty(msg.content.toLowerCase())) {
            msg.reply(`Từ \`${msg.content.toLowerCase()}\` đã được nối. Trừ ${Math.abs(penalty.REUSED_WORD)} điểm.`);
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, penalty.REUSED_WORD, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }

        modifyPlayerScore(msg.guild.id, msg.author.id, penalty.REWARD, guildData);
        guildData.used[msg.content.toLowerCase()] = 1;
        guildData.recentWord = msg.content.toLowerCase().lastDigit();
        guildData.recentSentTime = msg.createdTimestamp;
        guildData.recentUser = msg.author.id;
        msg.react(emojiTable.ok);
        writeGuildFile(msg.guild.id, guildData);
    }
}

module.exports = {
    // Base functions
    isSetup,
    loadRawGuildFile,
    loadGuildFile,
    guildSetup,
    guildUninstall,
    guildReset,
    getRoomId,
    isInRoom,
    preLoad,
    resetRoomId,

    // Ingame tasks
    readPlayerScore,
    allPlayerList,
    handleInput
}