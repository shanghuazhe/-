module.exports = {
    //自动打开页面
    devServer: {
        open: true,
    },
    //配置的rem
    css: {
        loaderOptions: {
            css: {},
            postcss: {
                plugins: [
                    require('postcss-px2rem')({
                        // rem 的单位  填设计稿的 1/10
                        //不是写死的,看设计稿 如果是750 那就是 75
                        remUnit: 37.5,
                    }),
                ],
            },
        },
    },
}