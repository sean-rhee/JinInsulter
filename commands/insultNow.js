const fs = require('node:fs');
const utils = require('../utils');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insult-now')
        .setDescription('Insults Jiajin immediately'),
    async execute(interaction) {
        const insultsFile = fs.readFileSync('insults.txt', 'UTF-8');
        const insults = insultsFile.split(/\r?\n/);
        await interaction.deferReply();
        const insult = insults[utils.randomInt(0, insults.length-2)];
        await interaction.followUp({content: insult})
    }
}