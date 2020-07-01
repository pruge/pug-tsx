# webpack-preprocessor-pug-tsx

[![Version][version-badge]][npm]
[![Node][node-badge]][node]
![Downloads][download-badge]
[![License][license-badge]][license]
[![Build Status][travis-badge]][travis]

Bring the awesome "pug in typescript" to the Webpack, and more.

- [Tik Tok](#tik-tok)
- [Installation](#installation)
- [Configuration](#configuration)
- [Options](#options)
  - [`includes`](#includes)
  - [`replace`](#replace)
  - [`start`](#start)
- [Caveats](#caveats)
  - [The starting element of the backtick-wrapped phrase should be added to the start of options.](#the-starting-element-of-the-backtick-wrapped-phrase-should-be-added-to-the-start-of-options)
  - [There is no need to include `/** @jsx jsx */` in the document.](#there-is-no-need-to-include--jsx-jsx--in-the-document)
- [Sample Project](#sample-project)
- [Lisense](#lisense)

## Tik Tok

> Try using pug inside TypeScript.

## Installation

```bash
yarn add webpack-preprocessor-pug-tsx -D
```

or

```bash
npm install webpack-preprocessor-pug-tsx -D
```

## Configuration

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          'babel-loader',
          {
            loader: 'webpack-preprocessor-pug-tsx',
            options: {},
          },
        ],
      },
    ],
  },
};
```

## Options

### `includes`

> type: `string[]`
>
> default: `['jsx', 'React']`

Variable that must be included among imported libs.

### `replace`

> type: `{[key: string]: string}`
>
> default: `{'jsx': '/** @jsx jsx */ jsx'}`

When you need to transform the variable declared in includes.

```javascript
// In webpack config...

{
  loader: 'webpack-preprocessor-loader',
  options: {
    replace: {
      jsx: '/** @jsx jsx */ jsx',
    },
  },
},
```

### `start`

```
> type: string[]
>
> default: ['pug`', 'css`', ' `[^;]']
```

Specifies the starting string of the element containing the backtick.
Expressed as a regular expression string.

```
- pug` is the starting string of pug.
- css` is the starting string for emotion css.
-  `[^;] is the starting string for template strings.
```

#### Basic Process

Edit the document as follows:

```javascript
import { jsx, css } from '@emotion/core';
import Button from './my/Button';
import ButtonGroup from './my/ButtonGroup';

...

return pug`
  div(css=[fullscreen, darkLayer])
  div(css=[fullscreen, whiteBoxWrapper])
    div(css=whiteBoxWrapper)
      h3 Confirm
      p 정말로 삭제하시 겠습니까?
      ButtonGroup
        Button cancel
        Button ok
`;

...
```

The following code...

```javascript
/** @jsx jsx */ jsx;
Button;
ButtonGroup;
import { jsx, css } from '@emotion/core';
import Button from './my/Button';
import ButtonGroup from './my/ButtonGroup';

...

return pug`
  div(css=[fullscreen, darkLayer])
  div(css=[fullscreen, whiteBoxWrapper])
    div(css=whiteBoxWrapper)
      h3 Confirm
      p 정말로 삭제하시 겠습니까?
      ButtonGroup
        Button cancel
        Button ok
`;

...

```

## Caveats

### The starting element of the backtick-wrapped phrase should be added to the start of options.

The following code may not work as expected:

```javascript
const Button = styled.button`
  color: turquoise;
`;

render pug`
  Button This my button component.
`;
```

So, you need to add the following to the start of options.

```javascript
{
  loader: 'webpack-preprocessor-pub-tsx',
  options: {
    start: ['button`'],
  },
},
```

### There is no need to include `/** @jsx jsx */` in the document.

The following code is added automatically.

before

```javascript
import { jsx, css } from '@emotion/core';
```

after

```javascript
/** @jsx jsx */ jsx;
import { jsx, css } from '@emotion/core';
```

## Sample Project

```bash
git clone git@github.com:pruge/storybook-tutorial.git
yarn
yarn storybook
```

## Lisense

MIT License

[version-badge]: https://img.shields.io/npm/v/webpack-preprocessor-loader.svg
[npm]: https://www.npmjs.com/package/webpack-preprocessor-loader
[node-badge]: https://img.shields.io/node/v/webpack-preprocessor-loader.svg
[node]: https://nodejs.org
[download-badge]: https://img.shields.io/npm/dt/webpack-preprocessor-loader.svg
[license]: LICENSE
[license-badge]: https://img.shields.io/npm/l/webpack-preprocessor-loader.svg
[travis-badge]: https://travis-ci.org/afterwind-io/preprocessor-loader.svg?branch=master
[travis]: https://travis-ci.org/afterwind-io/preprocessor-loader
