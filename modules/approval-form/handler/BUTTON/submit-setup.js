const Discord = require('discord.js');
const { formLib, memory, discordAPI, discordAPIv2 } = global.customLib;
const { client } = global.variable;

module.exports.exec = async (interaction, UUID) => {
    const wizardSession = memory.getData(UUID);
    interaction.message.delete();
    memory.deleteData(UUID);

    formLib.guildSetup(interaction.guild.id, {
        ...wizardSession.data,
        waitApproval: {}
    });

    const broadcastChannel = await discordAPIv2.GuildChannel(interaction.guild.id, wizardSession.data.send);

    // await discordAPI.GuildChannel(interaction.guild.id, wizardSession.data.send).send({
    await broadcastChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(0xf6630d)
                .setFooter({
                    text: "Powered by Approval Form module.",
                    iconURL: client.user.avatarURL()
                })
                .setTitle("Khai báo/Cập nhật thông tin thành viên Tin học Hùng Vương")
                .setDescription(
                    "* Form này dùng để khai báo thông tin thành viên các khoá tin, đội tuyển tin HV nhằm mục đích thêm thành viên vào các group trên Codeforces, VNOJ, Google Drive học tập và Discord Tin học Hùng Vương."
                    + "\n* Nếu có thay đổi thông tin trong quá trình học, bạn có thể sử dụng form này để cập nhật."
                    + "\n* Về quyền riêng tư của thông tin này: Các thông tin được điền trong form này là công khai với mọi thành viên THHV. Thành viên không được phép công khai các thông tin này lên Internet. "
                )
        ],
        components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`approval-form:BUTTON:client-main-interaction:${0}`)
                    .setLabel("Khai báo/Cập nhật thông tin")
                    .setStyle(Discord.ButtonStyle.Success)
            )
        ]
    });
}