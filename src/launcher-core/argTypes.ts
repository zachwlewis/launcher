/** Shared Argument Properties */
interface Arg {
  /** Display name. */
	name: string;
  /** Text prepended to the argument. */
  pre?: string;
  /** Text appended to the argument. */
	post?: string;
}

/** String Argument */
export interface StringArg extends Arg {
  type: 'string';
  value: string;
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
}

type Option = {
  name: string;
  value: string;
}

/** Option Argument */
export interface OptionArg extends Arg {
  type: 'option';
  value: string;
  options: Option[];
}

export type AnyArg = StringArg | BooleanArg | NumberArg | OptionArg;
