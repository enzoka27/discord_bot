/**
 * View Warnings Command Module
 * Displays all warnings for a specified user
 * Requires server context to function
 */

const { SlashCommandBuilder } = require('discord.js');
const { warnings } = require('./warn'); // Import warnings map from warn.js

module.exports = {
    // Command definition
    data: new SlashCommandBuilder()
        .setName('view_warn')
        .setDescription('Views all warnings for a user')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('User to check')
            .setRequired(true)),
    
    /**
     * Execute view warnings command
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
        
        // Fetch target user
        const user = interaction.options.getUser('user');
        
        // Create unique key matching warn.js format
        const key = `${interaction.guild.id}-${user.id}`;
        
        // Fetch warning list for user
        const list = warnings.get(key);

        // Check if user has any warnings
        if(!list || list.length === 0){
            return interaction.reply({
                content: `<@${user.id}> has no warnings.`,
                ephemeral: true,
            });
        }

        // Format warnings into readable text
        const text = list.map((w, i) =>
            `${i + 1}. Reason: '${w.reason}'\n   Date: '${w.date}'\n   Issued by: '${w.issued_by}'`
        ).join('\n\n');

        // Reply with formatted warnings in code block
        await interaction.reply({
            content: `Warnings for <@${user.id}>:\`\`\`\n${text}\`\`\``,
            ephemeral: true,
        });
    }
};