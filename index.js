const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, ApplicationCommandOptionType, Routes, Collection, Events } = require('discord.js');
const { REST } = require("@discordjs/rest");
const config = require("./config.json");
const utils = require('./utils');
const cron = require('cron');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    automaticJinInsulter.start();
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

        let commands = []
        client.commands.each(command => {
            commands.push(command.data.toJSON());
        })

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.paused = false;
const automaticJinInsulter = new cron.CronJob('0 */4 * * *', async () => {
    const channel = await client.channels.fetch('173285533227810816');
    const insultsFile = fs.readFileSync('insults.txt', 'UTF-8');
    const insults = insultsFile.split(/\r?\n/);
    const insult = insults[utils.randomInt(0, insults.length - 2)];
    await channel.send(insult);
})

client.pauseInsults = function() {
    automaticJinInsulter.stop();
    client.paused = true;
}
client.resumeInsults = function() {
    automaticJinInsulter.start();
    client.paused = false;
}

client.login(config.BOT_TOKEN);