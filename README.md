## gatsby-remark-twitter-cards

![gatsby-remark-twitter-cards in action](https://i.imgur.com/UGFRs9g.png)

`gatsby-remark-twitter-cards` creates individual twitter card images at build time for inclusion in your site's SEO metadata in order to provide a better social sharing experience.

It uses the [`wasm-twitter-card`](https://github.com/alessbell/wasm-twitter-card) library under the hood: by using Rust libraries compiled to WebAssembly, we can work around some of the limitations of the most popular dependency-free image editing library for Node.js, jimp.

This pre-release version is a work in progress. At the moment, the card will only render a card with a black background and white monospace text. It is being actively developed for much greater control over the card styling, including fonts and background images.

If you'd like to play with the alpha release, it can be added to your remark plugins in `gatsby-config.js` like so:

```js
  plugins: [
    // ...
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-twitter-cards`,
            options: {
              title: 'anti/pattern (blog title here)',
              author: 'alessia bellisario (author's name)',
            },
          },
        ],
      },
    },
  ],
```

The images will be saved in your built site's `/public` folder, and the link to your `twitter:image` should be an absolute URL (something like `${siteUrl}${blogPostSlug}twitter-card.jpg`) E.g. for [this blog post](https://aless.co/how-to-build-a-keyboard/) the generated image can be found at the link [https://aless.co/how-to-build-a-keyboard/twitter-card.jpg](https://aless.co/how-to-build-a-keyboard/twitter-card.jpg). 

## License

This project is licensed under the MIT License - see the
[LICENCE.md](./LICENCE.md) file for details
