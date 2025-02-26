// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module based
const dict = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/word-match/database/default.dict.min.json'), 'utf-8'));

// Configuration
const emojiTable = Object.freeze({
    ok: '<:wm_ok:1277623512651141141>',
    not_ok: '<:wm_not_ok:1277623510780481687>'
});

// Functions
const isSetup = (guildId) => {
    const guildDataPath = path.join(dirname, 'modules/word-match/config', `${guildId}.json`);
    return fs.existsSync(guildDataPath);
}

const loadGuildFile = (guildId) => {
    const guildDataPath = path.join(dirname, 'modules/word-match/config', `${guildId}.json`);
    return JSON.parse(fs.readFileSync(guildDataPath, 'utf-8'));
}

const writeGuildFile = (guildId, newData) => {
    const guildDataPath = path.join(dirname, 'modules/word-match/config', `${guildId}.json`);
    fs.writeFileSync(guildDataPath, JSON.stringify(newData), 'utf8');
}

const guildSetup = (guildId, channelId) => {
    const guildDataPath = path.join(dirname, 'modules/word-match/config', `${guildId}.json`);
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
    else return loadGuildFile(guildId).channelId;
}

const isInRoom = (guildId, testChannelId) => {
    if (!isSetup(guildId)) return false;
    else return (getRoomId(guildId) === testChannelId);
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

module.exports.isSetup = isSetup;
module.exports.loadGuildFile = loadGuildFile;
module.exports.guildSetup = guildSetup;
module.exports.guildReset = guildReset;
module.exports.getRoomId = getRoomId;
module.exports.isInRoom = isInRoom;
module.exports.getUserScore = getUserScore;
module.exports.handleInput = handleInput;