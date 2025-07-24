// Packages
const Discord = require('discord.js');
const { gameLib } = global.customLib;

const statBuilder = (playerId, playerScore) => {
    if (playerScore === null) {
        return {
            uuid: playerId,
            current: "0",

            attempt: "0",
            correct: "0",
            rate: "0%",

            streak: "0",
            max: "0"
        }
    } else {
        let maxLength = 1, length = 1, correct = 0, datasize = playerScore.length;
        for (let i = 1; i < datasize; i++) {
            if (playerScore[i] > playerScore[i - 1]) {
                length++;
                correct++;
            }
            else {
                maxLength = Math.max(length, maxLength);
                length = 1;
            }
        }
        let accuracy = ((correct / (datasize - 1)) * 100);
        if (accuracy !== Math.floor(accuracy)) accuracy = accuracy.toFixed(2);
        return {
            uuid: playerId,
            current: (playerScore.lastValue()).toString(),

            attempt: (datasize - 1).toString(),
            correct: (correct).toString(),
            rate: `${accuracy}%`,

            streak: (Math.max(length, maxLength) - 1).toString(),
            max: (Math.max(...playerScore)).toString()
        }
    }
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-statistic')
        .setDescription('View your Trivia game statistics or anyone else.')
        .addUserOption(option =>
            option.setName("member")
                .setDescription("Member whose statistics you want to view")
                .setRequired(false)
        )
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        const target = interaction.options.getUser('member') ?? interaction.user;
        const targetScore = gameLib.readPlayerScore(interaction.guildId, target.id);
        const targetStat = statBuilder(target.id, targetScore);
        const sentEmbed = new Discord.EmbedBuilder()
            .setTitle(`Dữ liệu game MultipleChoice`)
            .setDescription(`Dữ liệu sau đây thuộc về <@${target.id}>\n`)
            .addFields(
                { name: "UUID", value: `\`\`\`${targetStat.uuid}\`\`\``, inline: false },
                { name: "Điểm hiện tại", value: `\`\`\`${targetStat.current}\`\`\``, inline: true },
                { name: "Số lượt đã chơi", value: `\`\`\`${targetStat.attempt}\`\`\``, inline: true },
                { name: "Số lượt đúng", value: `\`\`\`${targetStat.correct}\`\`\``, inline: true },
                { name: "Tỉ lệ đúng", value: `\`\`\`${targetStat.rate}\`\`\``, inline: true },
                { name: "Chuỗi đúng dài nhất", value: `\`\`\`${targetStat.streak}\`\`\``, inline: true },
                { name: "Điểm cao nhất từng đạt", value: `\`\`\`${targetStat.max}\`\`\``, inline: true },
            )
            .setTimestamp()
        await interaction.reply({ embeds: [sentEmbed], ephemeral: !gameLib.isInRoom(interaction.guild.id, interaction.channel.id) | gameLib.isRunning(interaction.guild.id) });
    },
};
