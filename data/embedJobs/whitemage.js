const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const file = new AttachmentBuilder('data/embedJobs/images/whmstone.png', { name: 'stone.png' });
const icon = new AttachmentBuilder('data/icons/cele.png', { name: 'cele.png' });

const embed = new EmbedBuilder()
        .setTitle("White Mage")
    .setDescription("White magic, the arcane art of succor, was conceived eras past that the world might know comfort."
                    + " \nThose who would walk the path of the white mage are healers without peer,"
                    + " possessed of the power to deliver comrades from the direst of afflictions—even the icy grip of death itself.")
    .addFields(
        {
        name: "Something passives or abilities or whatever",
        value: "*passive* - generate mana or smthn idfk",
        inline: true,
        },
    )
    // TODO: setup this image later with an actual image
    // .setImage("attachment://")
    .setThumbnail("attachment://stone.png")
    .setColor("#4dff5b")
    .setFooter({
    text: "FFXIV homebrew By Katalyste",
    iconURL: "attachment://cele.png",
    });

// Export both the embed and the files so the main command can send them together
module.exports = {
    embeds: [embed],
    files: [file, icon],
};