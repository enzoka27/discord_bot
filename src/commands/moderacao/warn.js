/**
 * Warn Command Module
 * Issues a warning to a user with optional DM notification
 * Stores warnings in memory (resets on bot restart)
 * Requires Moderate Members permission
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// In-memory storage for user warnings (persists across commands but resets on bot restart)
const warnings = new Map();

module.exports = {
    // Export warnings map for use in other modules (like viewWarn command)
    warnings,
    
    // Command definition with permission requirements
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a server member')
        .addUserOption(opt => 
         opt.setName('user')
            .setDescription('User to warn')
            .setRequired(true))
        .addStringOption(opt => 
         opt.setName('reason')
            .setDescription('Reason for warning')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    /**
     * Execute warn command
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

        // Fetch target user and warning reason
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        // Create unique key per user per server
        const key = `${interaction.guild.id}-${user.id}`;

        // Initialize empty warning array if user has no prior warnings
        if(!warnings.has(key)){
            warnings.set(key, []);
        }

        // Add warning to user's record with timestamp and issuer
        warnings.get(key).push({
            reason,
            date: new Date().toLocaleString('pt-BR'),
            issued_by: interaction.user.tag
        });

        // Get total warning count
        const totalWarnings = warnings.get(key).length;

        // Initialize DM status message
        let dmStatus = '';

        try{
            // Attempt to send warning notification via DM
            await user.send(`You received a warning in **${interaction.guild.name}**. \nReason: ${reason}.`);
            dmStatus = 'User notified via DM.';
        } catch{
            // User has DMs disabled - silently continue
            dmStatus = 'Could not send DM (user has DMs disabled).';
        }

        // Reply with warning confirmation
        await interaction.reply({ 
            content: `<@${user.id}> received a warning. Total warnings: **${totalWarnings}**. Reason: ${reason}.`,
            ephemeral: false,
        });

        // Send follow-up message with DM status
        await interaction.followUp({
            content: dmStatus,
            ephemeral: true,
        });
    }
};