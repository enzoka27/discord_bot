const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove o silêncio de um usuário')
        .addUserOption(opt => 
         opt.setName('usuario')
            .setDescription('Quem remover o mute')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comando devidamente!', 
                ephemeral: true,
            });
        }

        const targetUser = interaction.options.getUser('usuario');
        const member = await interaction.guild.members.fetch(targetUser.id);

        //verifica se o usuario realmente esta mutado
        if(!member.isCommunicationDisabled()){ //.isCommunicationDisabled() verifica se o usuario esta atualmente em timeout
            return interaction.reply({
                content: `${targetUser.username} não está silenciado.`,
                ephemeral: true,
            });
        }
       
        try{
            //.timeout(null) remove mute, cancelando o timeout ativo com o null
            await member.timeout(null);
            await interaction.reply({
                content: `${targetUser.username} foi desmutado.`,
                ephemeral: false,
            });
        } catch (error){
            await interaction.reply({
                content: 'Não foi possível remover o silêncio.  Verifique se o cargo do bot é superior ao cargo do usuário.',
                ephemeral: true,
            });
        }
    }
}