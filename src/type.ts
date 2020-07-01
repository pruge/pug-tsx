export type Nullable<T> = T | null;

export interface IParamsMap {
  [key: string]: any;
}

export interface IDirectivesMap {
  [key: string]: boolean;
}
export interface IPreprocessorOption {
  includes: string[];
}
