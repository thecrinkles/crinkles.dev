import browserslist from "browserslist";
import { browserslistToTargets, bundleAsync } from "lightningcss";

const targets = browserslistToTargets(browserslist("> 0.5% and not dead"));

export function css(config) {
  config.addTemplateFormats("css");
  config.addExtension("css", {
    outputFileExtension: "css",
    compile: async (_, inputPath) => {
      if (inputPath !== "./src/styles/index.css") return;

      return async () => {
        let { code } = await bundleAsync({
          filename: inputPath,
          minify: true,
          nesting: true,
          drafts: { customMedia: true },
          targets,
        });
        return code;
      };
    },
  });
}
