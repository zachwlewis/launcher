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

  /** The visibility of the argument. */
  display?: 'visible' | 'hidden' | 'readonly';
}

/** String Argument */
export interface StringArg extends Arg {
  type: 'string';

  /** The default value of the argument. */
  default?: string;
  /** A list of values that cause the entire argument to be ignored. */
  ignored?: string[];
}

/** Boolean Argument */
export interface BooleanArg extends Arg {
  type: 'boolean';

  /** The default value of the argument. */
  default?: boolean;
  true: string;
  false: string;
}

/** Number Argument */
export interface NumberArg extends Arg {
  type: 'number';

  /** The default value of the argument. */
  default?: number;
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

  /** The default value of the argument. */
  default?: string;
  options: Option[];
}

export type AnyArg = StringArg | BooleanArg | NumberArg | OptionArg;
