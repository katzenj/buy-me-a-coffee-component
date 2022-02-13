import vue from "rollup-plugin-vue";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default [
  {
    input: "src/components/SendCoffee.vue",
    output: [
      {
        format: "esm",
        file: "dist/library.mjs",
      },
      {
        format: "cjs",
        file: "dist/library.js",
      },
    ],
    plugins: [
      vue(),
      peerDepsExternal(),
      json({ compact: true }),
      commonjs(),
      postcss({
        config: {
          path: "./postcss.config.js",
        },
        minimize: true,
        modules: false,
        extract: true,
      }),
    ],
  },
];
