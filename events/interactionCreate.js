const Discord = require('discord.js');
const path = require('path');

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

		}
		if (interaction.isButton()) {

		}
		if (interaction.isUserSelectMenu()) {

		}
	},
};