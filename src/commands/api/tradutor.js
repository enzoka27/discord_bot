// Complete list of langagues ISO 639-1 supported by MyMemory
const { SlashCommandBuilder } = require("discord.js");
const languages = {
  africâner: "af",
  albanês: "sq",
  amárico: "am",
  árabe: "ar",
  aragonês: "an",
  armênio: "hy",
  assamês: "as",
  avaric: "av",
  avestan: "ae",
  aymarà: "ay",
  azerbaijano: "az",
  bambara: "bm",
  bashkir: "ba",
  basco: "eu",
  bielorrusso: "be",
  bengali: "bn",
  bislamá: "bi",
  bósnio: "bs",
  bretão: "br",
  búlgaro: "bg",
  birmanês: "my",
  catalão: "ca",
  chamorro: "ch",
  checheno: "ce",
  chichewa: "ny",
  "chinês simplificado": "zh-cn",
  "chinês tradicional": "zh-tw",
  chinês: "zh",
  chuvash: "cv",
  córnico: "kw",
  corso: "co",
  cree: "cr",
  croata: "hr",
  tcheco: "cs",
  dinamarquês: "da",
  divehi: "dv",
  holandês: "nl",
  dzongkha: "dz",
  inglês: "en",
  esperanto: "eo",
  estoniano: "et",
  ewe: "ee",
  faroês: "fo",
  fijiano: "fj",
  finlandês: "fi",
  francês: "fr",
  fula: "ff",
  galego: "gl",
  georgiano: "ka",
  alemão: "de",
  grego: "el",
  guarani: "gn",
  gujarati: "gu",
  "crioulo haitiano": "ht",
  hausa: "ha",
  hebraico: "he",
  herero: "hz",
  hindi: "hi",
  "hiri motu": "ho",
  húngaro: "hu",
  interlingua: "ia",
  indonésio: "id",
  interlingue: "ie",
  irlandês: "ga",
  igbo: "ig",
  inupiaq: "ik",
  ido: "io",
  islandês: "is",
  italiano: "it",
  inuktitut: "iu",
  japonês: "ja",
  javanês: "jv",
  cazaque: "kk",
  kalaallisut: "kl",
  khmer: "km",
  kannada: "kn",
  kanuri: "kr",
  kashmiri: "ks",
  curdo: "ku",
  komi: "kv",
  kongo: "kg",
  coreano: "ko",
  quirguiz: "ky",
  latim: "la",
  luxemburguês: "lb",
  luganda: "lg",
  limburgish: "li",
  lingala: "ln",
  laosiano: "lo",
  lituano: "lt",
  "luba-katanga": "lu",
  letão: "lv",
  manx: "gv",
  macedônio: "mk",
  malgaxe: "mg",
  malaio: "ms",
  malaiala: "ml",
  maltês: "mt",
  maori: "mi",
  marata: "mr",
  marshallês: "mh",
  mongol: "mn",
  nauruan: "na",
  navajo: "nv",
  "norueguês bokmål": "nb",
  "norte ndebele": "nd",
  nepalês: "ne",
  ndonga: "ng",
  "norueguês nynorsk": "nn",
  norueguês: "no",
  nuosu: "ii",
  "sul ndebele": "nr",
  occitano: "oc",
  ojibwe: "oj",
  "eslavo eclesiástico": "cu",
  oromo: "om",
  oriya: "or",
  ossético: "os",
  panjabi: "pa",
  pali: "pi",
  persa: "fa",
  polonês: "pl",
  pashto: "ps",
  português: "pt-br",
  quechua: "qu",
  romanche: "rm",
  kirundi: "rn",
  romeno: "ro",
  russo: "ru",
  sânscrito: "sa",
  sardenho: "sc",
  sindhi: "sd",
  "sami do norte": "se",
  sango: "sg",
  cingalês: "si",
  eslovaco: "sk",
  esloveno: "sl",
  samoano: "sm",
  shona: "sn",
  somali: "so",
  albanês: "sq",
  sérvio: "sr",
  swati: "ss",
  sesoto: "st",
  sundanês: "su",
  sueco: "sv",
  swahili: "sw",
  tâmil: "ta",
  télugo: "te",
  tadjique: "tg",
  tailandês: "th",
  tigrinya: "ti",
  turcomeno: "tk",
  tagalo: "tl",
  tswana: "tn",
  tonga: "to",
  turco: "tr",
  tsonga: "ts",
  tártaro: "tt",
  twi: "tw",
  tahitiano: "ty",
  uigur: "ug",
  ucraniano: "uk",
  urdu: "ur",
  uzbeque: "uz",
  venda: "ve",
  vietnamita: "vi",
  volapük: "vo",
  valão: "wa",
  wolof: "wo",
  xhosa: "xh",
  ídiche: "yi",
  ioruba: "yo",
  zhuang: "za",
  zulu: "zu",
  filipino: "tl",
  havaiano: "haw",
  hmong: "hmn",
  "escocês gaélico": "gd",
  "sesoto do norte": "nso",
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
      "português";
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