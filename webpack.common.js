const path = require("path");
//const {merge} = require(./we)

const webpackCommonConfig = {
    entry: {
        path: path.join(__dirname, "./client/index.js"),
    },
    output: {
        path: path.join(__dirname, "./public/dist"),
        filename: "main.js",
        publicPath: "../dist"
    },
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
                    presets: ["@babel/preset-react"],
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
       
    },
    mode: 'development'
};
 
module.exports = webpackCommonConfig;