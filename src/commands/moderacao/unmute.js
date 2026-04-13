/**
 * Unmute Command Module
 * Removes the mute/timeout from a silenced user
 * Requires Moderate Members permission
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Command definition with permission requirements
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Removes the mute from a user')
        .addUserOption(opt => 
         opt.setName('user')
            .setDescription('User to unmute')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    /**
     * Execute unmute command
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

        // Fetch user and member
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        // Verify user is actually muted
        if(!member.isCommunicationDisabled()){ 
            // isCommunicationDisabled() checks if user is currently in timeout
            return interaction.reply({
                content: `${member} is not muted.`,
                ephemeral: true,
            });
        }
       
        try{
            // timeout(null) removes mute by canceling the active timeout
            await member.timeout(null);
            await interaction.reply({
                content: `${member} has been unmuted.`,
                ephemeral: false,
            });
        } catch (error){
            await interaction.reply({
                content: 'Could not remove silence. Verify that the bot role is higher than the user role.',
                ephemeral: true,
            });
        }
    }
}