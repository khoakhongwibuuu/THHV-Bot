// Packages
const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('vote-row')
        .setDescription('Create a vote row with multiple options.')
        .addIntegerOption(option =>
            option.setName("number-of-options")
                .setDescription("The number of options.")
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        await interaction.reply(`Vote đi mng`);
        const message = await interaction.fetchReply();
        const num = interaction.options.getInteger('number-of-options');
        for (let i = 1; i <= num; i++)
            await message.react(['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][i - 1]);
    },
};
