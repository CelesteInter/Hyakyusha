const { SlashCommandBuilder } = require('discord.js');
// For "did you mean" feature
const Fuse = require('fuse.js');
// File search to read skill directory
const fs = require('fs');
// For future need - path allows for cross-platform compatability with directories.
// const path = require('path');

// For alternative names/Aliasing
const jobAliases = require('../../commands/search/jobAliases.json');

// get skills from data/embedSkills
const jobFiles = fs.readdirSync('./data/embedJobs') // scan files in data/embedJobs folder
    .filter(file => file.endsWith('.js')) // filter to just js files
    .map(file => file.replace('.js', '')); // replace js with nothing to get names

const fuse = new Fuse(jobFiles, { threshold: 0.4 }); // Larger threshold = less leniency

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('Lookup a job')
        .addStringOption(option =>
            option.setName('jobname')
            .setDescription('Name of the job to reference')
            .setRequired(true),
        ),
    async execute(interaction) {

        // Save input to a string and lowercase it
        let jobInput = interaction.options.getString('jobname');
        jobInput = jobInput.toLowerCase();

        // Determine if the input is an alias and convert if it is
        if (jobInput in jobAliases) {
            jobInput = jobAliases[jobInput];
        }

        // Try find a file in embedJobs with the name
        try {
            const tempPath = `../../data/embedJobs/${jobInput}.js`;
            const jobData = require(tempPath);

            return interaction.reply({ embeds: jobData.embeds, files: jobData.files });
        }
        catch { // error handling.
            const result = fuse.search(jobInput);

             // if result length is > 0, return best match
             // otherwise suggestion = null
            const suggestion = result.length > 0 ? result[0].item : null;

            let response = 'Invalid job name.';
            if (suggestion != null) {
                response += `\n\n Did you mean \`\`${suggestion}\`\`?`;
            }

            return interaction.reply({ content: response, ephemeral: true });
        }
    },
};