require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/default'],
  parserOptions: { project: ['./tsconfig.json'], tsconfigRootDir: __dirname },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-prototype-builtins': 'off',
    'no-extra-boolean-cast': 'off'
  }
};
