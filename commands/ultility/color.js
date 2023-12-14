const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

const hexToRgb = (hex) => {
    let obj = {}
    obj.r = +("0x" + hex[1] + hex[2]);
    obj.g = +("0x" + hex[3] + hex[4]);
    obj.b = +("0x" + hex[5] + hex[6]);
    return obj
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('color')
        .setDescription('Randomly generate color with Hex and RGB.'),
    async execute(interaction) {
        let hexString = ("000000" + Math.floor(Math.random() * 16777216).toString(16)).slice(-6);
        let intString = parseInt(hexString, 16);
        let RGB = hexToRgb('#' + hexString.toUpperCase())
        await interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setColor(intString)
                .addFields(
                    {
                        name: 'Hex',
                        value: `\`\`\`css\n#${hexString.toUpperCase()}\`\`\``
                    },
                    {
                        name: 'Red',
                        value: `\`\`\`json\n${RGB.r}\`\`\``,
                        inline: true
                    },
                    {
                        name: 'Green',
                        value: `\`\`\`json\n${RGB.g}\`\`\``,
                        inline: true
                    },
                    {
                        name: 'Blue',
                        value: `\`\`\`json\n${RGB.b}\`\`\``,
                        inline: true
                    },
                )
                .setFooter({ text: `Requested by ${interaction.user.username} at ` })
                .setTimestamp()]
        });
    },
};