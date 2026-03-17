import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
// File search to read skill directory
import { readdirSync, readFileSync } from 'fs';

// get skills from data/embedSkills
const skillFiles = readdirSync('./data/embedSkills') // scan files in data/embedSkills folder
    .filter(file => file.endsWith('.json')) // filter to just js files
    .map(file => {
        const data = JSON.parse(readFileSync(`./data/embedSkills/${file}`, 'utf-8'));
        return { name: file.replace('.json', ''), tag: data.tag };
    }); // replace json with nothing to get names

export const data = new SlashCommandBuilder()
    .setName('skills')
    .setDescription('List skills');
export async function execute(interaction) {

    // Create test objects - for testing larger amounts of skills
    const dummies = 100;
    for (let t = 0; t < dummies; t++) {
        skillFiles.push({ name: `dummy${t}`, tag: 'dummy' });
    }

    // Create an initial list of first 15 skills
    let response = '';
    for (let i = 0; i < 15; i++) {
        if (i < skillFiles.length) {
            response += skillFiles[i].name[0].toUpperCase() + skillFiles[i].name.slice(1) + '\n';
        }
        else {
            break;
        }
    }
    const pages = Math.ceil(skillFiles.length / 15);

    // Add list of skills to embed
    const skillList = new EmbedBuilder()
        .setTitle('List of Skills')
        .setDescription(response)
        .setFooter({ text: `Page 1/${pages}` });

    // Return embed to user
    return interaction.reply({ embeds: [skillList], flags: MessageFlags.Ephemeral });
}