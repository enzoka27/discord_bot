const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Remove o ban de um usuário')
        //id do usuario a desbanir
        .addStringOption(opt =>
            opt.setName('id')
            .setDescription('ID do usuário a desbanir')
            .setRequired(true))
        .addStringOption(opt =>
            opt.setName('motivo')
            .setDescription('Motivo do unban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({
                content: 'Este comando só pode ser usado em servidores. Me adicione em um servidor e poderá utilizar os comando devidamente!',
                ephemeral: true,
            });
        }

        const id = interaction.options.getString('id');
        const motivo = interaction.options.getString('motivo') ?? 'Sem motivo';

        try{
            //verifica se o usuario realmente esta banido
            const banido = await interaction.guild.bans.fetch(id).catch(() => null);
            //.catch(() => null) -> se o .fetch() der erro, em vez de travar o bot, ele captura o erro silenciosamente e retorna null

            if(!banido){
                return interaction.reply({
                    content: 'Este usuário não está banido ou o ID é inválido.',
                    ephemeral: true,
                });
            }

            //remove o ban
            await interaction.guild.members.unban(id, motivo);

            await interaction.reply({
                content: `${banido.user.username} foi desbanido. Motivo: ${motivo}`,
                ephemeral: false,
            });
        } catch (erro){
            await interaction.reply({
                content: 'Não foi possível desbanir esse usuário. Verifique se o ID está correto.',
                ephemeral: true,
            });
        }
    }
}