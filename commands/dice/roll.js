import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll some dice')
    .addStringOption(option => option.setName('dicetype')
        .setDescription('The type of dice to roll, e.g., 2d6, 1d20')
        .setRequired(true)
    );
export async function execute(interaction) {
    const diceType = interaction.options.getString('dicetype');
    const diceArray = diceType.split('d');
    if (diceArray.length !== 2) {
        return interaction.reply({ content: 'Invalid dice format. Use XdY format, e.g., 2d6.', ephemeral: true });
    }
    const numDice = parseInt(diceArray[0]);
    const diceSides = parseInt(diceArray[1]);
    if (isNaN(numDice) || isNaN(diceSides) || numDice <= 0 || diceSides <= 0) {
        return interaction.reply({ content: 'Invalid numbers in dice format. Ensure X and Y are positive integers.', ephemeral: true });
    }
    let total = 0;
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        rolls.push(roll);
        total += roll;
    }
    return interaction.reply({ content: `Rolls: \n ${rolls.join(', ')} \n Total: ${total}` });
}