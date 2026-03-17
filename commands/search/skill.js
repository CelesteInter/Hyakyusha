import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } from 'discord.js';
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
let skillFiles = readdirSync('./data/embedSkills') // scan files in data/embedSkills folder
    .filter(file => file.endsWith('.json')) // filter to just js files
    .map(file => file.replace('.json', '')); // replace json with nothing to get names
let fuse = new Fuse(skillFiles, { threshold: 0.4 }); // Larger threshold = less leniency
// Hot-reload
export async function updateSkillFiles() {
    skillFiles = readdirSync('./data/embedSkills') // scan files in data/embedSkills folder
        .filter(file => file.endsWith('.json')) // filter to just js files
        .map(file => file.replace('.json', '')); // replace json with nothing to get names
    fuse = new Fuse(skillFiles, { threshold: 0.4 }); // Larger threshold = less leniency
}

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
            // Add suggestion to response
            response += `\n\n Did you mean \`\`${suggestion}\`\`?`;

            // Create button for suggestion selection
            const selectRecSkill = new ButtonBuilder().setCustomId('selectRecSkill').setLabel('Select').setStyle(ButtonStyle.Success);
            // Create button for suggestion selection and publish
            const selectShareSkill = new ButtonBuilder().setCustomId('selectShareSkill').setLabel('Select & Share').setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(selectRecSkill, selectShareSkill);

            // Reply to the message and await reaction
            const messageResponse = await interaction.reply({
                content: response,
                components: [row],
                flags: MessageFlags.Ephemeral,
                withResponse: true,
            });

            // create a filter so only author can interact with button
            const collectorFilter = (i) => i.user.id === interaction.user.id;
            // await reaction from message button, otherwise tell user interaction has expired
            try {
                // await confirmation
                const confirmation = await messageResponse.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                // Filter response based on selected button
                if (confirmation.customId === 'selectRecSkill') {
                    const tempPath = `./data/embedSkills/${suggestion}.json`;
                    const skillData = await JSON.parse(readFileSync(tempPath));

                    // Create button for suggestion selection and publish
                    const shareSkill = new ButtonBuilder().setCustomId('shareSkill').setLabel('Share').setStyle(ButtonStyle.Primary);

                    // Create additional row for new response
                    const followRow = new ActionRowBuilder().addComponents(shareSkill);

                    const secondResponse = await confirmation.update({
                        content: '',
                        embeds: skillData.embeds,
                        files: skillData.files,
                        components: [followRow],
                        withResponse: true,
                    });
                    try {
                        const followConfirmation = await secondResponse.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                        if (followConfirmation.customId === 'shareSkill') {
                            await interaction.channel.send({
                            content: `Shared by ${interaction.user}`,
                            embeds: skillData.embeds,
                            files: skillData.files,
                            components: [],
                        });
                        await followConfirmation.update({
                            content: 'Sent!',
                            embeds: [],
                            files: [],
                            components: [],
                        });
                        }
                    }
                    catch {
                        await interaction.editReply({ components: [] });
                    }
                }
                else if (confirmation.customId === 'selectShareSkill') {
                    const tempPath = `./data/embedSkills/${suggestion}.json`;
                    const skillData = await JSON.parse(readFileSync(tempPath));
                    await interaction.channel.send({
                        content: `Shared by ${interaction.user}`,
                        embeds: skillData.embeds,
                        files: skillData.files,
                        components: [],
                    });
                    await confirmation.update({
                        content: 'Sent!',
                        components: [],
                    });
                }

            }
            catch {
                await interaction.editReply({ content: 'Interaction expired, please try again', components: [] });
            }
        }
        else {
            return interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
        }
    }
}