/* eslint-disable no-console */
const webpack = require('webpack');

webpack(
  {
    mode: 'none',
    entry: './mock/mock.js',
    output: {
      filename: 'mock.gen.js',
      path: __dirname,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'webpack-preprocessor-pug-tsx',
              options: {},
            },
          ],
        },
      ],
    },
  },
  (err, stats) => {
    console.log(stats.toString({ colors: true }));
    console.log(err);
  },
);
