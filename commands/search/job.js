import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } from 'discord.js';
// For "did you mean" feature
import Fuse from 'fuse.js';
// File search to read skill directory
import { readdirSync } from 'fs';
// JSON parsing for aliases
import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';

// For alternative names/Aliasing
let jobAliases = JSON.parse(readFileSync('./commands/search/jobAliases.json'));
// import jobAliases from '../../commands/search/jobAliases.json' assert { type: 'json' };
export async function updateJobAlias() {
    try {
    jobAliases = JSON.parse(await readFile('./commands/search/jobAliases.json'));
    }
    catch {
    console.log("JSON invalid!");
    }
}

// get skills from data/embedJobs
const jobFiles = readdirSync('./data/embedJobs') // scan files in data/embedJobs folder
    .filter(file => file.endsWith('.json')) // filter to just js files
    .map(file => file.replace('.json', '')); // replace js with nothing to get names

const fuse = new Fuse(jobFiles, { threshold: 0.4 }); // Larger threshold = less leniency

export const data = new SlashCommandBuilder()
    .setName('job')
    .setDescription('Lookup a job')
    .addStringOption(option => option.setName('jobname')
        .setDescription('Name of the job to reference')
        .setRequired(true),
    );
export async function execute(interaction) {

    // Save input to a string and lowercase it
    let jobInput = interaction.options.getString('jobname');
    jobInput = jobInput.toLowerCase();

    // Determine if the input is an alias and convert if it is
    if (jobInput in jobAliases) {
        jobInput = jobAliases[jobInput];
    }

    // Try find a file in embedJobs with the name
    try {
        const tempPath = `../../data/embedJobs/${jobInput}.json`;
        const jobData = await JSON.parse(readFileSync(tempPath));

        return interaction.reply({ embeds: jobData.embeds, files: jobData.files });
    }
    catch (error) { // error handling.
        // debug
        if (error.code != 'ENOENT') {
            console.log(error);
        }

        const result = fuse.search(jobInput);
        // if result length is > 0, return best match
        // otherwise suggestion = null
        const suggestion = result.length > 0 ? result[0].item : null;

        let response = 'Invalid job name.';
        if (suggestion != null) {
            // Add suggestion to response
            response += `\n\n Did you mean \`\`${suggestion}\`\`?`;

            // Create button for suggestion selection
            const selectRecJob = new ButtonBuilder().setCustomId('selectRecJob').setLabel('Select').setStyle(ButtonStyle.Success);
            // Create button for suggestion selection and publish
            const selectShareJob = new ButtonBuilder().setCustomId('selectShareJob').setLabel('Select & Share').setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(selectRecJob, selectShareJob);

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
                if (confirmation.customId === 'selectRecJob') {
                    const tempPath = `./data/embedJobs/${suggestion}.json`;
                    const jobData = await JSON.parse(readFileSync(tempPath));

                    // Create button for suggestion selection and publish
                    const shareJob = new ButtonBuilder().setCustomId('shareJob').setLabel('Share').setStyle(ButtonStyle.Primary);

                    // Create additional row for new response
                    const followRow = new ActionRowBuilder().addComponents(shareJob);

                    const secondResponse = await confirmation.update({
                        content: '',
                        embeds: jobData.embeds,
                        files: jobData.files,
                        components: [followRow],
                        withResponse: true,
                    });
                    try {
                        const followConfirmation = await secondResponse.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                        if (followConfirmation.customId === 'shareJob') {
                            await interaction.channel.send({
                            content: `Shared by ${interaction.user}`,
                            embeds: jobData.embeds,
                            files: jobData.files,
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
                else if (confirmation.customId === 'selectShareJob') {
                    const tempPath = `./data/embedJobs/${suggestion}.json`;
                    const jobData = await JSON.parse(readFileSync(tempPath));
                    await interaction.channel.send({
                        content: `Shared by ${interaction.user}`,
                        embeds: jobData.embeds,
                        files: jobData.files,
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