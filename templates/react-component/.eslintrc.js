module.exports = {
  parser:  '@typescript-eslint/parser',
  parserOptions: {
    "ecmaVersion": 2019,
    "sourceType": 'module',
    "ecmaFeatures":{
      jsx:true,
    },
  },
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  settings: {
    "react": {
      "pragma": "React",
      "version": "detect",
    },
  },
  plugins: ['@typescript-eslint'],
  env:{
    browser: true,
  },
  rules: {
  },
}
