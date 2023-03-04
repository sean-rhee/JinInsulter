const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume-insults')
        .setDescription('Resumes automatic Jiajin insults'),
    async execute(interaction) {
        if(interaction.client.paused) {
            await interaction.reply({content: `Resuming automatic Jiajin insults`})
        }
        else {
            await interaction.reply({content: "Automatic Jiajin insults are already on"})
        }
        interaction.client.resumeInsults();
    }
}