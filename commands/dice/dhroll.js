import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('dhroll')
    .setDescription('Roll your duality dice');
export async function execute(interaction) {

    // Initialize and randomize variable for hope and fear rolls
    const hope = Math.floor(Math.random() * 12) + 1;
    const fear = Math.floor(Math.random() * 12) + 1;

    // initialize variable for result
    let result;

    // Determine result based on hope and fear values
    if (hope > fear) {
        result = '**HOPE!**';
    }
    if (fear > hope) {
        result = '__*FEAR!*__';
    }
    if (hope === fear) {
        result = '# CRITICAL SUCCESS!';
    }

    // Construct and send the reply message
    let replyMessage = `You rolled:\n Hope: ${hope}    Fear: ${fear} \n **Result: ${hope + fear}**`;
    if (result != '# CRITICAL SUCCESS!') {
        replyMessage += `\n with ${result}`;
    }
    else {
        replyMessage += `\n${result}`;
    }
    interaction.reply({ content: replyMessage });
}