const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/scss/vars/index.scss";`,
            },
        },
    },
    chainWebpack: (config) => {
        // GraphQL Loader
        config.module
            .rule("glsl")
            .test(/\.(glsl|vs|fs|vert|frag)$/)
            .exclude.add(/node_modules/)
            .end()
            .use("raw-loader")
            .loader("raw-loader")
            .end()
            .use("glslify-loader")
            .loader("glslify-loader")
            .end();
    },
    configureWebpack: {
        experiments: {
            asyncWebAssembly: true,
            syncWebAssembly: true,
        },
    },
});
