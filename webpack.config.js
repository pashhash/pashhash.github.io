const { join, resolve } = require("path");

module.exports = {
	entry: "./src/index.ts",
	module: {
		noParse: /\.wasm$/,
		rules: [
			{
				test: /\.ts?$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.wasm$/,
				loader: "base64-loader",
				type: "javascript/auto"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"],
		fallback: {
			path: false,
			fs: false,
			Buffer: false,
			process: false
		}
	},
	output: {
		filename: "bundle.js",
		path: resolve(__dirname, "public")
	},
	devServer: {
		static: { directory: join(__dirname, "public") },
		port: 3000
	}
};
