import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
// File search to read skill directory
import { readdirSync, readFileSync } from 'fs';

// get skills from data/embedSkills
const skillFiles = readdirSync('./data/embedSkills') // scan files in data/embedSkills folder
    .filter(file => file.endsWith('.json')) // filter to just js files
    .map(file => {
        const data = JSON.parse(readFileSync(`./data/embedSkills/${file}`, 'utf-8'));
        return { name: file.replace('.json', ''), tag: data.tag };
    }); // replace json with nothing to get names

// sort skills

    // Create test objects - for testing larger amounts of skills
    // const dummies = 100;
    // for (let t = 0; t < dummies; t++) {
    //     skillFiles.push({ name: `dummy${t}`, tag: 'dummy' });
    // }

export const data = new SlashCommandBuilder()
    .setName('skills')
    .setDescription('List skills')
    .addBooleanOption((option) =>
		option.setName('sort').setDescription('list skills by tag'),
    );
export async function execute(interaction) {
    // Handle command execution
    // Unsorted function
    if (interaction.options.getBoolean('sort') != true) {
        return unsortedLibrary(interaction);
    }
    // Sorted function
    else {
        return sortedLibrary(interaction);
    }
}

async function unsortedLibrary(interaction) {
    // Create an initial list of first 15 skills
    let response = '';
    for (let i = 0; i < 15; i++) { // Iterate through first 15 abilities
        if (i < skillFiles.length) {
            response += skillFiles[i].name[0].toUpperCase() + skillFiles[i].name.slice(1) + '\n';
        }
        else {
            break;
        }
    }

    // Calculate # of pages
    const pages = Math.ceil(skillFiles.length / 15);

    // Add list of skills to embed
    let skillList = new EmbedBuilder()
        .setTitle('List of Skills')
        .setDescription(response)
        .setFooter({ text: `Page 1/${pages}` });

    // If more than 1 page of skills, setup pages and buttons
    if (pages != 1) {
        // assign current page variable
        let page = 1;
        let active = true;
        let confirmation;

        // Continue to loop while active
        while (active == true) {
            // End loop on fail
            try {
                // Create buttons
                const NextButton = new ButtonBuilder().setCustomId('next').setLabel('Next Page  ➡️').setStyle(ButtonStyle.Primary);
                const LastButton = new ButtonBuilder().setCustomId('last').setLabel('⬅️ Last Page').setStyle(ButtonStyle.Primary);

                // Create action row
                const row = new ActionRowBuilder().addComponents(LastButton, NextButton);

                // Reply to the message and await reaction
                let listResponse;
                try { // Attempt to update existing reply
                    listResponse = await confirmation.update({
                        embeds: [skillList],
                        components: [row],
                        flags: MessageFlags.Ephemeral,
                        withResponse: true,
                    });
                }
                catch { // If existing reply doesn't exist, create reply
                    listResponse = await interaction.reply({
                        embeds: [skillList],
                        components: [row],
                        flags: MessageFlags.Ephemeral,
                        withResponse: true,
                    });
                }

                // Filter response to author
                const collectorFilter = (i) => i.user.id === interaction.user.id;

                // Await response from user
                confirmation = await listResponse.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                // Filter response based on selected button
                if (confirmation.customId === 'last') {
                    // decrease page count
                    page--;
                    if (page <= 0) { // loop around
                        page = pages;
                    }
                    // Recreate skillList embed
                    response = '';
                    for (let i = 0; i < 15; i++) { // Iterate through 15 skills from page position in array
                        const index = i + ((page - 1) * 15);
                        if (index < skillFiles.length) {
                            response += skillFiles[index].name[0].toUpperCase() + skillFiles[index].name.slice(1) + '\n';
                        }
                        else {
                            break; // Exit the loop if the index is out of bounds
                        }
                    }
                    // Add list of skills to embed
                    skillList = new EmbedBuilder()
                        .setTitle('List of Skills')
                        .setDescription(response)
                        .setFooter({ text: `Page ${page}/${pages}` });
                }
                else if (confirmation.customId === 'next') { // Next page handling
                    // increase page count
                    page++;
                    if (page > pages) { // loop to start
                        page = 1;
                    }
                    // Recreate skillList embed
                    response = '';
                    for (let i = 0; i < 15; i++) {
                        const index = i + ((page - 1) * 15);
                        if (index < skillFiles.length) {
                            response += skillFiles[index].name[0].toUpperCase() + skillFiles[index].name.slice(1) + '\n';
                        }
                        else {
                            break; // Exit the loop if the index is out of bounds
                        }
                    }
                    // Add list of skills to embed
                    skillList = new EmbedBuilder()
                        .setTitle('List of Skills')
                        .setDescription(response)
                        .setFooter({ text: `Page ${page}/${pages}` });
                }
            }
            catch { // Break loop, clear skill list, remove reply
                active = false;
                skillList = [];
                interaction.editReply({ content: 'Interaction expired.', components: [] });
            }
        }
    }
    else {
        // Return basic embed to user
        return interaction.reply({ embeds: [skillList], flags: MessageFlags.Ephemeral });
    }
}

async function sortedLibrary(interaction) {
    return;
}
