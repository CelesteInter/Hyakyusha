import { SlashCommandBuilder } from 'discord.js';
export let reactEnable = false;

export const data = new SlashCommandBuilder()
	.setName('togglereaction')
	.setDescription('Toggle automatic reactions')
	.addStringOption(option => option.setName('boolean')
		.setDescription('True/False, to enable or disable automatic reactions')
		.setRequired(false),
	);
export async function execute(interaction) {
	const userList = ['378308774747701258', '378789446327468033'];
	if (!userList.includes(interaction.user.id)) {
		return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
	}
	const booleanValue = interaction.options.getString('boolean');
	if (booleanValue === 'true') {
		reactEnable = true;
		interaction.reply({ content: 'Automatic reactions have been enabled.', ephemeral: true });
	}
	else if (booleanValue === 'false') {
		reactEnable = false;
		interaction.reply({ content: 'Automatic reactions have been disabled.', ephemeral: true });
	}
	else {
		reactEnable = !reactEnable;
		interaction.reply({ content: `Automatic reactions have been ${reactEnable ? 'enabled' : 'disabled'}.`, ephemeral: true });
	}
}