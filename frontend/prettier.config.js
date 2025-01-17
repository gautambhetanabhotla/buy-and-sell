export const prettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  jsxBracketSameLine: true,
  arrowParens: "always",
  proseWrap: "preserve",
  overrides: [
    {
      files: "*.jsx",
      options: {
        tabWidth: 2,
      },
    },
    {
      file: "*.js",
      options: {
        tabWidth: 4,
      },
    },
  ],
};
