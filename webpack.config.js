const path = require("path");

const webpackConfig = {
    entry: {
        path: path.join(__dirname, "./client/index.js"),
    },
    output: {
        path: path.join(__dirname, "./public/dist"),
        filename: "main.js",
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    },
            }
        ],
        
    },
    mode: 'development'
};

module.exports = webpackConfig;

