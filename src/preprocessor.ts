import { findVariablesInTemplate } from 'pug-uses-variables';
import * as XRegExp from 'xregexp';
import { DEFAULT_OPTIONS } from './global';
import { IPreprocessorOption } from './type';
// import { readFile } from 'fs';

export interface IWebpackLoaderContext {
  query: IPreprocessorOption;
}

const findComponents = (variables: any[]): string[] => {
  return variables
    .filter(
      (variable: any) => variable.value[0] === variable.value[0].toUpperCase(),
    )
    .map((variable: any) => variable.value);
};

const findPug = (content: string) => {
  let rst;
  try {
    rst = XRegExp.matchRecursive(content, 'pug`', '`', 'g');
    rst = rst.map((match: string) =>
      match.replace(/\/\/.*$/gm, '').trimRight(),
    );
  } catch (error) {
    rst = [];
  }

  rst = rst.filter((item: string) => !/\\n/.test(item));
  return rst;
};

const findAllComponents = (contents: any[]): string[] => {
  let components: string[] = [];

  for (var i = 0; i < contents.length; i++) {
    let content: string = contents[i];
    const pugTemplates = findPug(content);

    if (/pug`([\w\s\S]*)`/.test(content)) {
      components = components.concat(findAllComponents(pugTemplates));
      content = content.replace(/pug`([\w\s\S]*)`/, '');
      content = content.replace(/\$\{\}/, 'test');
    }

    components = components.concat(
      findComponents(findVariablesInTemplate(content)),
    );
  }

  return [...new Set(components)];
};

// readFile('ButtonGroup.stories.tsx', 'utf8', function (err: any, data: string) {
//   if (data) {
//     let pugTemplate = findPug(data);
//     let components = findAllComponents(pugTemplate);
//     // components = [...new Set(components)];
//     console.log(components);
//   }
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
  let { includes } = getOptions(this.query);
  let pugTemplate = findPug(content);
  let components = findAllComponents(pugTemplate);

  includes = includes.filter((item) => content.includes(item));
  components = [...components, ...includes];
  components = [...new Set(components)];

  return `${components.join(';\n')};\n${content}`;
}

function getOptions(query: Partial<IPreprocessorOption>): IPreprocessorOption {
  const options: IPreprocessorOption = Object.assign(
    {},
    DEFAULT_OPTIONS,
    query,
  );

  return options;
}
