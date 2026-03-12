import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('botspeak')
	.setDescription('Make the bot speak a message')
	.addStringOption(option => option.setName('content')
		.setDescription('The message for the bot to say')
		.setRequired(true),
	);
export async function execute(interaction) {
	const userList = ['378308774747701258', '378789446327468033'];
	if (!userList.includes(interaction.user.id)) {
		return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
	}
	const messageContent = interaction.options.getString('content');
	interaction.reply({ content: 'Message sent.', ephemeral: true });
	interaction.channel.send(messageContent);
}