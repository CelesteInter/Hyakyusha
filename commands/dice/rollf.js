import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('rollf')
    .setDescription('Roll Fabulously')
    .addIntegerOption(option => option.setName('dicetype1')
        .setDescription('The type of dice to roll, i.e. 6, 8, 10')
        .setRequired(true)
    )
    .addIntegerOption(option => option.setName('dicetype2')
        .setDescription('Optional second type of dice to roll')
        .setRequired(true)
    )
    .addIntegerOption(option => option.setName('modifier')
        .setDescription('Optional modifier for the roll')
        .setRequired(false)
);
export async function execute(interaction) {
    // First roll
    const dice1 = interaction.options.getInteger('dicetype1');
    const dice2 = interaction.options.getInteger('dicetype2');
    let roll1 = 0;
    switch (dice1) {
        case 6:
            roll1 = Math.floor(Math.random() * 6) + 1;
            break;
        case 8:
            roll1 = Math.floor(Math.random() * 8) + 1;
            break;
        case 10:
            roll1 = Math.floor(Math.random() * 10) + 1;
            break;
        default:
            return interaction.reply({ content: 'Invalid dice size' });
    }
    let roll2 = 0;
    switch (dice2) {
        case 6:
            roll2 = Math.floor(Math.random() * 6) + 1;
            break;
        case 8:
            roll2 = Math.floor(Math.random() * 8) + 1;
            break;
        case 10:
            roll2 = Math.floor(Math.random() * 10) + 1;
            break;
        default:
            return interaction.reply({ content: 'Invalid dice size' });
    }
    let modifier = '';
    let total = 0;
    if (interaction.options.getInteger('modifier') != null) {
        modifier = `+ ${interaction.options.getInteger('modifier')}`;
        total = roll1 + roll2 + modifier;
    }
    else {
        total = roll1 + roll2;
    }

    if (roll1 > roll2) {
        return interaction.reply({ content: `Rolls: \n **${roll1}**, ${roll2} ${modifier} \n HR: **${roll1}** | Total: ${total}` });
    }
    else if (roll2 > roll1) {
        return interaction.reply({ content: `Rolls: \n ${roll1}, **${roll2}** ${modifier} \n HR: **${roll2}** | Total: ${total}` });
    }
    else {
        // Handle crits
        if (roll1 >= 6 && roll2 >= 6) {
            return interaction.reply({ content: `# Critical Success! \n Rolls: \n **${roll1}**, **${roll2}** ${modifier} \n HR: **${roll1}** | Total: ${total}` });
        }
        return interaction.reply({ content: `Rolls: \n *${roll1}*, *${roll2}* ${modifier} \n HR: *${roll1}* | Total: ${total}` });
    }
}