"use strict";

const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
const generated = require("unist-util-generated");
const jsyaml = require("js-yaml");
const fs = require("fs");

function yaml(ast, file, options) {
  visit(ast, "yaml", visitor);
  function visitor(node) {
    const hasField = (label, field) => {
      if (!field) file.message(`Missing \`${label}\` in frontmatter`);
    };

    if (!generated(node)) {
      try {
        // yaml is valid
        jsyaml.safeLoad(node.value);
        const { title, image, categories } = jsyaml.safeLoad(node.value);
        // has title
        hasField("title", title);
        // has image
        hasField("image", image);
        // has categories
        hasField("categories", categories);

        if (image) {
          const imagePath = `./${image}`;
          if (!fs.existsSync(imagePath)) {
            file.message(`cannot find \`image\` at "${imagePath}"`, node);
          }
        }
        if (categories && typeof categories !== "object") {
          file.message("`categories` must be formatted as an array", node);
        }
        if (categories && options.categories) {
          categories.forEach((category) => {
            if (options.categories.indexOf(category) === -1) {
              file.message(
                `"${category}" is an invalid \`categories\` option; must be one of \`${options.categories.join(
                  ", "
                )}\``,
                node
              );
            }
          });
        }
      } catch (err) {
        file.message(err, node);
      }
    }
  }
}

module.exports = rule("remark-lint:frontmatter", yaml);
