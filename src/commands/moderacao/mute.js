
const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js'); //importa ferramentas do dc
//Slash... = ferrameta para construir comandos com (/)
//Permission... = objeto com as permissões do Discord em formato de bits

module.exports = { //exporta como modulo para facil leitura para o bot
    data: new SlashCommandBuilder() //cria novo comando com nome e descrição
        .setName('mute')
        .setDescription('Silencia um usuário temporariamente') 
        .addUserOption(opt => opt.setName('usuario') .setDescription('Quem silenciar') .setRequired(true))
        //add uma opção de usuários, onde vai mostrar uma seleção de membros, é OBRIGATÓRIO mostrar(.setRequired(true))
        .addIntegerOption(opt => opt.setName('duracao') .setDescription('Duração em minutos') .setRequired(true))
        //add uma opção numérica inteira, para a duração em minutos, tbm OBRIGATÓRIO
        .addStringOption(opt => opt.setName('motivo') .setDescription('Motivo do mute'))
        //add opção motivo, como texto livre, sendo OPCIONAL (sem setRequired)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
        //restringe o comando, só membros com permissão de mutar membros no server conseguem ver e usar o /mute

    async execute(interation){ //função assíncrona chamada quando alguem usa o /mute.
        
        if(!interation.guild){
            return interation.reply({ content: 'Este comando só pode ser usado em servidores. Me adicione em um servidor e poderá utilizar os comando devidamente!', ephemeral: true});
        }//garante que o comando só funciona em servidores 

        const membro = interation.guild.members.cache.get(interation.options.getUser('usuario').id);
        //pega usuario( getUser ), extrai ID dele( .id ) e busca o membro do servidor pelo ID no cache( members.cache.get(id) )
        //isso é necessário porque .timeout() só existe no objeto member, não no user 
        const duracao = interation.options.getInteger('duracao');
        //pega o número inteiro digitado na opção duracao
        const motivo = interation.options.getString('motivo') ?? 'Sem motivo';
        //pega o txt da opção motivo, se não foi preenchida, usa 'Sem motivo' como padrão (operador ?? = nullish coalescing)

        await membro.timeout(duracao * 60 * 1000, motivo);
        //aplica o timeout no membro, a conta converte minutos para miliseg, pois o dc exige o tempo nesse formato
        await interation.reply({ content: `${membro.user.tag} foi silenciado por ${duracao} min. Motivo: ${motivo}`, ephemeral: false });
        //responde confirmando o mute. Usa membro.user.tag (e não usuario.tag diretamente) porque o objeto é o member, então é preciso acessar o .user dentro dele
    }
}