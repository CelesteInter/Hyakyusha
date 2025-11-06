const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botspeak')
		.setDescription('Make the bot speak a message')
		.addStringOption(option =>
			option.setName('content')
			.setDescription('The message for the bot to say')
			.setRequired(true),
		),
	async execute(interaction) {
		if (interaction.user.id !== '378308774747701258') {
			return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		}
		const messageContent = interaction.options.getString('content');
		interaction.reply({ content: 'Message sent.', ephemeral: true });
		interaction.channel.send(messageContent);
	},
};