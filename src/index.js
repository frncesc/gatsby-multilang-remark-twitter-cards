const path = require("path");
const Jimp = require("jimp");
const twitterCard = require("wasm-twitter-card");

const generateCard = async ({ buffer }) => {
  const width = 1200;
  const height = 630;
  let image = await new Jimp({ data: buffer, width, height });
  return image;
};

module.exports = ({ markdownNode }, { author, title }) => {
  const post = markdownNode.frontmatter;
  if (!markdownNode.fields) return;

  const output = path.join(
    "./public",
    markdownNode.fields.slug,
    "twitter-card.jpg"
  );

  generateCard({
    buffer: twitterCard.generate_text(post.title, `${title} | ${author}`),
  })
    .then(image =>
      image
        .writeAsync(output)
        .then(() => console.log("Generated Twitter Card:", output))
        .catch(err => console.log("ERROR GENERATING TWITTER CARD", err))
    )
    .catch(console.error);
};
