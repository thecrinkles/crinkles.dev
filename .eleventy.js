import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import fontAwesomePlugin from "@11ty/font-awesome";
// Own configuration
import * as filters from "./src/_config/filters.js";
import * as collections from "./src/_config/collections.js";
import * as libraries from "./src/_config/libraries.js";
import * as shortcodes from "./src/_config/shortcodes.js";
import * as transformers from "./src/_config/transformers.js";
import * as extensions from "./src/_config/extensions.js";
import { TEMPLATE_ENGINE } from "./src/_config/constants.js";

export default async function (config) {
  // Handling assets (images, fonts, etc.)
  config.addPassthroughCopy({ "./public/": "/" });
  // index.css bundles its @imports via LightningCSS; Eleventy can't see that
  // dependency, so watch the styles dir to re-bundle when a partial changes.
  config.addWatchTarget("./src/styles/");
  config.addPlugin(pluginRss);
  config.addPlugin(syntaxHighlight);
  config.addPlugin(fontAwesomePlugin);

  // filters
  Object.keys(filters).forEach((name) => {
    config.addFilter(name, filters[name]);
  });
  // collections
  Object.keys(collections).forEach((name) => {
    config.addCollection(name, collections[name]);
  });
  // amending libraries
  Object.keys(libraries).forEach((name) => {
    config.amendLibrary(name, libraries[name]);
  });
  // shortcodes
  Object.keys(shortcodes).forEach((name) => {
    config.addShortcode(name, shortcodes[name]);
  });
  // transformers
  Object.keys(transformers).forEach((name) => {
    config.addTransform(name, transformers[name]);
  });
  // css transformer
  Object.keys(extensions).forEach((name) => {
    config.addTemplateFormats(name);
    extensions[name](config);
  });

  return {
    markdownTemplateEngine: TEMPLATE_ENGINE,
    dataTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
    dir: {
      input: "src",
      layouts: "_layouts",
      output: "_site",
    },
  };
}
