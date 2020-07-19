import { findVariablesInTemplate } from 'pug-uses-variables';
import * as XRegExp from 'xregexp';
import { DEFAULT_OPTIONS } from './global';
import { IPreprocessorOption, IPattern } from './type';
import debug from 'debug';

const logPug = debug('vars:inPug');

export interface IWebpackLoaderContext {
  query: IPreprocessorOption;
}

/**
 * import한 liabrary의 변수를 추출한다.
 */
export const findVarsInImport = (content: string): string[] => {
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

/**
 * value 값 배열로 변환
 */
const stripVars = (variables: any[]): string[] => {
  return variables.map((variable: any) => variable.value);
};

const stripPattern = (content: string): string => {
  try {
    // const exclude = XRegExp.matchRecursive(content, '\\$\\{|\\{', '\\}', 'gi');
    const exclude = XRegExp.matchRecursive(
      content,
      '\\$\\{|\\{|#\\{',
      '\\}',
      'gi',
    );
    exclude.forEach((item: string) => {
      content = content.replace(item, '');
    });
  } catch (error) {
    console.error(error);
  }
  return content.replace(/\$\{\}|#\{\}/gm, 'test');
};

/**
 * backtick이 포함된 문자열 추출
 */
export const findAllBacktickTemplate = (content: string, pattern: IPattern) => {
  let rst;
  try {
    rst = XRegExp.matchRecursive(content, pattern.start, pattern.end, 'gi');
    rst = rst
      .map((match: string) => match.replace(/\/\/.*$/gm, '').trim())
      .filter((item: string) => !/\\n/.test(item));
  } catch (error) {
    console.error(
      '[pug-tsx] options.start에 backtick 시작 문자열을 등록하세요.',
    );
    throw error;
  }

  logPug(rst);
  return rst;
};

/**
 * pug` `에서 사용된 변수 추출
 */
export const findVarsInPug = (contents: any[], pattern: IPattern): string[] => {
  let usedVars: string[] = [];

  for (var i = 0; i < contents.length; i++) {
    let content: string = contents[i];
    const pugTemplates = findAllBacktickTemplate(content, pattern);
    let variables;

    logPug(pugTemplates);

    try {
      // 내부에 pug`가 또 있다면,
      if (/pug`([\w\s\S]*)`/.test(content)) {
        usedVars = usedVars.concat(findVarsInPug(pugTemplates, pattern));

        // 내부 ${pub``} 제거
        pugTemplates.forEach((pug: string) => {
          content = content.replace(pug, '');
        });
        content = content.replace(/pug``/, '');
        content = stripPattern(content);
      }

      try {
        logPug(content);
        variables = findVariablesInTemplate(content);
        usedVars = usedVars.concat(stripVars(variables));
      } catch (error) {
        // 내부에 ${!content || $vars} 함수를 쓴것이 문제가 된다.
        content = stripPattern(content);
        variables = findVariablesInTemplate(content);
        usedVars = usedVars.concat(stripVars(variables));
      }
    } catch (error) {
      // console.error(error);
      logPug(error);
    }
  }

  return [...new Set(usedVars)];
};

/**
 * pug에서 사용된 변수들: usedVars
 * import 된 변수들: importedVars
 * options.includes : includes
 *
 * 교차된 변수 추출
 */
export const getIntersectedVars = (
  usedVars: string[],
  importedVars: string[],
  includes: string[],
): string[] => {
  let intersection = usedVars.filter((item) => importedVars.includes(item));
  includes = includes.filter((item) => importedVars.includes(item));
  intersection = [...intersection, ...includes];
  intersection = [...new Set(intersection)];

  return intersection;
};

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
  let { includes, replace, pattern } = getOptions(this.query);
  const usedVars = findVarsInPug(
    findAllBacktickTemplate(content, pattern),
    pattern,
  );
  const importedVars = findVarsInImport(content);
  const intersectedVars = getIntersectedVars(usedVars, importedVars, includes);

  const replacedVars = intersectedVars.map((item: string) => {
    if (replace[item]) {
      return replace[item];
    } else {
      return item;
    }
  });

  if (replacedVars.length !== 0) {
    return `${replacedVars.join(';\n')};\n${content}`;
  } else {
    return content;
  }
}

export function getOptions(
  query: Partial<IPreprocessorOption>,
): IPreprocessorOption {
  const options: IPreprocessorOption = DEFAULT_OPTIONS;
  options.includes = mergeDedupe([options.includes, query.includes || []]);
  options.start = mergeDedupe([options.start, query.start || []]);
  options.replace = Object.assign({}, options.replace, query.replace || {});

  options.pattern = {
    start: options.start.join('|'),
    end: options.end,
  };

  return options;
}

function mergeDedupe(arr: any[]): string[] {
  return [...new Set([].concat(...arr))];
}
