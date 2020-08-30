import { AnyArg } from './args';

export interface StringArgState {
  type: 'string';
  value: string;
}

export interface BooleanArgState {
  type: 'boolean';
  value: boolean;
}

export interface NumberArgState {
  type: 'number';
  value: number;
}

export interface OptionArgState {
  type: 'option';
  value: string;
}

export type AnyArgState =
  | StringArgState
  | BooleanArgState
  | NumberArgState
  | OptionArgState;

export function createStateFor(arg: AnyArg): AnyArgState {
  let stateValue: any;
  switch (arg.type) {
    case 'string':
      stateValue = arg.default === undefined ? '' : arg.default;
      break;
    case 'boolean':
      stateValue = arg.default === undefined ? false : arg.default;
      break;
    case 'number':
      stateValue = arg.default === undefined ? 0 : arg.default;
      break;
    case 'option':
      stateValue =
        arg.default === undefined ? arg.options[0].value : arg.default;
      break;
  }

  return { type: arg.type, value: stateValue };
}
