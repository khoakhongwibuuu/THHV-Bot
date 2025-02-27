const path = require('path');
const Discord = require('discord.js');

// Module Specified
const mcLib = require(path.join(global.dirname, 'modules/multiple-choice/lib/gameLib.js'));

const execute = (interaction, questionBlock) => {
    const validKey = ['A', 'B', 'C', 'D'];

    const guildTime = mcLib.loadGuildFile(interaction.guildId).setting.time;
    const ETA = guildTime.base + guildTime[questionBlock.difficulty];

    let correctKeyIdx = global.stdlib.trueRnd(0, 3);
    const correctKey = validKey[correctKeyIdx];

    let incorrectAnswer = questionBlock.incorrect_answers;
    let incorrectIdx = 0;
    global.stdlib.shuffle(incorrectAnswer);

    let content = "";
    validKey.forEach((OptionalKey, idx) => {
        const answer = (OptionalKey) === correctKey ? questionBlock.correct_answer : incorrectAnswer[incorrectIdx++];
        content += `**${OptionalKey}**. ${answer.URLdecode()}${idx == 3 ? "" : "\n"}`;
    });

    require('./deliver')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            questionBlock.question.URLdecode(),
            correctKey, content, "multiple", ETA);
}

module.exports = {
    execute
}