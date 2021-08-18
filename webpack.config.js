const path = require("path");

module.exports = {
    context: path.resolve(__dirname),
    entry: "./app.ts",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "public/dist")
    },
    resolve: {
        extensions: [".ts"]
    }
};
