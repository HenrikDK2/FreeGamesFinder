const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = "style-loader";
const sharedConfig = {
  mode: isProduction ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
};

module.exports = () => [
  {
    ...sharedConfig,
    entry: "./src/background/background.ts",
    output: {
      filename: "background.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "public", to: "" }],
      }),
    ],
  },
  {
    ...sharedConfig,
    entry: "./src/popup/index.tsx",
    output: {
      filename: "popup.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
];
