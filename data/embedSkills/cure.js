const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

const file = new AttachmentBuilder('data/embedSkills/images/cure.png', { name: 'cure.png' });
const icon = new AttachmentBuilder('data/icons/cele.png', { name: 'cele.png' });

const embed = new EmbedBuilder()
    .setColor("#26c555")
    .setTitle('Cure I')
    .setDescription('Heal a single target for 1d4 HP.')
    .setThumbnail('attachment://cure.png')
    .setFooter({
        text: 'FFXIV Homebrew by Katalyste',
        iconURL: 'attachment://cele.png',
    });

// Export both the embed and the files so the main command can send them together
module.exports = {
    embeds: [embed],
    files: [file, icon],
};