/*eslint-env node*/

/**
 * Based on [gatsby-remark-twitter-cards](https://github.com/alessbell/gatsby-remark-twitter-cards)
 */

const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const twitterCard = require("wasm-twitter-card");

const WIDTH = 1200;
const HEIGHT = 630;

// Generates a Jimp object from a bitmap buffer, currently created by wasm-twitter-card
async function generateTextLayer(buffer) {
  return new Jimp({ data: buffer, width: WIDTH, height: HEIGHT });
}

// Generates a Jimp object with the background picture or plain color
async function generateBackground(background) {
  return background.match(/[0-9A-Fa-f]{6}/g)
    ? new Jimp(WIDTH, HEIGHT, background)
    : Jimp.read(background);
}

// Font size attributes should be always integer numbers
function validateFontSize(fontSize, fieldName) {
  if (isNaN(fontSize) || parseInt(Number(fontSize)) != fontSize || isNaN(parseInt(fontSize, 10)))
    throw new Error(`Please pass an integer as ${fieldName}`);
}

// Localized objects should contain at least one string for the default language
function validateLocalizedObject(obj, fieldName) {
  if (typeof obj !== 'object' || Object.keys(obj).length < 1 || typeof obj[Object.keys(obj)[0]] !== 'string')
    throw new Error(`Please pass an object with strings defined for each language as ${fieldName}`);
}

// Converts a hex color string into an array of integers
function hexToRgb(hex) {
  const hexCode = hex.replace(/^#/, "");
  const bigint = parseInt(hexCode, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// Default values for plugin options
const defaultPluginOptions = {
  localizedTitles: null,
  localizedAuthors: [],
  defaultLanguage: 'en',
  background: '#000000',
  fontColor: '#ffffff',
  titleFontSize: 96,
  subtitleFontSize: 60,
  fontStyle: 'monospace',
  separator: '|',
  fontFile: null,
  cardFileName: 'twitter-card.jpg',
};

/**
 * Generates a social card image file
 * 
 * @param {object} node - Gatsby node of type MarkdownRemark or Mdx. Should contain a `fields` group with `slug` and `lang` attributes, and also a `frontmatter` with a title
 * @param {object} reporter - Gatsby reporter, used to log the status
 * @param {object} pluginOptions - Plugin options (see README.md)
 * @returns {Promise}
 */
async function createCard(
  node,
  reporter,
  {
    localizedTitles,
    localizedAuthors,
    defaultLanguage,
    background,
    fontColor,
    titleFontSize,
    subtitleFontSize,
    fontStyle,
    separator,
    fontFile,
    cardFileName,
  }) {

  const lang = (node.fields && node.fields.lang) || defaultLanguage;

  const slug = node.fields && node.fields.slug;
  if (!slug) {
    reporter.warn('Markdown node without slug field');
    return;
  }

  const title = node.frontmatter && node.frontmatter.title;
  if (!title) {
    reporter.warn(`Markdown node without title: ${slug} (${lang})`);
    return;
  }

  const output = path.join(
    "./public",
    lang,
    slug,
    cardFileName
  );

  if (fs.existsSync(output)) {
    reporter.verbose(`File ${output} already exists and will be reused.`)
    return;
  }

  const localizedTitle = localizedTitles[lang] || localizedTitles[defaultLanguage] || '';
  const localizedAuthor = localizedAuthors[lang] || localizedAuthors[defaultLanguage] || '';

  let formattedDetails = "";
  if (localizedTitle || localizedAuthor) {
    formattedDetails =
      localizedTitle && localizedAuthor ? `${localizedTitle} ${separator} ${localizedAuthor}` : localizedTitle || localizedAuthor;
  }

  const fontToUint8Array = fontFile
    ? fs.readFileSync(fontFile, null)
    : new Uint8Array();

  const buffer = twitterCard.generate_text(
    title,
    formattedDetails,
    titleFontSize,
    subtitleFontSize,
    hexToRgb(fontColor),
    fontFile ? 'custom' : fontStyle,
    fontToUint8Array
  );

  return Promise.all([generateBackground(background), generateTextLayer(buffer)])
    .then(([base, text]) => base.composite(text, 0, 0))
    .then(image => image.writeAsync(output))
    .then(() => reporter.info(`Created social card for ${lang}${slug}`));
}

// Get all Gatsby nodes of type `MarkdownRemark` and/or `Mdx` and builds social cards for each one
// Called by the gatsby build process at the end of the [Bootstrap phase](https://www.gatsbyjs.org/docs/overview-of-the-gatsby-build-process/#steps-of-the-bootstrap-phase)
async function onPostBootstrap({ getNodesByType, reporter }, pluginOptions) {

  pluginOptions = { ...defaultPluginOptions, ...pluginOptions };

  // Chack params
  validateFontSize(pluginOptions.titleFontSize, 'titleFontSize');
  validateFontSize(pluginOptions.subtitleFontSize, 'subtitleFontSize');
  validateLocalizedObject(pluginOptions.localizedTitles, 'localizedTitles');

  // Collect nodes
  const nodes = getNodesByType('Mdx').concat(getNodesByType('MarkdownRemark'));
  reporter.verbose(`Generating social cards for ${nodes.length} markdown nodes`);

  // Create social cards
  return Promise.all(nodes.map(node => createCard(node, reporter, pluginOptions)))
    .then(cards => reporter.info(`${cards.length} social cards created`))
    .catch(err => reporter.error(`Error creating social cards`, err));
}

exports.onPostBootstrap = onPostBootstrap;
