// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "client": { url: "/" },
  },
  plugins: [
    ['@snowpack/plugin-sass', {
      compilerOptions: {
        style: "compressed",
        sourceMap: false,
      }
    }],
    ['@snowpack/plugin-babel', {
      transformOptions: {
        presets: ['@babel/preset-env']
      }
    }],
    ["@snowpack/plugin-optimize", { minifyCSS: false }],
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
