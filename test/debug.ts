// const expect = require('chai').expect;
import { expect } from 'chai';
import {
  findVarsInImport,
  findVarsInPug,
  findAllBacktickTemplate,
  getIntersectedVars,
  getOptions,
} from '../src/preprocessor';
import { IParamsMap, IPreprocessorOption, IPattern } from '../src/type';
import { readFileSync } from 'fs';

type IVars = string[];

describe('pug-tsx', () => {
  describe('./test/pages/temp.tsx', () => {
    let importedVars: IVars, usedVars: IVars, intersectedVars: IVars;
    let content: string, options: IPreprocessorOption;

    before(() => {
      const file = './test/pages/temp.tsx';
      content = readFileSync(file, 'utf8');
      options = getOptions({ start: ['gql`', '\\{`'] });
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
      expect(importedVars).to.have.members([]);
    });

    // it('findVarsInPug', () => {
    //   let { pattern } = options;
    //   usedVars = findVarsInPug(
    //     findAllBacktickTemplate(content, pattern),
    //     pattern,
    //   );
    //   expect(usedVars).to.have.members([]);
    // });

    // it('getIntersectedVars', () => {
    //   let { includes } = options;
    //   intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
    //   expect(intersectedVars).to.have.members([]);
    // });
  });
});
