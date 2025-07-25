// Packages
const Discord = require('discord.js');
const { formLib, discordAPI, memory } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('form-setup')
        .setDescription('[Admin Only] - Setup member\'s information management panel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!discordAPI.isAdmin(interaction.guild.id, interaction.user.id)) {
            await interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }
        if (formLib.isSetup(interaction.guild.id)) {
            await interaction.reply({
                content: `⚠️ Nothing changed. Member\'s information management panel has been installed in this server.`,
                ephemeral: true
            });
            return;
        }

        const embed = {
            title: '**THHV Member\'s information management panel setup wizard**',
            description: "Đây là trình thiết lập module khai báo/cập nhật thông tin thành viên THHV."
                + "\n"
                + "\n**Quy trình xác thực (Dành cho tính năng `Khai báo thông tin thành viên`):**"
                + "\n* Thành viên mới tạo yêu cầu xác thực tại `Kênh gửi yêu cầu xác thực`."
                + "\n* Các moderator/admin có thể chấp thuận/từ chối yêu cầu tại `Kênh nhận yêu cầu xác thực`."
                + "\n* Các thành viên được chấp nhận yêu cầu sẽ được cấp `Role xác thực`."
                + " Role này sẽ được dùng để phân biệt các thành viên đã xác thực với chưa xác thực."
            ,
            fields: [
                {
                    name: 'Kênh gửi yêu cầu xác thực',
                    value: 'Chưa thiết lập',
                    inline: true
                },
                {
                    name: 'Kênh nhận yêu cầu xác thực',
                    value: 'Chưa thiết lập',
                    inline: true
                },
                {
                    name: 'Role xác thực',
                    value: 'Chưa thiết lập'
                }
            ]
        };

        let wizardSession = {
            embed: embed,
            components: null,
            data: {
                send: null,
                receive: null,
                role: null
            }
        }

        const UUID = memory.setData(wizardSession, 900 * 1000);

        const sendChannelSelectionRow = new Discord.ActionRowBuilder().addComponents(
            new Discord.ChannelSelectMenuBuilder()
                .setCustomId(`approval-form:SELECT:send-channel:${UUID}`)
                .setPlaceholder('Chọn kênh để gửi các yêu cầu xác thực.')
                .setChannelTypes(Discord.ChannelType.GuildText)
                .setMinValues(1)
                .setMaxValues(1)
        );

        const receiveChannelSelectionRow = new Discord.ActionRowBuilder().addComponents(
            new Discord.ChannelSelectMenuBuilder()
                .setCustomId(`approval-form:SELECT:receive-channel:${UUID}`)
                .setPlaceholder('Chọn kênh để nhận các yêu cầu xác thực.')
                .setChannelTypes(Discord.ChannelType.GuildText)
                .setMinValues(1)
                .setMaxValues(1)
        );

        const roleSelectionRow = new Discord.ActionRowBuilder().addComponents(
            new Discord.RoleSelectMenuBuilder()
                .setCustomId(`approval-form:SELECT:verified-role:${UUID}`)
                .setPlaceholder('Chọn role dành cho các thành viên đã xác thực.')
                .setMinValues(1)
                .setMaxValues(1)
        );

        const btnRowDisabled = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setLabel("Submit")
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId(`approval-form:BUTTON:submit-setup:${UUID}`)
                .setDisabled(true),
            new Discord.ButtonBuilder()
                .setLabel("Cancel")
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId(`approval-form:BUTTON:cancel-setup:${UUID}`)
                .setDisabled(false)
        )

        const btnRowEnabled = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setLabel("Submit")
                .setStyle(Discord.ButtonStyle.Primary)
                .setCustomId(`approval-form:BUTTON:submit-setup:${UUID}`)
                .setDisabled(false),
            new Discord.ButtonBuilder()
                .setLabel("Cancel")
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId(`approval-form:BUTTON:cancel-setup:${UUID}`)
                .setDisabled(false)
        )

        wizardSession.components = [
            sendChannelSelectionRow,
            receiveChannelSelectionRow,
            roleSelectionRow,
            btnRowDisabled,
            btnRowEnabled
        ];

        memory.modifyData(UUID, wizardSession);

        await interaction.reply({
            embeds: [
                embed
            ],
            components: [
                sendChannelSelectionRow,
                receiveChannelSelectionRow,
                roleSelectionRow,
                btnRowDisabled,
            ]
        });
    },
};
