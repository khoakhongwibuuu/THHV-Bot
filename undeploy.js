const Discord = require('discord.js');
const rest = new Discord.REST().setToken(process.env.TOKEN);
rest.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);