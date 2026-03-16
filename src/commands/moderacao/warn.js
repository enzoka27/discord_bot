const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

//armazena os avisos em memória(reseta quando o bot reinicia)
const avisos = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Avisa um usuário do servidor')
        //opção obrigatória: qual usuário avisar
        .addUserOption(opt => opt.setName('usuario').setDescription('Quem avisar').setRequired(true))
        //opção obrigatória: motivo do aviso
        .addStringOption(opt => opt.setName('motivo').setDescription('Motivo do aviso').setRequired(true))
        //só quem pode punir membros pode usar o comando
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({ content: 'Este comando só pode ser usado em servidores. Me adicione em um servidor e poderá utilizar os comando devidamente!', ephemeral: true});
        }

        //pega o usuario alvo e o motivo das opções do comando
        const usuarioAlvo = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo');

        //cria uma chave unica por usuario por servidor
        const chave = `${interaction.guild.id}-${usuarioAlvo.id}`;

        //se o usuario ainda n tem avisos, cria uma lista vazia para ele
        if (!avisos.has(chave)){
            avisos.set(chave, []);
        }

        //add o aviso na lista do usuario com motivo, data e quem aplicou
        avisos.get(chave).push({
            motivo,
            data: new Date().toLocaleString('pt-BR'),
            aplicadoPor: interaction.user.username,
        });

        //pega o total de avisos do usuario
        const totalAvisos = avisos.get(chave).length;

        try{
            //tenta enviar uma dm avisando o usuario
            await usuarioAlvo.send(`Você recebeu um aviso em **${interaction.guild.name}**. \nMotivo: ${motivo}`);
        } catch{
            //se n conseguir mandar dm(user com dm fechada), ignora silenciosamente
        }

        //responde no canal confirmando o aviso (só o autor do comando vê)
        await interaction.reply({ 
            content: `${usuarioAlvo.username} recebeu um aviso. Total de avisos: **${totalAvisos}**. Motivo: ${motivo}`,
            ephemeral: true,
        });
    }
};