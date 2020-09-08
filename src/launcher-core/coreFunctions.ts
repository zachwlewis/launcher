import * as CT from './coreTypes';
import * as fs from 'fs';

type LoadResponse = {
  value: CT.AppDefinition[] | null;
  message: string;
  error: CT.ErrorLevel;
};

export function loadDefinitions(path: string): LoadResponse {
  if (!fs.existsSync(path)) {
    return {
      value: null,
      message: `No definitions found at ${path}.`,
      error: CT.ErrorLevel.Warn,
    };
  }

  const raw_definitions: any = JSON.parse(fs.readFileSync(path).toString());

  const definitions: CT.AppDefinition[] = raw_definitions.definitions || [];

  return {
    value: definitions,
    message: `${definitions.length} definitions loaded from ${path}.`,
    error: CT.ErrorLevel.Info,
  };
}
