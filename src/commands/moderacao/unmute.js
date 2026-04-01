const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove o silêncio de um usuário')
        .addUserOption(opt => 
         opt.setName('usuário')
            .setDescription('Quem remover o mute')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comandos devidamente!', 
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('usuário');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        //verifica se o usuario realmente esta mutado
        if(!member.isCommunicationDisabled()){ //.isCommunicationDisabled() verifica se o usuario esta atualmente em timeout
            return interaction.reply({
                content: `${member} não está silenciado.`,
                ephemeral: true,
            });
        }
       
        try{
            //.timeout(null) remove mute, cancelando o timeout ativo com o null
            await member.timeout(null);
            await interaction.reply({
                content: `${member} foi desmutado.`,
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