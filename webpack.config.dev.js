const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    //入口文件
    entry: ['babel-polyfill', path.resolve(__dirname, 'src/app/index.jsx')],
    devtool: "inline-source-map",
    //出口文件
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name]' + '.js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.tsx']
    },
    module: {
        rules: [{
            test: /(\.js|\.jsx)$/,
            use: {
                loader: 'babel-loader'
            },
            exclude: /node_modules/
        },{
            test:/\.css/,
            use:['style-loader', 'css-loader']
        }, {
            test: /(\.less)$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader:'less-loader'
            }],
            exclude: /node_modules/
        }, { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&outputPath=./imgs/&publicPath=imgs/' }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename:'index.html',
            template: path.resolve(__dirname, './tpl.html')
        }),
        new webpack.HotModuleReplacementPlugin()
        ,new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './public'),
            to: path.resolve(__dirname, './dist/public'),
        }])
    ],
    mode:'development',
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        port:9000,
        historyApiFallback:true,
        hot:true,
    },
};