import { IPreprocessorOption } from './type';

export const DEFAULT_OPTIONS: IPreprocessorOption = {
  includes: ['jsx'],
  start: ['pug`', 'css`', ' `[^;]'],
  // end: ['`'],
  replace: {
    jsx: '/** @jsx jsx */ jsx;',
  },
};
