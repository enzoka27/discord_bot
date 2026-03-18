const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Apaga mensagens do canal')
        //quantidade de mensagens a apagar(obrigatorio)
        .addIntegerOption(opt => 
         opt.setName('quantidade')
            .setDescription('Quantas mensagens apagar(1-100)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)) //o limite é 100 mensagens por vez (é possivel aumentar)    
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({ 
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comando devidamente!',
                ephemeral: true,
            });
        }

        const amount = interaction.options.getInteger('quantidade');

        try{
            //apaga as mensagens do canal
            const deleted = await interaction.channel.bulkDelete(amount, true); //true = ignora mensagens com +14 dias

            await interaction.reply({
                content: `${deleted.size} mensagens apagadas.`,
                ephemeral: true,
            });
        } catch (error){ //o dc n permite apagar msgs com mais de 14 dias via "bulkDelete", por isso o erro é tratado no catch
            await interaction.reply({
                content: 'Não foi possível apagar as mensagens.  Verifique se as mensagens têm menos de 14 dias.',
                ephemeral: true,
            });
        }
    }
};