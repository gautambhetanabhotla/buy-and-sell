export default {
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
    proseWrap: 'preserve',
    overrides: [
      {
        files: '*.tsx',
        options: {
          tabWidth: 2,
        },
      },
      {
        files: '*.html',
        options: {
          tabWidth: 2,
        },
      },
    ],
  };