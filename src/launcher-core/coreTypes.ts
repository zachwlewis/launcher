/** Shared Argument Properties */
interface Arg {
  /** Display name. */
  name: string;
  /** Text prepended to the argument. */
  pre?: string;
  /** Text appended to the argument. */
  post?: string;
  /** Additional information about the argument. */
  tooltip?: string;
}

/** String Argument */
export interface StringArg extends Arg {
  type: 'string';
  value: string;
  /** A list of values that cause the entire argument to be ignored. */
  ignored?: Array<string | RegExp>;
}

/** Boolean Argument */
export interface BooleanArg extends Arg {
  type: 'boolean';
  value: boolean;
  true: string;
  false: string;
}

/** Number Argument */
export interface NumberArg extends Arg {
  type: 'number';
  value: number;
  minimum?: number;
  maximum?: number;
  step?: number;
  radix?: number;
  /** A list of values that cause the entire argument to be ignored. */
  ignored?: Array<number>;
}

type Option = {
  name: string;
  value: string;
};

/** Option Argument */
export interface OptionArg extends Arg {
  type: 'option';
  value: string;
  options: Option[];
}

export type AnyArg = StringArg | BooleanArg | NumberArg | OptionArg;

export type App = {
  /** Application display name. */
  name: string;
  /** Executable path. */
  path: string;
};

export type AppDefinition = {
  app: App;
  args: AnyArg[];
};

/** Error levels */
export enum ErrorLevel {
  /** No error. */
  Info,
  /** Unexpected result, but not fatal. */
  Warn,
  /** Fatal error. */
  Error,
}
