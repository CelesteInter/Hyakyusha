import { SlashCommandBuilder } from 'discord.js';
// For "did you mean" feature
import Fuse from 'fuse.js';
// File search to read skill directory
import { readdirSync } from 'fs';
// JSON parsing for aliases
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';

// For alternative names/Aliasing
let skillAliases = JSON.parse(await readFile('./commands/search/skillAliases.json'));
export async function updateSkillAlias() {
    try {
    skillAliases = JSON.parse(await readFile('./commands/search/skillAliases.json'));
    }
    catch {
    console.log("JSON invalid!");
    }
}


// get skills from data/embedSkills
const skillFiles = readdirSync('./data/embedSkills') // scan files in data/embedSkills folder
    .filter(file => file.endsWith('.json')) // filter to just js files
    .map(file => file.replace('.json', '')); // replace js with nothing to get names

const fuse = new Fuse(skillFiles, { threshold: 0.4 }); // Larger threshold = less leniency

export const data = new SlashCommandBuilder()
    .setName('skill')
    .setDescription('Lookup a skill')
    .addStringOption(option => option.setName('skillname')
        .setDescription('Name of the skill to reference')
        .setRequired(true),
    );
export async function execute(interaction) {

    // Save input to a string and lowercase it
    let skillInput = interaction.options.getString('skillname');
    skillInput = skillInput.toLowerCase();

    // Determine if the input is an alias and convert if it is
    if (skillInput in skillAliases) {
        skillInput = skillAliases[skillInput];
    }

    // Try find a file in embedSkills with the name
    try {
        const tempPath = `./data/embedSkills/${skillInput}.json`;
        const skillData = await JSON.parse(readFileSync(tempPath));

        return interaction.reply({ embeds: skillData.embeds, files: skillData.files });
    }
    catch (error) { // error handling.
        // debug
        if (error.code != 'ENOENT') {
            console.log(error);
        }

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
}