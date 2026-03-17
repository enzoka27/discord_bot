const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um usuário do servidor')
        .addUserOption(opt =>
          opt.setName('usuario')
            .setDescription('Quem banir')
            .setRequired(true))
        .addStringOption(opt =>
          opt.setName('motivo')
            .setDescription('Motivo do ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({
                content: 'Este comando só pode ser usado em servidores. Me adicione em um servidor e poderá utilizar os comando devidamente!',
                ephemeral: true,
            });
        }

        const usuarioAlvo = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo') ?? 'Sem motivo';

        try{
            //bane o usuario do servidor
            await interaction.guild.members.ban(usuarioAlvo, { reason: motivo });

            await interaction.reply({
                content: `${usuarioAlvo.username} foi banido. Motivo: ${motivo}`,
                ephemeral: false,
            });
        } catch (erro){
            await interaction.reply({
                content: 'Não foi possível banir esse usuário. Verifique se o cargo do bot é superior ao cargo do usuário.',
                ephemeral: false,
            });
        }
    }
}