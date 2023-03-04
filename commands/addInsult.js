const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-insult')
        .setDescription('Add a Jiajin insult to the list of insults')
        .addStringOption(option =>
            option.setName('insult')
                .setDescription('The insult to add to the list of insults')
                .setRequired(true)),
    async execute(interaction) {
        const insult = interaction.options.getString("insult")
        fs.appendFile('insults.txt', `${insult}\n`, function(err) {
            if (err) throw err;
            console.log(`Added insult "${insult}"`)
        })
        await interaction.reply({content: `Added insult "${insult}"`})
    }
}