const { SlashCommandBuilder , EmbedBuilder , ActionRowBuilder } = require('discord.js'); //está importando componentes da biblioteca discord.js
const axios = require('axios') //está importando a biblioteca axios

module.exports = {

    data: new SlashCommandBuilder()
        .setName('moeda')
        .setDescription('Converte um valor entre duas moedas')
        .addStringOption(option => option
            .setName('origem')
            .setDescription('Moeda de origem (ex: BRL, USD, EUR)')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(option => option
            .setName('destino')
            .setDescription('Moeda de destino (ex: USD, EUR, JPY)')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addNumberOption(option => option
            .setName('valor')
            .setDescription('Valor a ser convertido (ex: 100)')
            .setRequired(true)
        ),
    
    async execute(interaction) {

        await interaction.deferReply();

        const bandeiras = {
            'BRL': '🇧🇷',
            'USD': '🇺🇸',
            'EUR': '🇪🇺',
            'JPY': '🇯🇵',
            'GBP': '🇬🇧',
            'ARS': '🇦🇷',
            'CLP': '🇨🇱',
            'COP': '🇨🇴',
            'PEN': '🇵🇪',
            'UYU': '🇺🇾',
            'CAD': '🇨🇦',
            'MXN': '🇲🇽',
            'CHF': '🇨🇭',
            'NOK': '🇳🇴',
            'SEK': '🇸🇪',
            'DKK': '🇩🇰',
            'AUD': '🇦🇺',
            'NZD': '🇳🇿',
            'CNY': '🇨🇳',
            'KRW': '🇰🇷',
            'INR': '🇮🇳',
            'SGD': '🇸🇬',
            'HKD': '🇭🇰',
            'ZAR': '🇿🇦'
        }

        try {

            const origem = interaction.options.getString('origem').trim().toUpperCase()
            const destino = interaction.options.getString('destino').trim().toUpperCase()
            const valor = interaction.options.getNumber('valor')

            const resposta = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_KEY}/pair/${origem}/${destino}/${valor}`)
            const moeda = resposta.data;

            const moedaBaseFormatada = valor.toLocaleString('pt-BR')
            const conversaoFormatada = moeda.conversion_result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            const taxaFormatada = moeda.conversion_rate.toLocaleString('pt-BR')

            const corAleatoria = Math.floor(Math.random() * 0xFFFFFF) //cria variavel corAleatoria, com calculo para escolher um hexadecimal de cor aleatorio, para colocar a cor do card
            let embed = new EmbedBuilder()
                .setColor(corAleatoria)
                .setTitle('💹 Conversor de Moedas')
                .addFields(
                    { name: '💰 Conversão', value: `${bandeiras[origem] || ''} ${moedaBaseFormatada} ${moeda.base_code} = ${bandeiras[destino] || ''} ${conversaoFormatada} ${moeda.target_code}` },
                    { name: '📊 Taxa de câmbio', value: `${bandeiras[origem] || ''} 1 ${moeda.base_code} = ${bandeiras[destino] || ''} ${taxaFormatada} ${moeda.target_code}` }
                )

            await interaction.editReply({embeds: [embed]})

        } catch (erro) {
            if (erro.response && erro.response.status === 404) {
                await interaction.editReply('❌ Moeda inválida! Use siglas como BRL, USD, EUR.')
            } else {
                await interaction.editReply('😵 Algo deu errado ao converter. Tente novamente!')
                console.error(erro)
            }
        }



    },

    async autocomplete (interaction) {

        const digitado = interaction.options.getFocused()

        const moedas = ['BRL', 'USD', 'EUR', 'JPY', 'GBP', 
                        'ARS', 'CLP', 'COP', 'PEN', 'UYU',      // América Latina
                        'CAD', 'MXN',                          // América do Norte
                        'CHF', 'NOK', 'SEK', 'DKK',           // Europa
                        'AUD', 'NZD',                        // Oceania
                        'CNY', 'KRW', 'INR', 'SGD', 'HKD',  // Ásia
                        'ZAR']                             // África

        const filtradas = moedas.filter(m => m.startsWith(digitado.toUpperCase()))

        await interaction.respond(
            filtradas.slice(0,10).map(m => ({name: m, value: m}))
        )

    }

};