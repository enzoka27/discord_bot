/**
 * Unban Command Module
 * Removes a ban from a previously banned user
 * Requires Ban Members permission
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Command definition with permission requirements
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Removes the ban from a user')
        .addStringOption(opt =>
         opt.setName('id')
            .setDescription('ID of the user to unban')
            .setRequired(true))
        .addStringOption(opt =>
         opt.setName('reason')
            .setDescription('Reason for unban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    /**
     * Execute unban command
     * @param {Interaction} interaction - Discord interaction object
     */
    async execute(interaction){
        // Verify command is used in a server context
        if(!interaction.guild){
            return interaction.reply({
                content: 'This command can only be used in servers. Add me to a server to use it!',
                ephemeral: true,
            });
        }

        // Fetch user ID and reason
        const userID = interaction.options.getString('id');
        const reason = interaction.options.getString('reason') ?? 'Not specified';

        try{
            // Verify user is actually banned
            const banned = await interaction.guild.bans.fetch(userID).catch(() => null);
            // .catch() silently handles error and returns null instead of crashing

            if(!banned){
                return interaction.reply({
                    content: 'This user is not banned or the ID is invalid.',
                    ephemeral: true,
                });
            }

            // Remove the ban
            await interaction.guild.members.unban(userID, reason);

            await interaction.reply({
                content: `<@${userID}> has been unbanned. Reason: ${reason}.`,
                ephemeral: false,
            });
        } catch (error){
            await interaction.reply({
                content: 'Could not unban this user. Verify that the ID is correct.',
                ephemeral: true,
            });
        }
    }
}