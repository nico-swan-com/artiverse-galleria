import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  root: true,
  plugins: ['@typescript-eslint' /* , 'tailwindcss' */],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        projectService: true,
        tsconfigRootDir: __dirname
      },
      extends: [
        // 'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:tailwindcss/recommended',
        'prettier'
      ]
    }
  ],

  rules: {
    'tailwindcss/classnames-order': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, -1, 2],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        detectObjects: false
      }
    ],
    'max-lines-per-function': [
      'warn',
      {
        max: 200,
        skipBlankLines: true,
        skipComments: true
      }
    ]
  }
})

const eslintConfig = [
  {
    ignores: [
      '**/_next/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/out/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/public/**',
      '**/server.js'
    ]
  },
  ...compat.extends(
    // 'next/core-web-vitals', // Disabled due to ESLint 9 compatibility issues
    // 'next/typescript',
    // 'plugin:tailwindcss/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  }
]

export default eslintConfig
