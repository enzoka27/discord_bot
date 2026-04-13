/**
 * Movie Information Command Module
 * Fetches detailed movie information from the OMDB API
 * Displays movie details including title, genre, plot, rating, and poster
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
    .setName("movie")
    .setDescription("Shows information about a movie")
    .addStringOption(
      (option) =>
        option
          .setName("title")
          .setDescription("Enter the movie title to display information")
          .setRequired(true),
    ),

  /**
   * Execute movie information command
   * @param {Interaction} interaction - Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

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
       * Fetch and display movie information from OMDB API
       * @param {string} movie_title - Movie title to fetch information for
       */
      async function fetch_movie_info(movie_title) {
        // Fetch movie data from OMDB API
        const response = await axios.get(
          `http://www.omdbapi.com/?t=${encodeURIComponent(movie_title)}&apikey=${process.env.OMDB_API_KEY}`,
        );
        const movie_data = response.data;

        // Handle movie not found error
        if (movie_data.Response === "False") {
          throw new Error("Movie not found");
        }

        // Generate random color for embed
        const random_color = Math.floor(Math.random() * 0xffffff);
        
        // Create movie information embed
        embed = new EmbedBuilder()
          .setColor(random_color)
          .setTitle("Movie Information")
          .addFields(
            { name: "Movie Title", value: `${movie_data.Title}` },
            {
              name: "Genre",
              value:
                movie_data.Genre !== "N/A"
                  ? movie_data.Genre
                  : "Unavailable",
            },
            {
              name: "Duration",
              value:
                movie_data.Runtime !== "N/A"
                  ? movie_data.Runtime
                  : "Unavailable",
            },
            {
              name: "Director",
              value:
                movie_data.Director !== "N/A"
                  ? movie_data.Director
                  : "Unavailable",
            },
            {
              name: "Plot",
              value:
                movie_data.Plot !== "N/A" ? movie_data.Plot : "Unavailable",
            },
            {
              name: "Rating",
              value:
                movie_data.imdbRating !== "N/A"
                  ? movie_data.imdbRating
                  : "Unavailable",
            },
            {
              name: "Release Date",
              value:
                movie_data.Released !== "N/A"
                  ? movie_data.Released
                  : "Unavailable",
            },
          )
          .setImage(movie_data.Poster !== "N/A" ? movie_data.Poster : null);

        // Create button to search for another movie
        button = new ButtonBuilder()
          .setCustomId("button_new_movie")
          .setLabel("🔍 Search another movie")
          .setStyle(ButtonStyle.Primary);

        button_row = new ActionRowBuilder().addComponents(button);
      }

      // Get movie title from user input
      const movie_title = interaction.options.getString("title");
      await fetch_movie_info(movie_title);

      await interaction.editReply({
        embeds: [embed],
        components: [button_row],
      });

      // Create text input for new movie search
      input = new TextInputBuilder()
        .setCustomId("input_new_movie")
        .setLabel("Enter movie title")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      input_row = new ActionRowBuilder().addComponents(input);

      // Create modal popup for movie search
      modal = new ModalBuilder()
        .setCustomId("new_movie")
        .setTitle("Search for a new movie")
        .addComponents(input_row);

      // Main interaction loop
      while (true) {
        try {
          const message = await interaction.fetchReply();

          // Wait for button click (30 second timeout)
          const button_click = await message.awaitMessageComponent({ time: 30000 });

          // Show modal for movie search input
          await button_click.showModal(modal);

          // Wait for modal submission (15 second timeout)
          submit = await button_click.awaitModalSubmit({ time: 15000 });

          await submit.deferUpdate();

          // Fetch information for the new movie
          await fetch_movie_info(submit.fields.getTextInputValue("input_new_movie"));

          await interaction.editReply({
            content: "",
            embeds: [embed],
            components: [buttonRow],
          });

          had_error = false;
        } catch (error) {
          // Handle movie not found error
          if (submit && error.message === "Movie not found") {
            await interaction.editReply({
              content:
                "❌ Movie not found! Check the name and try again.",
              embeds: [],
              components: [buttonRow],
            });
            had_error = true;
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      // Handle errors
      if (error.message === "Movie not found") {
        await interaction.editReply(
          "❌ Movie not found! Check the name and try again.",
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
          "😵 An error occurred while fetching the movie. Please try again!",
        );
      }
    }
  },
};