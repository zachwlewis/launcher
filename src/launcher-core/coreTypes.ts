import { AnyArg } from './args';
export * from './args';
export * from './argStates';

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
