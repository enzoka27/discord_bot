const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

//cria um "dicionário" em memória para guardar os avisos. um Map é como uma tabela. 
const warnings = new Map(); //(reseta quando o bot reinicia)

module.exports = {
    warnings, //exporta o Map para que outros arquivos possam acessar o mesmo objeto
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Avisa um usuário do servidor')
        //opção obrigatória: qual usuário avisar
        .addUserOption(opt => 
         opt.setName('usuario')
            .setDescription('Quem avisar')
            .setRequired(true))
        //opção obrigatória: motivo do aviso
        .addStringOption(opt => 
         opt.setName('motivo')
            .setDescription('Motivo do aviso')
            .setRequired(true))
        //só quem pode punir membros pode usar o comando
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction){
        if(!interaction.guild){
            return interaction.reply({ 
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comando devidamente!', 
                ephemeral: true,
            });
        }

        //pega o usuario alvo e o motivo das opções do comando
        const targetUser = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');

        //cria uma chave unica por usuario por servidor
        const key = `${interaction.guild.id}-${targetUser.id}`;

        //se o usuario ainda n tem avisos, cria uma lista vazia para ele
        if(!warnings.has(key)){
            warnings.set(key, []);
        }

        //add o aviso na lista do usuario com motivo, data e quem aplicou
        warnings.get(key).push({
            reason,
            data: new Date().toLocaleString('pt-BR'),
            aplicadoPor: interaction.user.username,
        });

        //TEMPORÁRIO
        console.log(`[WARN] Aviso registrado para ${targetUser.username}:`, warnings.get(key));

        //pega o total de avisos do usuario
        const totalWarnings = warnings.get(key).length;

        dmStatus = ''; //guarda o status do envio da dm

        try{
            //tenta enviar uma dm avisando o usuario
            await targetUser.send(`Você recebeu um aviso em **${interaction.guild.name}**. \nMotivo: ${reason}`);
            dmStatus = 'Usuário notificado por DM.'; //add o status positivo
        } catch{
            //se n conseguir mandar dm(user com dm fechada), ignora silenciosamente
            dmStatus = 'Não foi possível enviar DM (DM fechada).'; //add o status negativo
        }

        //responde no canal confirmando o aviso (só o autor do comando vê)
        await interaction.reply({ 
            content: `${targetUser.username} recebeu um aviso. Total de avisos: **${totalWarnings}**.  Motivo: ${reason}`,
            ephemeral: false,
        });

        await interaction.followUp({
            content: dmStatus,
            ephemeral: true,
        }); //o followUp serve p/ enviar uma segunda mensagem após o reply inicial
    }
};