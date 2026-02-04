const { SlashCommandBuilder } = require('discord.js');
// For "did you mean" feature
const Fuse = require('fuse.js');
// File search to read skill directory
const fs = require('fs');
// Path requirement
const path = require('path');

// get skills from data/embedSkills
const skillFiles = fs.readdirSync('./data/embedSkills') // scan files in data/embedSkills folder
    .filter(file => file.endsWith('.js')) // filter to just js files
    .map(file => file.replace('.js', '')); // replace js with nothing to get names

const fuse = new Fuse(skillFiles, { threshold: 0.4 }); // Larger threshold = less leniency

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skill')
        .setDescription('Lookup a skill')
        .addStringOption(option =>
            option.setName('skillname')
            .setDescription('Name of the skill to reference')
            .setRequired(true),
        ),
    async execute(interaction) {

        // Save input to a string and lowercase it
        let skillInput = interaction.options.getString('skillname');
        skillInput = skillInput.toLowerCase();

        // Try find a file in embedSkills with the name
        try {
            const tempPath = `../../data/embedSkills/${skillInput}.js`;
            const skillData = require(tempPath);

            return interaction.reply({ embeds: skillData.embeds, files: skillData.files });
        }
        catch { // error handling.
            const result = fuse.search(skillInput);

             // if result length is > 0, return best match
             // otherwise suggestion = null
            const suggestion = result.length > 0 ? result[0].item : null;

            let response = 'Invalid skill name.';
            if (suggestion != null) {
                response += `\n\n Did you mean \`\`${suggestion}\`\`?`;
            }

            return interaction.reply({ content: response, ephemeral: true });
        }
    },
};