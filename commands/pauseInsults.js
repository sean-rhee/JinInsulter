const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause-insults')
        .setDescription('Pauses automatic Jiajin insults'),
    async execute(interaction) {
        if(interaction.client.paused) {
            await interaction.reply({content: "Automatic Jiajin insults are already paused"})
        }
        else {
            await interaction.reply({content: `Pausing automatic Jiajin insults`})
        }
        interaction.client.pauseInsults();
    }
}