// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/example/**/*',
      'dist/**/*',
      'node_modules/**/*',
    ],
  },
  {
    rules: {
      // overrides
      'no-console': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
)
