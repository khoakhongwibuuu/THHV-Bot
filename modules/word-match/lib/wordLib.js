// Packages
const fs = require('fs');
const path = require('path');

// Module based
const configDirPath = path.join(global.dirname, "modules/word-match/config");
const dict = JSON.parse(fs.readFileSync(path.join(global.dirname, 'modules/word-match/database/default.dict.min.json'), 'utf-8'));

// Configuration
const emojiTable = Object.freeze({
    ok: '✅',
    not_ok: '❌'
});

// Channel ID tracking
let channelIdDict = {};

// Functions
const isSetup = (guildId) => {
    return channelIdDict.hasOwnProperty(guildId);
}

const loadRawGuildFile = (guildId) => {
    const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    const rawTextFile = fs.readFileSync(guildDataPath, 'utf-8');
    return rawTextFile;
}

const loadGuildFile = (guildId) => {
    return JSON.parse(loadRawGuildFile(guildId));
}

const writeGuildFile = (guildId, newData) => {
    const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    fs.writeFileSync(guildDataPath, JSON.stringify(newData), 'utf8');
}

const guildSetup = (guildId, channelId) => {
    channelIdDict[guildId] = channelId;
    const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    if (!fs.existsSync(guildDataPath)) {
        fs.writeFileSync(guildDataPath, JSON.stringify({
            channelId: channelId,
            recentUser: null,
            recentWord: null,
            recentSentTime: 0,
            playerScore: {},
            used: {}
        }), 'utf8');
    }
}

const guildReset = (guildId, removeScore) => {
    const guildData = loadGuildFile(guildId);
    guildData.recentUser = null;
    guildData.recentWord = null;
    guildData.recentSentTime = 0;
    guildData.used = {};
    if (removeScore) guildData.playerScore = {};
    writeGuildFile(guildId, guildData);
}

const getRoomId = (guildId) => {
    if (!isSetup(guildId)) return null;
    return channelIdDict[guildId];
}

const isInRoom = (guildId, testChannelId) => {
    if (!isSetup(guildId)) return false;
    else return (getRoomId(guildId) === testChannelId);
}

const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    channelIdDict[guildId] = guildData.channelId;
}

const modifyPlayerScore = (guildId, playerId, offset, guildData) => {
    if (!guildData.playerScore.hasOwnProperty(playerId)) {
        guildData.playerScore[playerId] = [0, offset];
    } else {
        guildData.playerScore[playerId].push(guildData.playerScore[playerId].lastValue() + offset);
    }
}

const getUserScore = (guildId, playerId) => {
    const guildData = loadGuildFile(guildId);
    if (!guildData.playerScore.hasOwnProperty(playerId)) {
        return "Không tìm thấy dữ liệu trong database.";
    } else {
        return `${guildData.playerScore[playerId].lastValue()} điểm.`
    }
}

const handleInput = (msg) => {
    if (isInRoom(msg.guild.id, msg.channel.id)) {
        let guildData = loadGuildFile(msg.guild.id);
        if (msg.author.id === guildData.recentUser) {
            msg.reply("Bạn đã nối từ trước đó. Trừ 2 điểm.");
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, -2, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (msg.createdTimestamp - guildData.recentSentTime < 3000) {
            msg.reply("Bạn sử dụng bot hơi nhanh rồi, hãy chậm lại. Trừ 3 điểm.");
            msg.react("⏳");
            modifyPlayerScore(msg.guild.id, msg.author.id, -3, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (guildData.recentSentTime !== 0 && msg.content.toLowerCase().firstDigit() !== guildData.recentWord) {
            msg.reply(`Từ mới phải bắt đầu bằng \`${guildData.recentWord}\`. Trừ 3 điểm.`);
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, -3, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (!dict.hasOwnProperty(msg.content.toLowerCase())) {
            msg.reply(`Từ \`${msg.content.toLowerCase()}\` không tồn tại trong từ điển. Trừ 3 điểm.`);
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, -3, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }
        if (guildData.used.hasOwnProperty(msg.content.toLowerCase())) {
            msg.reply(`Từ \`${msg.content.toLowerCase()}\` đã được nối. Trừ 2 điểm.`);
            msg.react(emojiTable.not_ok);
            modifyPlayerScore(msg.guild.id, msg.author.id, -2, guildData);
            writeGuildFile(msg.guild.id, guildData);
            return;
        }

        modifyPlayerScore(msg.guild.id, msg.author.id, 2, guildData);
        guildData.used[msg.content.toLowerCase()] = 1;
        guildData.recentWord = msg.content.toLowerCase().lastDigit();
        guildData.recentSentTime = msg.createdTimestamp;
        guildData.recentUser = msg.author.id;

        try {
            msg.react(emojiTable.ok);
        } catch (error) {
            console.error(error);
        }

        writeGuildFile(msg.guild.id, guildData);
    }
}

module.exports = {
    isSetup,
    loadRawGuildFile,
    loadGuildFile,
    guildSetup,
    guildReset,
    getRoomId,
    isInRoom,
    preLoad,
    getUserScore,
    handleInput
}