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
      '@typescript-eslint/explicit-function-return-type': 'warn', // Altere para 'warn' para obter avisos
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Outras regras podem ser adicionadas aqui
    },
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'], // Aplica as regras em 'src' e 'test'
    ignores: ['dist'],
  },
  require('eslint-config-prettier'),
];
