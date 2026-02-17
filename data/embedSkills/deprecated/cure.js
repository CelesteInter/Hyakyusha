import { EmbedBuilder, AttachmentBuilder } from 'discord.js';

// DEPRECATED MODULE - Previously used for importing in CJS, but replaced with static json files

const file = new AttachmentBuilder('data/embedSkills/images/cure.png', { name: 'cure.png' });
const icon = new AttachmentBuilder('data/icons/cele.png', { name: 'cele.png' });

const embed = new EmbedBuilder()
    .setColor("#4dff5b")
    .setTitle('Cure I')
    .setDescription('Heal a single target for 1d20 HP.')
    .setThumbnail('attachment://cure.png')
    .setFooter({
        text: 'FFXIV Homebrew by Katalyste',
        iconURL: 'attachment://cele.png',
    });

// Export both the embed and the files so the main command can send them together
export const embeds = [embed];
export const files = [file, icon];