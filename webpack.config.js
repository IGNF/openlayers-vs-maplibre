const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const { env } = require('process');

let config = {
    mode: 'development',
    entry: {
        app: './assets/js/app.js',
        'map-ol': './assets/js/map-ol.js',
        'map-maplibre': './assets/js/map-maplibre.js',
    },
    devtool: 'source-map',
    devServer: {
        port: "8080"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Comparaison Maplibre et OpenLayers',
            template: './src/index.html',
            chunks: ['app']
        }),
        new HtmlWebpackPlugin({
            title: 'Map OpenLayers',
            template: './src/map-ol.html',
            filename: "map-ol.html",
            chunks: ['app', 'map-ol']
        }),
        new HtmlWebpackPlugin({
            title: 'Map Maplibre',
            template: './src/map-maplibre.html',
            filename: "map-maplibre.html",
            chunks: ['app', 'map-maplibre']
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new MiniCssExtractPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './docs'), // docs because github pages
        clean: true,
    },
    module: {
        rules: [{
            test: /\.js$/i,
            exclude: /node_modules/,
            use: ['babel-loader']
        },
        {
            test: /\.css$/i,
            use: [
                env.dev ? "style-loader" : MiniCssExtractPlugin.loader,
                'css-loader'
            ],
        },
        {
            test: /\.(sa|sc)ss$/,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader",
            ],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        }]
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        }
    },
    optimization: {
        runtimeChunk: 'single',
    },
};

module.exports = (env) => {
    console.log(`Mode dev : ${env.dev}`)
    if (!env.dev) {
        config.plugins.push(new TerserPlugin());
        config.devtool = 'eval-cheap-module-source-map';
    }
    return config;
}