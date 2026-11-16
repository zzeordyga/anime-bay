import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'out', '.next'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
);