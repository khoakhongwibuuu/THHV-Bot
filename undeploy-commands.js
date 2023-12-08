const { REST, Routes } = require('discord.js');
const { ClientID, token } = require('./configs/auth.json');
const { guildID } = require('./configs/server.json')
const rest = new REST().setToken(token);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(ClientID, guildID), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(ClientID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);