export default {
    exclude: ['**/node_modules/**/*', '**/LICENSE'],
    plugins: ['@snowpack/plugin-webpack', '@snowpack/plugin-typescript'],
    mount: {
        public: '/',
        src: '/dist',
    },
    devOptions: {
        open: 'none',
    },
};
