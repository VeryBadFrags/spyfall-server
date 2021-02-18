// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    client: { url: "/" },
    assets: { url: "/", static: true },
  },
  plugins: [
    [
      "@snowpack/plugin-sass",
      {
        compilerOptions: {
          style: "compressed",
          sourceMap: false,
        },
      },
    ],
    [
      "@snowpack/plugin-babel",
      {
        transformOptions: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
    ["@snowpack/plugin-optimize"],
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'cp node_modules/socket.io-client/dist/socket.io.min.js build/', // production build command
      },
    ],
  ],
};
