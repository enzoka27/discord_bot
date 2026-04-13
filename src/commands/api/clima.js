/**
 * Weather Command Module
 * Fetches current weather information for a specified city
 * Uses OpenWeatherMap API for real-time weather data
 */

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  // Command definition for Discord slash commands
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Shows weather information for a city")
    .addStringOption(
      (option) =>
        option
          .setName("city")
          .setDescription("Enter the city name to display weather")
          .setRequired(true),
    ),

  /**
   * Execute weather command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    // Weather emoji mapping
    const emojis = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "🌫️",
      Haze: "🌫️",
      Dust: "🌪️",
      Fog: "🌫️",
      Sand: "🏖️",
      Ash: "🌋",
      Squall: "💨",
      Tornado: "🌪️",
    };

    let embed;
    let input;
    let button_row;
    let input_row;
    let modal;
    let button;
    let submit;
    let had_error = false;

    try {
      /**
       * Fetch and display weather data for a city
       * @param {string} city - City name to fetch weather for
       */
      async function display_weather(city) {
        // Fetch weather data from OpenWeatherMap API
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric&lang=en`,
        );
        const weather_data = response.data;

        // Generate random color for embed
        const random_color = Math.floor(Math.random() * 0xffffff);
        
        // Create weather information embed
        embed = new EmbedBuilder()
          .setColor(random_color)
          .setTitle("Weather Information")
          .setThumbnail(
            `https://openweathermap.org/img/wn/${weather_data.weather[0].icon}@2x.png`,
          )
          .addFields(
            { name: "🌍 Location", value: `${weather_data.name}, ${weather_data.sys.country}` },
            {
              name: `${emojis[weather_data.weather[0].main] || "🌡️"} Condition`,
              value: `${weather_data.weather[0].description.charAt(0).toUpperCase() + weather_data.weather[0].description.slice(1)}`,
            },
            {
              name: "🌡️ Temperature",
              value: `${weather_data.main.temp.toFixed(1)}°C`,
            },
            {
              name: "🤔 Feels Like",
              value: `${weather_data.main.feels_like.toFixed(1)}°C`,
            },
            { name: "💧 Humidity", value: `${weather_data.main.humidity}%` },
            {
              name: "💨 Wind Speed",
              value: `${weather_data.wind.speed} m/s`,
            },
          );

        // Create button to search for another city
        button = new ButtonBuilder()
          .setCustomId("button_new_weather")
          .setLabel("🔍 Search another city")
          .setStyle(ButtonStyle.Primary);

        button_row = new ActionRowBuilder().addComponents(button);
      }

      // Get city name from user input
      const city = interaction.options.getString("city");
      await display_weather(city);

      await interaction.editReply({
        embeds: [embed],
        components: [button_row],
      });

      // Create text input for new city search
      input = new TextInputBuilder()
        .setCustomId("input_new_city")
        .setLabel("Enter city name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      input_row = new ActionRowBuilder().addComponents(input);

      // Create modal popup for city search
      modal = new ModalBuilder()
        .setCustomId("new_city")
        .setTitle("Search for a new city")
        .addComponents(input_row);

      // Main interaction loop
      while (true) {
        try {
          const message = await interaction.fetchReply();

          // Wait for button click (30 second timeout)
          const button_click = await message.awaitMessageComponent({ time: 30000 });

          // Show modal for city input
          await button_click.showModal(modal);

          // Wait for modal submission (15 second timeout)
          submit = await button_click.awaitModalSubmit({ time: 15000 });

          await submit.deferUpdate();

          // Fetch weather for the new city
          await display_weather(
            submit.fields.getTextInputValue("input_new_city"),
          );

          await interaction.editReply({
            content: "",
            embeds: [embed],
            components: [button_row],
          });

          had_error = false;
        } catch (error) {
          // Handle invalid city error
          if (error.response && error.response.status === 404) {
            await interaction.editReply({
              content:
                "❌ City not found! Check the name and try again.",
              embeds: [],
              components: [button_row],
            });
            had_error = true;
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 404) {
        await interaction.editReply(
          "❌ City not found! Check the name and try again.",
        );
      } else if (error.code === "InteractionCollectorError") {
        // Disable button after timeout
        button.setDisabled(true);
        button_row = new ActionRowBuilder().addComponents(button);
        if (had_error) {
          await interaction.editReply({
            embeds: [],
            components: [button_row],
          });
        } else {
          await interaction.editReply({
            embeds: [embed],
            components: [button_row],
          });
        }
      } else {
        console.error(error);
        await interaction.editReply(
          "😵 An error occurred while fetching weather. Please try again!",
        );
      }
    }
  },
};