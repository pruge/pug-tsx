import { IPreprocessorOption, IPattern } from './type';

export const DEFAULT_OPTIONS: IPreprocessorOption = {
  includes: ['jsx', 'React'],
  start: ['pug`', 'css`', '[ [({]`[^;,}\\]]'],
  end: '`',
  replace: {
    jsx: '/** @jsx jsx */ jsx;',
  },
  pattern: {
    start: '',
    end: '',
  },
};
