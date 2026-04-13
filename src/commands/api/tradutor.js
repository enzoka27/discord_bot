// Complete list of langagues ISO 639-1 supported by MyMemory
const { SlashCommandBuilder } = require("discord.js");
const languages = {
  afrikaans: "af",
  albanian: "sq",
  amharic: "am",
  arabic: "ar",
  aragonese: "an",
  armenian: "hy",
  assamese: "as",
  avaric: "av",
  avestan: "ae",
  aymara: "ay",
  azerbaijani: "az",
  bambara: "bm",
  bashkir: "ba",
  basque: "eu",
  belarusian: "be",
  bengali: "bn",
  bihari: "bi",
  bosnian: "bs",
  breton: "br",
  bulgarian: "bg",
  burmese: "my",
  catalan: "ca",
  chamorro: "ch",
  chechen: "ce",
  chichewa: "ny",
  "simplified chinese": "zh-cn",
  "traditional chinese": "zh-tw",
  chinese: "zh",
  chuvash: "cv",
  cornish: "kw",
  corsican: "co",
  cree: "cr",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  divehi: "dv",
  dutch: "nl",
  dzongkha: "dz",
  english: "en",
  esperanto: "eo",
  estonian: "et",
  ewe: "ee",
  faroese: "fo",
  fijian: "fj",
  finnish: "fi",
  french: "fr",
  fulah: "ff",
  galician: "gl",
  georgian: "ka",
  german: "de",
  greek: "el",
  guarani: "gn",
  gujarati: "gu",
  "haitian creole": "ht",
  hausa: "ha",
  hebrew: "he",
  herero: "hz",
  hindi: "hi",
  "hiri motu": "ho",
  hungarian: "hu",
  interlingua: "ia",
  indonesian: "id",
  interlingue: "ie",
  irish: "ga",
  igbo: "ig",
  inupiaq: "ik",
  ido: "io",
  icelandic: "is",
  italian: "it",
  inuktitut: "iu",
  japanese: "ja",
  javanese: "jv",
  kazakh: "kk",
  kalaallisut: "kl",
  khmer: "km",
  kannada: "kn",
  kanuri: "kr",
  kashmiri: "ks",
  kurdish: "ku",
  komi: "kv",
  kongo: "kg",
  korean: "ko",
  kyrgyz: "ky",
  latin: "la",
  luxembourgish: "lb",
  luganda: "lg",
  limburgish: "li",
  lingala: "ln",
  lao: "lo",
  lithuanian: "lt",
  "luba-katanga": "lu",
  latvian: "lv",
  manx: "gv",
  macedonian: "mk",
  malagasy: "mg",
  malay: "ms",
  malayalam: "ml",
  maltese: "mt",
  maori: "mi",
  marathi: "mr",
  marshallese: "mh",
  mongolian: "mn",
  nauru: "na",
  navajo: "nv",
  "norwegian bokmål": "nb",
  "north ndebele": "nd",
  nepali: "ne",
  ndonga: "ng",
  "norwegian nynorsk": "nn",
  norwegian: "no",
  nuosu: "ii",
  "south ndebele": "nr",
  occitan: "oc",
  ojibwa: "oj",
  "old church slavonic": "cu",
  oromo: "om",
  oriya: "or",
  ossetian: "os",
  punjabi: "pa",
  pali: "pi",
  persian: "fa",
  polish: "pl",
  pashto: "ps",
  portuguese: "pt-br",
  quechua: "qu",
  romansh: "rm",
  rundi: "rn",
  romanian: "ro",
  russian: "ru",
  sanskrit: "sa",
  sardinian: "sc",
  sindhi: "sd",
  "northern sami": "se",
  sango: "sg",
  sinhala: "si",
  slovak: "sk",
  slovenian: "sl",
  samoan: "sm",
  shona: "sn",
  somali: "so",
  serbian: "sr",
  swati: "ss",
  sesotho: "st",
  sundanese: "su",
  swedish: "sv",
  swahili: "sw",
  tamil: "ta",
  telugu: "te",
  tajik: "tg",
  thai: "th",
  tigrinya: "ti",
  turkmen: "tk",
  tagalog: "tl",
  tswana: "tn",
  tonga: "to",
  turkish: "tr",
  tsonga: "ts",
  tatar: "tt",
  twi: "tw",
  tahitian: "ty",
  uighur: "ug",
  ukrainian: "uk",
  urdu: "ur",
  uzbek: "uz",
  venda: "ve",
  vietnamese: "vi",
  volapük: "vo",
  walloon: "wa",
  wolof: "wo",
  xhosa: "xh",
  yiddish: "yi",
  yoruba: "yo",
  zhuang: "za",
  zulu: "zu",
  filipino: "tl",
  hawaiian: "haw",
  hmong: "hmn",
  "scottish gaelic": "gd",
  "northern sotho": "nso",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate any text to the desired language")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text you want to translate")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription(
          "Name of the desired language (default: Portuguese). e.g, English, Japanese, Russian...",
        )
        .setRequired(false),
    ),

  async execute(interaction) {
    const text = interaction.options.getString("text");
    const typed_language =
      interaction.options.getString("language")?.toLowerCase().trim() ??
      "portuguese";
    const destiny_language = languages[typed_language];

    // If language not found, warn the user and send the list
    if (!destiny_language) {
      const languages_list = Object.keys(languages)
        .map((i) => `\`${i}\``)
        .join(", ");

      // Break the list into pieces so as not to exceed the discord limit (2.000 characters)
      const message = `❌ Language **${typed_language}** Not Found.\n\n📋 **Available Languages:**\n${languages_list}`;
      const chunks = message.match(/[\s\S]{1,1900}/g);

      await interaction.reply({ content: chunks[0], ephemeral: true });

      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({ content: chunks[i], ephemeral: true });
      }

      return;
    }

    await interaction.deferReply();

    try {
      // Autodetect origin language + translate to desired language
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${destiny_language}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus !== 200) {
        return interaction.editReply(
          "❌ Could not translate text. Try again later!",
        );
      }

      const translation = data.responseData.translatedText;
      const detected_language = data.responseData?.detectedLanguage ?? "Unknown";

      await interaction.editReply({
        embeds: [
          {
            color: 0x5865f2,
            title: "🌐 Translate",
            fields: [
              {
                name: `📝 Original text (detected: ${detected_language.toUpperCase()})`,
                value: text,
              },
              {
                name: `🔄 Translation (${typed_language.charAt(0).toUpperCase() + typed_language.slice(1)})`,
                value: translation,
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ An error occurred. Please try again.");
    }
  },
};