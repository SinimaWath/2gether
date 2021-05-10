module.exports = {
    plugins: ['prettier', 'react'],
    extends: ['plugin:prettier/recommended', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
    },
    env: {
        es2021: true,
        node: true,
        browser: true,
    },
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2021,
    },
};
