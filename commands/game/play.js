const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('play')
        .setDescription('Get a random question.'),
    async execute(interaction) {
        const gameLib = require(dirname + '/assets/library/game.js');
        const serverLib = require(dirname + '/assets/library/server.js');
        const coreLib = require(dirname + '/assets/library/core.js');
        if (interaction.guildId === serverLib.load().guildID) {
            if (gameLib.loadSetting().enable === true || coreLib.load().owner === interaction.user.id) {
                if (gameLib.loadSetting().running === true) {
                    await interaction.reply({ content: 'Another session is running. Please wait.', ephemeral: true })
                } else {
                    gameLib.lock();
                    const frequencyMap = [
                        9, 9, 9,    // General Knowledge
                        17, 17, 17, // Nature Science
                        18, 18, 18, // Computer Science
                        19, 19, 19, // Math
                        22,         // Geography
                        23,         // History
                        27, 27, 27, // Animals
                        30, 30, 30, // Gadgets
                        31, 31      // Anime
                    ];

                    await fetch("https://opentdb.com/api.php?amount=1&encode=url3986" + `&category=${frequencyMap[Math.floor(frequencyMap.length * Math.random())]}`)
                        .then(response => response.json())
                        .then(Datablock => {
                            const questionBlock = Datablock.results[0];
                            if (questionBlock.type === "multiple") {
                                require(dirname + '/assets/handler/multiple.js').execute(interaction, questionBlock);
                            } else {
                                require(dirname + '/assets/handler/boolean.js').execute(interaction, questionBlock);
                            }
                        })
                        .catch(error => {
                            gameLib.unlock();
                            console.log(error);
                            interaction.reply({ content: "Unexpected error found.", ephemeral: true });
                        });
                }
            } else {
                interaction.reply({
                    content: "Public access for this command is not allowed. This command is under maintenance at the moment.",
                    ephemeral: true
                });
            }
        } else {
            interaction.reply({
                content: "This command cannot be used outside THHV.",
                ephemeral: true
            });
        }
    },
};