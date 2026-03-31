const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um usuário do servidor')
        .addUserOption(opt =>
         opt.setName('usuário')
            .setDescription('Quem banir')
            .setRequired(true))
        .addStringOption(opt =>
         opt.setName('motivo')
            .setDescription('Motivo do ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comandos devidamente!',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('usuário');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        const reason = interaction.options.getString('motivo') ?? 'Não definido';

        if(!member){
            return interaction.reply({
                content: 'Esse usuário não está no servidor.',
                ephemeral: true,
            });
        }

        try{
            //bane o usuario do servidor
            await member.ban(user, { reason: reason });

            await interaction.reply({
                content: `${member} foi banido.  Motivo: ${reason}.`,
                ephemeral: false,
            });
        } catch (error){
            await interaction.reply({
                content: 'Não foi possível banir este usuário.  Verifique se o cargo do bot é superior ao cargo do usuário.',
                ephemeral: true,
            });
        }
    }
}