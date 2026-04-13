/**
 * Clear Messages Command Module
 * Bulk deletes a specified number of messages from a channel
 * Requires Manage Messages permission
 * Note: Discord API can only delete messages less than 14 days old
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Command definition with permission requirements
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes messages from the channel')
        .addIntegerOption(opt => 
         opt.setName('amount')
            .setDescription('How many messages to delete (1-100)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    /**
     * Execute clear messages command
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

        // Get number of messages to delete
        const amount = interaction.options.getInteger('amount');

        try{
            // Bulk delete messages (ignores messages older than 14 days)
            const deleted = await interaction.channel.bulkDelete(amount, true);

            await interaction.reply({
                content: `${deleted.size} messages deleted.`,
                ephemeral: true,
            });
        } catch (error){ 
            // Discord API limitation: cannot delete messages older than 14 days
            await interaction.reply({
                content: 'Could not delete messages. Verify that messages are less than 14 days old.',
                ephemeral: true,
            });
        }
    }
};