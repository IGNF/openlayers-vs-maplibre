const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    entry: {
        app: './src/js/app.js',
        'map-ol': './src/js/map-ol.js',
        'map-maplibre': './src/js/map-maplibre.js',
    },
    devtool: 'inline-source-map',
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
            chunks: ['app']
        }),
        new HtmlWebpackPlugin({
            title: 'Map Maplibre',
            template: './src/map-maplibre.html',
            filename: "map-maplibre.html",
            chunks: ['app']
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'docs'), // docs because github pages
        clean: true,
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        }],
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