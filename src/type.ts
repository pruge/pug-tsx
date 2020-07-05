export interface IParamsMap {
  [key: string]: any;
}

export interface IPreprocessorOption {
  includes: string[];
  start: string[];
  end: string;
  replace: IParamsMap;
  pattern: IPattern;
}

export interface IPattern {
  start: string;
  end: string;
}
