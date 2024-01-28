const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
	name: Discord.Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		try {
			await (`[${new Date().toISOString()}] [COMMAND] ${interaction.user.id} (${interaction.user.username}) at ${interaction.guildId} > ${interaction.channelId}: /${command.data.name}`).logE();
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};