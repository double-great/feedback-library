module.exports.plugins = [
  ["@double-great/remark-lint-alt-text"],
  ["remark-frontmatter", ["yaml"]],
  [
    "remark-frontmatter-validator",
    [
      2,
      {
        title: {
          type: "string",
          required: true,
        },
        image: {
          type: "string",
          match: "^img/\\d\\d\\d\\d-\\d\\d-\\d\\d-.*.(png|jpg)$",
          required: true,
        },
        categories: {
          type: "array",
          oneOf: ["documentation", "product", "support"],
          required: true,
        },
      },
    ],
  ],
];
