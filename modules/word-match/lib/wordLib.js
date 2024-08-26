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
const defaultSettingProfile = (channelId) => {
    return {
        channelId: channelId,
        recentUser: null,
        recentWord: null,
        recentSentTime: 0,
        playerScore: {},
        used: {}
    }
}

// Functions
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
        fs.writeFileSync(guildDataPath, JSON.stringify(defaultSettingProfile(channelId)), 'utf8');
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

const isValidChannel = (guildId, channelId) => {
    const guildDataPath = path.join(dirname, 'modules/word-match/config', `${guildId}.json`);
    if (!fs.existsSync(guildDataPath)) return false;
    else {
        const guildData = loadGuildFile(guildId);
        return (guildData.channelId === channelId);
    }
}

const modifyPlayerScore = (guildId, playerId, offset) => {
    const guildData = loadGuildFile(guildId);
    if (!guildData.playerScore.hasOwnProperty(playerId)) {
        guildData.playerScore[playerId] = [0, offset];
    } else {
        guildData.playerScore[playerId].push(guildData.playerScore[playerId].lastValue() + offset);
    }
    return guildData;
}

const handleInput = (msg) => {
    if (msg.author.bot || msg.system || msg.tts || msg.content.hasWhiteSpace() || !msg.content.englishOnly()) return;
    if (isValidChannel(msg.guildId, msg.channelId)) {
        let guildData = loadGuildFile(msg.guildId);
        if (msg.author.id === guildData.recentUser) {
            msg.reply("Bạn đã nối từ trước đó. Trừ 2 điểm.");
            msg.react("<:WA:700345520039657613>");
            guildData = modifyPlayerScore(msg.guildId, msg.author.id, -2);
            writeGuildFile(msg.guildId, guildData);
            return;
        }
        if (msg.createdTimestamp - guildData.recentSentTime < 3000) {
            msg.reply("Bạn sử dụng bot hơi nhanh rồi, hãy chậm lại. Trừ 3 điểm.");
            msg.react("⏳");
            guildData = modifyPlayerScore(msg.guildId, msg.author.id, -3);
            writeGuildFile(msg.guildId, guildData);
            return;
        }
        if (guildData.recentSentTime !== 0 && msg.content.toLowerCase().firstDigit() !== guildData.recentWord) {
            msg.reply(`Từ mới phải bắt đầu bằng \`${guildData.recentWord}\`. Trừ 3 điểm.`);
            msg.react("<:WA:700345520039657613>");
            guildData = modifyPlayerScore(msg.guildId, msg.author.id, -3);
            writeGuildFile(msg.guildId, guildData);
            return;
        }
        if (!dict.hasOwnProperty(msg.content.toLowerCase())) {
            msg.reply(`Từ \`${msg.content.toLowerCase()}\` không tồn tại trong từ điển. Trừ 3 điểm.`);
            msg.react("<:WA:700345520039657613>");
            guildData = modifyPlayerScore(msg.guildId, msg.author.id, -3);
            writeGuildFile(msg.guildId, guildData);
            return;
        }
        if (guildData.used.hasOwnProperty(msg.content.toLowerCase())) {
            msg.reply(`Từ \`${msg.content.toLowerCase()}\` đã được nối. Trừ 2 điểm.`);
            msg.react("<:WA:700345520039657613>");
            guildData = modifyPlayerScore(msg.guildId, msg.author.id, -2);
            writeGuildFile(msg.guildId, guildData);
            return;
        }

        guildData.used[msg.content.toLowerCase()] = 1;
        guildData.recentWord = msg.content.toLowerCase().lastDigit();
        guildData.recentSentTime = msg.createdTimestamp;
        guildData.recentUser = msg.author.id;

        msg.react("<:AC:700345520081600512>");
        msg.react("➕");
        msg.react("2️⃣");

        guildData = modifyPlayerScore(msg.guildId, msg.author.id, 2);
        writeGuildFile(msg.guildId, guildData);
    }
}

// Lib validation
const validateLib = () => { return true }

module.exports.guildSetup = guildSetup;
module.exports.guildReset = guildReset;
module.exports.handleInput = handleInput;
module.exports.validateLib = validateLib;