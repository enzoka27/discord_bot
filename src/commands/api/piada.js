const { SlashCommandBuilder , EmbedBuilder , ActionRowBuilder , ButtonBuilder , ButtonStyle, time } = require('discord.js'); //está importando componentes da biblioteca discord.js
const axios = require('axios') //está importando a biblioteca axios

module.exports = { //exporta o "data" e "execute", para ser usado em outros arquivos(como o index.js)

    data: new SlashCommandBuilder() //cria novo comando e exporta ele para deploy-commands.js
        .setName('piada') // escolhe nome pro comando (nome que vai aparecer no discord pro usuario digitar)
        .setDescription('Mostra uma piada de programação'), // adiciona descrição do comando (vai aparecer embaixo do nome)

    async execute(interaction) { // executa uma interação async (assincrona, ou seja, pode ter wait no meio e continuar rodando)

        await interaction.deferReply(); // espera até pegar a API

        let botao //definindo as variaveis fora do try, para poder usar elas fora tambem
        let linha
        let embed

        try{ //tenta buscar a api e mostrar na tela

            async function MensagemPiada() { //função para pegar api e fazer card(já que vai ser usada mais de uma vez, fica mais limpo com a função)

                const resposta = await axios.get('https://v2.jokeapi.dev/joke/Programming?type=twopart'); // request na API
                const piada = resposta.data; // coloca o resultado do request na variavel piada(.data é para pegar apenas o conteudo da API em si)

                const corAleatoria = Math.floor(Math.random() * 0xFFFFFF) //cria variavel corAleatoria, com calculo para escolher um hexadecimal de cor aleatorio, para colocar a cor do card

                embed = new EmbedBuilder() //cria novo card
                    .setColor(corAleatoria) // escolhe a cor do card (nesse caso, aleatoria)
                    .setTitle('😂 Piada de Programação') // escolhe o titulo do card
                    .setFooter({ text: 'Clique no spoiler para ver a resposta' }) //cria um texto pequeno em baixo do texto da piada(dando instruções para o usuario)
                    .addFields( //adiciona fields no card (seria um campo, para mostrar algo digitado, no caso temos 2)
                        { name: '📢 Pergunta', value: piada.setup }, // temos que passar o nome e valor do field, no caso no valor, ele pega a pergunta da piada(buscada na API) 
                        { name: '🥁 Piada', value: `||${piada.delivery}||` } // no valor pega a piada em si(buscada na API)
                    )

                botao = new ButtonBuilder() //cria novo botão
                    .setCustomId('nova_piada') //escolhe o id unico para identificar esse botão(não vai aparecer para o usuario)
                    .setLabel('🔄 Nova Piada') //escolhe o texto do botão(vai aparecer para o usuario)
                    .setStyle(ButtonStyle.Primary) // escolhe cor do botão

                linha = new ActionRowBuilder().addComponents(botao) // cria nova linha(que vaiser usada no card) e adiciona o botão à ela
            }

            await MensagemPiada() //chama a função "MensagemPiada"

            await interaction.editReply({embeds: [embed] , components: [linha]}) //passa a variavel embed como array(mostrando o card, seu titulo e fields) e a variavel row(mostrando a linha com o botão)

            

            while (true) {
                const mensagem = await interaction.fetchReply() //usando o fetchReply(), "pega" a mensagem(card) que o bot enviou no interaction.editReply e guarda na variavel mensagem
            
                const clique = await mensagem.awaitMessageComponent({ time: 3000 }) // espera(30s) o usario interagir com algum component da mensagem(no caso, o botão), caso não receba a interação, da erro, que é tratado no catch

                await MensagemPiada() //chama a função "MensagemPiada"

                clique.update({ embeds: [embed], components: [linha]}) //quando receber a interação do usuario(clique), atualiza para a nova mensagem(novo card, com nova piada)

            }
            

        } catch (erro) { //se der erro,
            if (erro.code === 'InteractionCollectorError'){ //se for o erro que o usuario não clicou no botão ele roda
                if (botao) { //se o botao existir
                    botao.setDisabled(true) //desativa o botao
                    linha = new ActionRowBuilder().addComponents(botao) //atualiza o botao na linha(com ele agora desativado)
                    await interaction.editReply({embeds: [embed] , components: [linha]}) //mostra a nova mensagem(agora com o botão desativado)
                } 

            } else { //se for outro erro
                console.error(erro); //mostra o erro no terminal
                await interaction.editReply('😵 Algo deu errado ao buscar a piada. Tente novamente!') //no discord avisa que não conseguiu buscar piada 
            }
            
        }

        
    }
};