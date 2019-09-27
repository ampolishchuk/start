const path = require('path'); // Абсолютные пути
const fs = require('fs'); // Работа с файловой системой
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Управляет html файлами
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Вырезает css из js в отдельный файл
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Копирует файлов 

// Пути к основным директориям
const PATHS = {
    s_src: path.join(__dirname, '../src'),
    s_dist: path.join(__dirname, '../dist'),
    s_css: 'css',
    s_js: 'js',
    s_img: 'img',
    s_static: 'static'
}
// Точки вхождения для вебпака
PATHS.s_entires = `${PATHS.s_src}/entries/`;
// Имена файлов .pug в директории разработки
PATHS.a_pages = fs.readdirSync(PATHS.s_src)
    .filter(s_fileName => s_fileName.endsWith('.pug'))
    .map(s_fileName => s_fileName.replace('.pug', ''));

module.exports = {
    entry: {
        main: `${PATHS.s_entires}/main.js`,
        index: `${PATHS.s_entires}/index.js`,
        about: `${PATHS.s_entires}/about.js`
    },
    externals: {
        paths: PATHS // Подключение внешних объектов
    },    
    output: {
        filename: `${PATHS.s_js}/[name].js`, // Точка выхода
        path: PATHS.s_dist // Путь сохранения файла при сборке
    },
    optimization: { // Выносит подключенные модули в отдельный файл
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.pug/, // Регулярное выражение для обробатываемых файлов
                loader: 'pug-loader' // Используемый loader
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { 
                            sourceMap: true
                        }
                    },  
                    {
                        loader: 'postcss-loader',
                        options: { 
                            sourceMap: true, 
                            config: { 
                                path: './config/postcss.config.js' // Файл конфига postcss
                            } 
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { 
                            sourceMap: true 
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        ...PATHS.a_pages.map(s_pageName => new HtmlWebpackPlugin({
            template: `${PATHS.s_src}/${s_pageName}.pug`, // Файл шаблона 
            filename: `${PATHS.s_dist}/${s_pageName}.html`, // Обработанный файл
            inject: false
        })),
        new MiniCssExtractPlugin({
            filename: `${PATHS.s_css}/[name].css` // [hash] для добавления хеша к имени файла
        }),
        new CopyWebpackPlugin([
            { 
                from: `${PATHS.s_src}/${PATHS.s_img}`,
                to: PATHS.s_img 
            },
            { from: `${PATHS.s_src}/${PATHS.s_static}` }
        ]),
    ],
} 