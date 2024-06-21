const Discord = require('discord.js');
const { ClientID, token } = require('./configs/auth.json');
const rest = new Discord.REST().setToken(token);
rest.put(Discord.Routes.applicationCommands(ClientID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);