// Packages
const gameLib = require('#modules/trivia-game/lib/gameLib.js');

const emojiTable = Object.freeze({
    up: ':white_check_mark:',
    down: ':x:',
    skipped: ':interrobang:'
});

module.exports.execute = async (interaction, responseData, key, difficulty, type) => {
    if (!await gameLib.isRunning(interaction.guild.id)) return;
    const { up, down } = gameLib.getPenalty(type, difficulty);

    let correct = [], incorrect = [];

    Object.keys(responseData).forEach(id => {
        if (responseData[id] === key)
            correct.push(id);
        else
            incorrect.push(id);
    });

    let Content = `:alarm_clock:  Hết giờ! Đáp án là \`${key}\`\n`;

    if (correct.length > 0) {
        Content += `Các người chơi trả lời đúng và nhận được \`${up}\` điểm ${emojiTable.up}: ${correct.listing("<@", ">", ", ")}\n`;
    }

    if (incorrect.length > 0) {
        Content += `Các người chơi trả lời sai và bị trừ \`${Math.abs(down)}\` điểm ${emojiTable.down}: ${incorrect.listing("<@", ">", ", ")}\n`;
    }

    if (!responseData.hasOwnProperty(interaction.user.id)) {
        Content += `<@${interaction.user.id}> lấy bài nhưng không làm, phí phạm tài nguyên. Trừ \`${Math.abs(down)}\` điểm ${emojiTable.skipped}.`;
        incorrect.push(interaction.user.id);
    }

    await interaction.followUp({ content: Content, ephemeral: false });

    await gameLib.bulkSaveInstaceResult(interaction.guild.id, {
        win: correct,
        lose: incorrect
    }, type, difficulty);

    await gameLib.guildUnlock(interaction.guild.id);
}
