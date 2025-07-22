// Packages
const Discord = require('discord.js');
const path = require('node:path');

const moduleLookup = Object.freeze({
	"approval-form": global.customLib.formLib,
	"ticket": global.customLib.ticketLib
});

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
		} else if (interaction.customId) {
			// filter out collected requests
			if (!interaction.customId.includes(":"))
				return;

			const interactionToken = interaction.customId.split(":");
			const [moduleName, handlerType, handlerName, UUID] = interactionToken;
			const handlersPath = moduleLookup[moduleName].handlersPath;
			require(path.join(handlersPath, handlerType, handlerName)).exec(interaction, UUID);
		}

		if (interaction.isModalSubmit()) {
			try {
				if (interaction.guildId) {
					console.log(`[${new Date().toISOString()}] [MODAL] ${interaction.user.id} (${interaction.user.username}) at ${interaction.guildId} > ${interaction.channelId}: ${interaction.customId}`);
				} else {
					console.log(`[${new Date().toISOString()}] [MODAL] ${interaction.user.id} (${interaction.user.username}) at DirectMessage: ${interaction.customId}`);
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
			} catch (error) {
				console.error(error);
			}
		}
		if (
			interaction.isChannelSelectMenu() ||
			interaction.isMentionableSelectMenu() ||
			interaction.isRoleSelectMenu() ||
			interaction.isStringSelectMenu() ||
			interaction.isUserSelectMenu()
		) {
			try {
				if (interaction.guildId) {
					console.log(`[${new Date().toISOString()}] [SELECT-MENU] ${interaction.user.id} (${interaction.user.username}) at ${interaction.guildId} > ${interaction.channelId}: ${interaction.customId}`);
				} else {
					console.log(`[${new Date().toISOString()}] [SELECT-MENU] ${interaction.user.id} (${interaction.user.username}) at DirectMessage: ${interaction.customId}`);
				}
			} catch {

			}
		}
	},
};