const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs");

const pages = path.resolve(__dirname, "src/pages");
const plugins = [
    new CopyPlugin({
        patterns: [
        { from: "./assets", to: "assets" }
        ],
      }),
    new MiniCssExtractPlugin({
        filename : "css/[name].css"
    })
];
const templates = [];

fs.readdirSync(pages).forEach((page) => {
    fs.readdirSync(path.resolve(__dirname, pages, page)).forEach((item) => {
        if (item.match(/\.pug$/i)) {
            const folder = item.replace(/\.pug$/i, "");
            templates.push(new HtmlWebpackPlugin({
                filename: item.replace(/\.pug$/i, '.html'),
                template: pages + `/${folder}/` + item,
                inject: false,
                minify: {
                    collapseWhitespace: false
                },
          }));
        }  
    })
  });

module.exports = {
    context : path.resolve(__dirname, "src"),
    mode : "development",
    entry : {
        main : "./index.js",
        date : {
            import : "./js/components/date/date.js",
            filename : "./js/components/date/date.js"
        },
        dropdownBlock : {
            import : "./js/components/form-elements/dropdown-block.js",
            filename : "./js/components/form-elements/dropdown-block.js"
        },
        slider : {
            import : "./js/components/cards/slider.js",
            filename : "./js/components/cards/slider.js"
        },
        rangeSldier : {
            import : "./js/components/form-elements/range-slider.js",
            filename : "./js/components/form-elements/range-slider.js"
        },
        burgerMenu : {
            import : "./js/components/burger-menu/burger-menu.js",
            filename : "./js/components/burger-menu/burger-menu.js"
        },
        filter : {
            import : "./js/components/filter/filter.js",
            filename : "./js/components/filter/filter.js"
        }
    },
    output : {
        filename : "[name].bundle.js",
        path : path.resolve(__dirname, "dist"),
        clean : true
    },
    devServer : {
        static: {
            directory: path.join(__dirname, 'src'),
          },
        port : 5500
    },
    plugins : templates.concat(plugins),
    module : {
        rules : [
            {
                test : /\.scss$/,
                use : [
                MiniCssExtractPlugin.loader, 
                {
                    loader : "css-loader",
                    options : {
                        url : false
                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                      postcssOptions: {
                        plugins: [
                                [
                            "postcss-preset-env",
                                ],
                            ],
                        },
                    },
                },
                {
                    loader : "sass-loader",
                }]
            },
            {
                test: /\.pug$/,
                use : [
                    {
                        loader: 'pug-loader',
                        options : {
                            pretty: true 
                        }
                    }
                ]
            },
            {
                test: /\.js?$/,
                use : [
                    {
                        loader: 'babel-loader',
                        options : {
                            exclude: /node_modules/,
                        }
                    }
                ]
            }
        ],
    },
};