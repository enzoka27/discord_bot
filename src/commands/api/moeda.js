/**
 * Currency Converter Command Module
 * Converts monetary values between different currencies
 * Uses ExchangeRate API for real-time exchange rates
 */

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Converts currency values between different currencies")
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription("Source currency (e.g., BRL, USD, EUR)")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("Target currency (e.g., USD, EUR, JPY)")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to be converted (e.g., 100)")
        .setRequired(true),
    ),

  /**
   * Execute currency conversion command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Defer reply to allow time for API call
    await interaction.deferReply();

    // Flag emoji mapping for currencies
    const currency_flags = {
      BRL: "🇧🇷",
      USD: "🇺🇸",
      EUR: "🇪🇺",
      JPY: "🇯🇵",
      GBP: "🇬🇧",
      ARS: "🇦🇷",
      CLP: "🇨🇱",
      COP: "🇨🇴",
      PEN: "🇵🇪",
      UYU: "🇺🇾",
      CAD: "🇨🇦",
      MXN: "🇲🇽",
      CHF: "🇨🇭",
      NOK: "🇳🇴",
      SEK: "🇸🇪",
      DKK: "🇩🇰",
      AUD: "🇦🇺",
      NZD: "🇳🇿",
      CNY: "🇨🇳",
      KRW: "🇰🇷",
      INR: "🇮🇳",
      SGD: "🇸🇬",
      HKD: "🇭🇰",
      ZAR: "🇿🇦",
    };

    try {
      // Get currency codes and amount from user input
      const from_currency = interaction.options
        .getString("from")
        .trim()
        .toUpperCase();
      const to_currency = interaction.options
        .getString("to")
        .trim()
        .toUpperCase();
      const convert_amount = interaction.options.getNumber("amount");

      // Fetch exchange rate data from API
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_KEY}/pair/${from_currency}/${to_currency}/${convert_amount}`,
      );
      const exchange_data = response.data;

      // Format currency values for display
      const formatted_from_amount = convert_amount.toLocaleString("pt-BR");
      const formatted_conversion_amount = exchange_data.conversion_result.toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      );
      const formatted_exchange_rate = exchange_data.conversion_rate.toLocaleString("pt-BR");

      // Generate random color for embed and create conversion display
      const random_color = Math.floor(Math.random() * 0xffffff);
      let embed = new EmbedBuilder()
        .setColor(random_color)
        .setTitle("💹 Currency Converter")
        .addFields(
          {
            name: "💰 Conversion",
            value: `${currency_flags[from_currency] || ""} ${formatted_from_amount} ${exchange_data.base_code} = ${currency_flags[to_currency] || ""} ${formatted_conversion_amount} ${exchange_data.target_code}`,
          },
          {
            name: "📊 Exchange Rate",
            value: `${currency_flags[from_currency] || ""} 1 ${exchange_data.base_code} = ${currency_flags[to_currency] || ""} ${formatted_exchange_rate} ${exchange_data.target_code}`,
          },
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await interaction.editReply(
          "❌ Invalid currency! Use codes like BRL, USD, EUR.",
        );
      } else {
        await interaction.editReply(
          "😵 Something went wrong with the conversion. Try again!",
        );
        console.error(error);
      }
    }
  },

  async autocomplete(interaction) {
    const input = interaction.options.getFocused();

    const currencies = [
      "BRL",
      "USD",
      "EUR",
      "JPY",
      "GBP",
      "ARS",
      "CLP",
      "COP",
      "PEN",
      "UYU", // América Latina
      "CAD",
      "MXN", // América do Norte
      "CHF",
      "NOK",
      "SEK",
      "DKK", // Europa
      "AUD",
      "NZD", // Oceania
      "CNY",
      "KRW",
      "INR",
      "SGD",
      "HKD", // Ásia
      "ZAR",
    ]; // Africa

    const filtered = currencies.filter((c) =>
      c.startsWith(input.toUpperCase()),
    );

    await interaction.respond(
      filtered.slice(0, 10).map((c) => ({ name: c, value: c })),
    );
  },
};