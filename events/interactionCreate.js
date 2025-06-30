const Discord = require('discord.js');
const path = require('path');

const ticketLib = require(path.join(global.dirname, 'modules/ticket/lib/ticketLib.js'));

module.exports = {
	name: Discord.Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'This command is under development!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'This command is under development!', ephemeral: true });
				}
				console.log(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			try {
				if (interaction.guildId) {
					console.log(`[${new Date().toISOString()}] [COMMAND] ${interaction.user.id} (${interaction.user.username}) at ${interaction.guildId} > ${interaction.channelId}: /${command.data.name}`);
				} else {
					console.log(`[${new Date().toISOString()}] [COMMAND] ${interaction.user.id} (${interaction.user.username}) at DirectMessage: /${command.data.name}`);
				}
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
		if (interaction.isModalSubmit()) {
			try {
				if (interaction.guildId) {
					console.log(`[${new Date().toISOString()}] [MODAL] ${interaction.user.id} (${interaction.user.username}) at ${interaction.guildId} > ${interaction.channelId}: ${interaction.customId}`);
				} else {
					console.log(`[${new Date().toISOString()}] [MODAL] ${interaction.user.id} (${interaction.user.username}) at DirectMessage: ${interaction.customId}`);
				}

				if (interaction.customId === "ticket-setup-modal")
					ticketLib.handleTicketSetupModal(interaction);
				else {

				}
			} catch (error) {
				console.error(error);
			}
		}
		if (interaction.isButton()) {
			try {
				if (interaction.guildId) {
					console.log(`[${new Date().toISOString()}] [BUTTON] ${interaction.user.id} (${interaction.user.username}) at ${interaction.guildId} > ${interaction.channelId}: ${interaction.customId}`);
				} else {
					console.log(`[${new Date().toISOString()}] [BUTTON] ${interaction.user.id} (${interaction.user.username}) at DirectMessage: ${interaction.customId}`);
				}

				if (interaction.customId.startsWith("ticket-create-AC"))
					await ticketLib.handleAcceptTicketBtnInteraction(interaction);
				else if (interaction.customId === "exampleCreateTicket")
					await ticketLib.handleDumpedTicketBtnInteraction(interaction);
				else if (interaction.customId === "createTicket")
					await ticketLib.handleCreateTicketBtnInteraction(interaction);
				else if (interaction.customId === "destroyTicket")
					await ticketLib.handleClosedTicketBtnInteraction(interaction);
				else {

				}
			} catch (error) {
				console.error(error);
			}
		}
		if (interaction.isUserSelectMenu()) {

		}
	},
};