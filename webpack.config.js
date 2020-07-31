var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    //入口文件
    entry: ['babel-polyfill', path.resolve(__dirname, 'src/app/index.jsx')],
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
        },{
            test: /(\.less)$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader?localIdentName=[name]__[local]___[hash:base64:5]'
            }, {
                loader:'less-loader'
            }],
            exclude: /node_modules/
        }, { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&outputPath=../imgs/&publicPath=imgs/' }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: __dirname + '/dist/index.html',
            template: __dirname + "/tpl.html"
        }) ,
        new CopyWebpackPlugin([{
            from: __dirname + '/public',
            to: __dirname + '/dist/public',
        }])
    ]
}
