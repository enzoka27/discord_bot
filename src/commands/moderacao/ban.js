/**
 * Ban Command Module
 * Permanently bans a user from the server
 * Requires Ban Members permission
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  // Command definition with permission requirements
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Permanently bans a member from the server')
    .addUserOption(opt =>
     opt.setName('user')
        .setDescription('User to ban')
        .setRequired(true))
    .addStringOption(opt =>
     opt.setName('reason')
        .setDescription('Reason for ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  /**
   * Execute ban command
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

        // Fetch user and reason
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        const reason = interaction.options.getString('reason') ?? 'Not specified';

        // Verify user is in the server
        if(!member){
            return interaction.reply({
                content: 'This user is not in the server.',
                ephemeral: true,
            });
        }

        try{
            // Ban the member from the server
            await member.ban(user, { reason: reason });

            await interaction.reply({
                content: `${member} has been banned. Reason: ${reason}.`,
                ephemeral: false,
            });
        } catch (error){
            await interaction.reply({
                content: 'Could not ban this user. Verify that the bot role is higher than the user role.',
                ephemeral: true,
            });
        }
    }
}