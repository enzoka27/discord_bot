/**
 * Mute Command Module
 * Temporarily silences a user for a specified duration
 * Uses Discord timeout feature
 * Requires Moderate Members permission
 */

const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    // Command definition with required options and permissions
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Temporarily silences a member') 
        .addUserOption(opt => 
         opt.setName('user') 
            .setDescription('User to mute') 
            .setRequired(true))
        .addIntegerOption(opt => 
         opt.setName('duration')
            .setDescription('Duration in minutes')
            .setRequired(true))
        .addStringOption(opt => 
         opt.setName('reason') 
            .setDescription('Reason for mute'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    /**
     * Execute mute command
     * @param {Interaction} interation - Discord interaction object
     */
    async execute(interation){  
        // Verify command is used in a server context
        if(!interation.guild){
            return interation.reply({ 
                content: 'This command can only be used in servers. Add me to a server to use it!', 
                ephemeral: true
            });
        }

        // Fetch user, member, duration, and reason from command options
        const user = interation.options.getUser('user');
        const member = await interation.guild.members.fetch(user.id).catch(() => null);
        // Note: timeout() only exists on member object, not user object
        const duration = interation.options.getInteger('duration');
        const reason = interation.options.getString('reason') ?? 'Not specified';
        // Nullish coalescing operator (??) - uses default if value is null/undefined

        if(!member){
            return interaction.reply({
                content: 'This user is not in the server.',
                ephemeral: true,
            });
        }

        try{
            await member.timeout(duration * 60 * 1000, reason);
            // Apply timeout to member, duration converts minutes to milliseconds as Discord requires
            await interation.reply({ 
                content: `${member} has been silenced for ${duration} min. Reason: ${reason}.`, 
                ephemeral: false 
            });   
        } catch (error){
            await interation.reply({ 
                content: 'Could not silence this user. Verify that the bot role is higher than the user role.', 
                ephemeral: true
            });
        }
    }
}