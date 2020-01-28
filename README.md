# gatsby-plugin-multilang-twitter-cards 🇺🇳📇

This project is forked from [gatsby-remark-twitter-cards](https://github.com/alessbell/gatsby-remark-twitter-cards), which in turn was derived from [gatsby-remark-social-cards](https://github.com/syntra/gatsby-remark-social-cards)

The main goal of this fork is to make it compatible with multi-languguage sites using [gatsby-plugin-intl](https://www.gatsbyjs.org/packages/gatsby-plugin-intl/). To achieve this goal, a field named `lang` must be defined in all markdown nodes.

![gatsby-plugin-multilang-twitter-cards in action](https://i.imgur.com/FgObEBR.jpg)

`gatsby-plugin-multilang-twitter-cards` is a Gatsby plugin that allows you to create individual open graph twitter card images at build time for inclusion in your site's SEO metadata. It generates cards as JPGs with embedded text in the recommended size of 1200px x 630px.

It uses the [`wasm-twitter-card`](https://github.com/alessbell/wasm-twitter-card) library under the hood: by using Rust libraries compiled to WebAssembly, we can work around some of the limitations of the most popular dependency-free image editing library for Node.js, jimp.

It can be added to your plugins in `gatsby-config.js` like so:

```js
  plugins: [
    // ...
    {
      resolve: `@francesc/gatsby-plugin-multilang-twitter-cards`,
      options: {
        localizedTitles: {en: 'English title', ca: 'Títol català'}, // website titles - required
        localizedAuthors: {en: 'English author', ca: 'Autor català'}, // website author names - optional
        defaultLanguage: 'en', // default language (defaults to 'en')
        separator: '|', // defaults to '|'
        background: require.resolve('./content/assets/base.jpg'), // optional path to 1200x630px file or hex code, defaults to black (#000000)
        fontColor: '#ffffff', // defaults to white (#ffffff)
        titleFontSize: 96, // defaults to 96
        subtitleFontSize: 60, // defaults to 60
        fontStyle: 'monospace', // defaults to 'monospace'
        fontFile: require.resolve('./content/assets/someFont.ttf'), // optional path to a custom TTF font - will override fontStyle
        cardFileName: 'twitter-card.jpg', // optional file name used with social cards - defaults to 'twitter-card-jpg'
      },
    },
  ],
```

## Plugin Options

| Option             | Required | Type                                               | Default value        |
| ------------------ | :------: | -------------------------------------------------- | -------------------- |
| `localizedTitles`  | ✔        | object                                             | `{en: 'Untitled'}`   |
| `localizedAuthors` | ✔        | object                                             | `{en: 'Mr. Gatsby'}` |
| `defaultLanguage`  | ✔        | string                                             | `en`                 |
| `separator`        | ✔        | string (character that separates title and author) | `"|"`                |
| `background`       | ✔        | hex or file path                                   | `"#000000"`          |
| `fontColor`        | ✔        | hex                                                | `"#ffffff"`          |
| `titleFontSize`    | ✔        | int                                                | `96`                 |
| `subtitleFontSize` | ✔        | int                                                | `60`                 |
| `fontStyle`        | ✔        | "monospace" or "sans-serif"                        | `monospace`          |
| `fontFile`         | ✔        | path to TTF font file                              |                      |
| `cardFileName`     | ✔        | file name used when creating social cards          | `twitter-card.jpg`   |

The images will be saved in your site's `/public` folder, and the link to your `twitter:image` should be an absolute URL (something like `${siteUrl}${lang}${blogPostSlug}twitter-card.jpg`) E.g. for [this blog post](https://aless.co/how-to-build-a-keyboard/) the generated image can be found at the link [https://aless.co/en/how-to-build-a-keyboard/twitter-card.jpg](https://aless.co/how-to-build-a-keyboard/twitter-card.jpg).

Further instructions on how to include open graph images in the metadata of your Gatsby blog can be found in the excellent documentation of the plugin that inspired this one, [`gatsby-remark-social-cards`](https://github.com/syntra/gatsby-remark-social-cards#installation)

## Roadmap

- [x] Custom TTF fonts 🎉
- [x] Monospace or sans serif font
- [x] Custom title font size
- [x] Custom subtitle font size
- [x] Custom font color
- [x] Accept path to background image
- [x] OR solid color background with hex code
- [x] Multiple languages
- [x] Convert the gatsby-remark plugin into a regular Gatsby plugin
