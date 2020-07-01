import { findVariablesInTemplate } from 'pug-uses-variables';
import * as XRegExp from 'xregexp';
import { DEFAULT_OPTIONS } from './global';
import { IPreprocessorOption } from './type';
import { readFile } from 'fs';

export interface IWebpackLoaderContext {
  query: IPreprocessorOption;
}

let pattern = { start: '', end: '`' };

const findImportVariables = (content: string): string[] => {
  let rst: any[];
  rst = content.match(/import(.*)from/gm) || [];
  rst = rst.map((item) => {
    let variable = item
      .match(/import(.*)from/)[1]
      .replace(/{|}/g, '')
      .split(',');

    return variable;
  });

  rst = rst.flat(Infinity).map((item) => item.trim());

  return rst;
};

const findComponents = (variables: any[]): string[] => {
  return variables.map((variable: any) => variable.value);
};

const findPug = (content: string) => {
  let rst;
  try {
    // console.log(content);
    rst = XRegExp.matchRecursive(content, pattern.start, pattern.end, 'gi');
    // rst = XRegExp.matchRecursive(content, 'pug`|css`| `[^;]', '`', 'gi');
    // console.log(rst);
    // console.log('--------');
    rst = rst
      .map((match: string) => match.replace(/\/\/.*$/gm, '').trim())
      .filter((item: string) => !/\\n/.test(item));
  } catch (error) {
    rst = [];
    // console.log(error);
  }

  return rst;
};

const findAllComponents = (contents: any[]): string[] => {
  let components: string[] = [];

  for (var i = 0; i < contents.length; i++) {
    let content: string = contents[i];
    const pugTemplates = findPug(content);
    let exclude = [];

    try {
      if (/pug`([\w\s\S]*)`/.test(content)) {
        components = components.concat(findAllComponents(pugTemplates));
        content = content.replace(/pug`([\w\s\S]*)`/, '');
        exclude = XRegExp.matchRecursive(content, '\\$\\{|\\{', '\\}', 'gi');
        exclude.forEach((item: string) => {
          content = content.replace(item, '');
        });
        content = content.replace(/\$\{\}/, 'test');
      }

      // console.log('--------');
      // console.log(content);
      // console.log('--------');

      components = components.concat(
        findComponents(findVariablesInTemplate(content)),
      );
    } catch (error) {
      // console.error(error);
    }
  }

  return [...new Set(components)];
};

// const files = [
//   // 'TransitionAlerts.js',
//   // 'ButtonGroup.stories.tsx',
//   'Dialog.tsx',
// ];
// files.forEach((file) => {
//   readFile(file, 'utf8', function (err: any, data: string) {
//     if (data) {
//       const components = findAllComponents(findPug(data));
//       console.log(file, components);

//       const importVarialbles = findImportVariables(data);
//       console.log('import', importVarialbles);

//       const intersection = components.filter((item) =>
//         importVarialbles.includes(item),
//       );
//       console.log('intersection', intersection);

//       // let cssTemplate = findExclude(data);
//       // console.log(cssTemplate);
//     }
//   });
// });

/**
 * The preprocessor
 *
 * @export
 * @param {IWebpackLoaderContext} this webpack loader context
 * @param {string} content raw text file
 * @returns {string}
 */
export function preprocessor(
  this: IWebpackLoaderContext,
  content: string,
): string {
  let { includes, replace } = getOptions(this.query);
  const components = findAllComponents(findPug(content));
  const importVarialbles = findImportVariables(content);
  let intersection = components.filter((item) =>
    importVarialbles.includes(item),
  );

  // 문서에 포함된 것 만.
  includes = includes.filter((item) => content.includes(item));
  intersection = [...intersection, ...includes];
  intersection = [...new Set(intersection)];
  intersection = intersection.map((item: string) => {
    if (replace[item]) {
      return replace[item];
    } else {
      return item;
    }
  });

  if (intersection.length !== 0) {
    return `${intersection.join(';\n')};\n${content}`;
  } else {
    return content;
  }
}

function getOptions(query: Partial<IPreprocessorOption>): IPreprocessorOption {
  const options: IPreprocessorOption = DEFAULT_OPTIONS;
  options.includes = mergeDedupe([options.includes, query.includes || []]);
  options.start = mergeDedupe([options.start, query.start || []]);
  // options.end = mergeDedupe([options.end, query.end || []]);
  options.replace = Object.assign({}, options.replace, query.replace || {});

  // console.log('options', options);

  pattern.start = options.start.join('|');

  return options;
}

function mergeDedupe(arr: any[]): string[] {
  return [...new Set([].concat(...arr))];
}
