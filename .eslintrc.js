module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['**/dist/**', '**/generated/**', '**/config/**'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'filenames', 'boundaries', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:boundaries/recommended',
    'prettier',
  ],
  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: 'domain', allow: ['shared'] },

          { from: 'application', allow: ['domain', 'shared'] },

          { from: 'infrastructure', allow: ['domain', 'application', 'shared'] },

          { from: '*', allow: [], message: 'Unknown layer import blocked' },
        ],
      },
    ],
    'filenames/match-regex': [
      'error',
      '^[A-Z][A-Za-z0-9]+(Service|Controller|UseCase|Repository|Entity|Dto|Filter|Module|Adapter|Port|Interceptor|Mapper|Middleware|Util|Value|Type|Decorator|Exception|Error|Factory|Strategy)$',
      true,
    ],
    'filenames/match-exported': [2, 'pascal-case'],
  },
  settings: {
    'boundaries/elements': [
      { type: 'shared', pattern: 'shared/src/**' },
      { type: 'domain', pattern: 'services/*/src/domain/**' },
      { type: 'application', pattern: 'services/*/src/application/**' },
      { type: 'infrastructure', pattern: 'services/*/src/infrastructure/**' },
    ],
    'boundaries/ignore': ['**/*.spec.ts'],
    'import/resolver': {
      typescript: {
        project: './tsconfig.base.json',
      },
    },
  },
  overrides: [
    {
      files: [
        '**/main.ts',
        '**/index.ts',
        '**/.eslintrc.js',
        '**/AppModule.ts',
        '**/*.spec.ts',
        '**/*.e2e-spec.ts',
        '**/test/**',
        '**/jest.config.js',
      ],
      rules: {
        'filenames/match-regex': 'off',
        'filenames/match-exported': 'off',
      },
    },
  ],
};
