/**
 * Programming Joke Command Module
 * Fetches and displays random programming-related jokes
 * Uses JokeAPI for joke data
 */

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  // Command definition for Discord slash commands
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Shows a programming joke"),

  /**
   * Execute programming joke command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    // Defer reply to allow time for API call
    await interaction.deferReply();

    let button;
    let button_row;
    let embed;

    try {
      /**
       * Fetch and display a programming joke
       */
      async function display_joke() {
        // Fetch joke data from JokeAPI
        const response = await axios.get(
          "https://v2.jokeapi.dev/joke/Programming?type=twopart",
        );
        const joke = response.data;

        // Generate random color for embed
        const random_color = Math.floor(Math.random() * 0xffffff);
        
        // Create joke information embed
        embed = new EmbedBuilder()
          .setColor(random_color)
          .setTitle("😂 Programming Joke")
          .setFooter({ text: "Click the spoiler to reveal the punchline" })
          .addFields(
            { name: "📢 Setup", value: joke.setup },
            { name: "🥁 Punchline", value: `||${joke.delivery}||` },
          );

        // Create button to fetch another joke
        button = new ButtonBuilder()
          .setCustomId("new_joke")
          .setLabel("🔄 New Joke")
          .setStyle(ButtonStyle.Primary);

        button_row = new ActionRowBuilder().addComponents(button);
      }

      // Initial joke display
      await display_joke();
      await interaction.editReply({ embeds: [embed], components: [button_row] });

      // Interaction loop for new jokes
      while (true) {
        const message = await interaction.fetchReply();

        // Wait for button click (30 second timeout)
        const button_click = await message.awaitMessageComponent({ time: 30000 });

        // Fetch new joke
        await display_joke();
        await button_click.update({ embeds: [embed], components: [button_row] });
      }
    } catch (error) {
      // Handle errors
      if (error.code === "InteractionCollectorError") {
        // Handle timeout error
        if (button) {
          button.setDisabled(true);
          button_row = new ActionRowBuilder().addComponents(button);
          await interaction.editReply({ embeds: [embed], components: [button_row] });
        }
      } else {
        console.error(error);
        await interaction.editReply(
          "😵 An error occurred while fetching the joke. Please try again!",
        );
      }
    }
  },
};