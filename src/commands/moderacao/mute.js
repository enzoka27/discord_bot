const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js'); //importa ferramentas do dc
//Slash... = ferrameta para construir comandos com (/)
//Permission... = objeto com as permissões do Discord em formato de bits

module.exports = { //exporta como modulo para facil leitura para o bot
    data: new SlashCommandBuilder() //cria novo comando com nome e descrição
        .setName('mute')
        .setDescription('Silencia um usuário temporariamente') 
        .addUserOption(opt => 
         opt.setName('usuário') 
            .setDescription('Quem silenciar') 
            .setRequired(true))
        //add uma opção de usuários, onde vai mostrar uma seleção de membros, é OBRIGATÓRIO mostrar(.setRequired(true))
        .addIntegerOption(opt => 
         opt.setName('duração')
            .setDescription('Duração em minutos')
            .setRequired(true))
        //add uma opção numérica inteira, para a duração em minutos, tbm OBRIGATÓRIO
        .addStringOption(opt => 
         opt.setName('motivo') 
            .setDescription('Motivo do mute'))
        //add opção motivo, como texto livre, sendo OPCIONAL (sem setRequired)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
        //restringe o comando, só membros com permissão de mutar membros no server conseguem ver e usar o /mute

    async execute(interation){ //função assíncrona chamada quando alguem usa o /mute.  
        if(!interation.guild){
            return interation.reply({ 
                content: 'Este comando só pode ser usado em servidores.  Me adicione em um servidor e poderá utilizar os comandos devidamente!', 
                ephemeral: true
            });
        }//garante que o comando só funciona em servidores 

        const user = interation.options.getUser('usuário'); //pega usuario( getUser ) que foi selecionado na opção (addUserOption) 
        const member = await interation.guild.members.fetch(user.id).catch(() => null);
        //extrai ID do usuario( .id ) e busca o membro do servidor pelo ID usando fetch, para pegar diretamente da API do dc
        //isso é necessário porque .timeout() só existe no objeto member, não no user 
        const duration = interation.options.getInteger('duração');
        //pega o número inteiro digitado na opção duração
        const reason = interation.options.getString('motivo') ?? 'Não definido';
        //pega o txt da opção motivo, se não foi preenchida, usa 'Sem motivo' como padrão (operador ?? = nullish coalescing)

        if(!member){
            return interaction.reply({
                content: 'Esse usuário não está no servidor.',
                ephemeral: true,
            });
        }

        try{
            await member.timeout(duration * 60 * 1000, reason);
            //aplica o timeout no membro, a conta converte minutos para miliseg, pois o dc exige o tempo nesse formato
            await interation.reply({ 
                content: `${member} foi silenciado por ${duration} min.  Motivo: ${reason}.`, 
                ephemeral: false 
            });//responde confirmando o mute. Usa member.user.tag (e não usuario.tag diretamente) porque o objeto é o member, então é preciso acessar o .user dentro dele   
        } catch (error){
            await interation.reply({ 
                content: 'Não foi possível silenciar este usuário.  Verifique se ele tem um cargo superior ao do bot.', 
                ephemeral: true
            });
        }
    }
}