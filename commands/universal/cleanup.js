// Packages
const path = require('node:path');
const fs = require('node:fs');
const Discord = require('discord.js');
const { dirname, client } = global.variable;

const cleanModule = async (moduleName, joined) => {
    const configDir = path.join(dirname, 'configs', moduleName, 'config');
    const unusedConfigFiles = fs.readdirSync(configDir)
        .filter(file => path.extname(file) === '.json')
        .map(file => path.basename(file, '.json'))
        .filter(file => !joined.includes(file));

    console.log('Unused config files of', moduleName, ':', unusedConfigFiles);
    if (unusedConfigFiles.length > 0) {
        unusedConfigFiles.forEach(name => {
            fs.unlinkSync(path.join(configDir, `${name}.json`));
        });
    }
}

const cleanupMain = async () => {
    const joined = client.guilds.cache.map(guild => guild.id);
    const excludedModules = ['contest', 'codeforces-utils'];

    const modules = fs.readdirSync(path.join(dirname, 'modules'))
        .filter(name => fs.statSync(path.join(dirname, 'modules', name)).isDirectory())
        .filter(name => !excludedModules.includes(name));

    modules.forEach(async moduleName => {
        await cleanModule(moduleName, joined);
    });
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('cleanup')
        .setDescription('[Hosts Only] - Cleanup unused configuration files.')
    ,
    deprecated: true,
    async execute(interaction) {
        if (process.env.OWNER_ID === interaction.user.id) {
            await interaction.reply({
                content: "Cleanup started!",
                ephemeral: true
            });

            await cleanupMain();

            await interaction.followUp({
                content: "Cleanup finished! Bot will shut down now.",
                ephemeral: true
            });
            console.log(`[${new Date().toISOString()}] [SUCCESS] Cleanup finished. Shutting down the bot.`);
            setTimeout(() => process.exit(1), 1500);
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
