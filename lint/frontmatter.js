"use strict";

const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
const generated = require("unist-util-generated");
const jsyaml = require("js-yaml");
const fs = require("fs");

function yaml(ast, file, options) {
  visit(ast, "yaml", visitor);
  function visitor(node) {
    if (!generated(node)) {
      try {
        // yaml is valid
        jsyaml.safeLoad(node.value);
        const title = jsyaml.safeLoad(node.value).title;
        const image = jsyaml.safeLoad(node.value).image;
        const categories = jsyaml.safeLoad(node.value).categories;
        // has title
        if (!title) {
          file.message("missing `title` in frontmatter", node);
        }
        // has image
        if (!image) {
          file.message("missing `image` in frontmatter", node);
        }
        if (image) {
          const imagePath = `./${image}`;
          if (!fs.existsSync(imagePath)) {
            file.message(`cannot find \`image\` at "${imagePath}"`, node);
          }
        }
        // has categories
        if (!categories) {
          file.message("missing `categories` in frontmatter", node);
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
