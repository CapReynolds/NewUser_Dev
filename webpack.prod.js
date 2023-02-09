const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
const webpackProdConfig = {
    entry: {
        path: path.join(__dirname, "./client/index.js"),
    },
    output: {
        path: path.join(__dirname, "./build/"),
        filename: "main.js"
    },
    plugins: [
        new HtmlWebpackPlugin( {
            inject: false,
            template: path.resolve(__dirname, "public/index.html")
        })
    ],
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    },
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env","@babel/preset-react"],
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
       
    },
    // devServer: {
    //     proxy: [{
    //         context: ['/'],
    //         target: 'http://localhost:5000',
    //       }]
    // },
    mode: 'production'
};
 
module.exports = webpackProdConfig;