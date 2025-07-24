import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next"],
  },
  {
    
    // This is the minimum configuration required for ESLint to parse TypeScript files.
    // No linting rules are enabled.
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
    },
  },
);
