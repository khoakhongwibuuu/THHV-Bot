const Discord = require('discord.js');
const { ClientID, token } = require('./configs/auth.json');
const { guildID } = require('./configs/server.json');
const rest = new Discord.REST().setToken(token);

rest.put(Discord.Routes.applicationGuildCommands(ClientID, guildID), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);

rest.put(Discord.Routes.applicationCommands(ClientID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);