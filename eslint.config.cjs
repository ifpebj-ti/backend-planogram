module.exports = [
  {
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn', 
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    ignores: ['dist'],
  },
  require('eslint-config-prettier'),
];
