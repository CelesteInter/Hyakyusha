const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('togglereaction')
		.setDescription('Toggle automatic reactions')
		.addStringOption(option =>
			option.setName('boolean')
			.setDescription('True/False, to enable or disable automatic reactions')
			.setRequired(false),
		),
	async execute(interaction) {
		const userList = ['378308774747701258', '378789446327468033'];
		if (!userList.includes(interaction.user.id)) {
			return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		}
		const booleanValue = interaction.options.getString('boolean');
        const reactEnable = require('../../data/reactEnable.js');
        if (booleanValue === 'true') {
            reactEnable.reactEnabled = true;
            interaction.reply({ content: 'Automatic reactions have been enabled.', ephemeral: true });
        }
        else if (booleanValue === 'false') {
            reactEnable.reactEnabled = false;
            interaction.reply({ content: 'Automatic reactions have been disabled.', ephemeral: true });
        }
        else {
            reactEnable.reactEnabled = !reactEnable.reactEnabled;
            interaction.reply({ content: `Automatic reactions have been ${reactEnable.reactEnabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
        }
	},
};