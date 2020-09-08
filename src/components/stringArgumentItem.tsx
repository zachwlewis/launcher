import React, { FunctionComponent, Component, ChangeEvent } from 'react';
import * as CT from '../launcher-core/coreTypes';

type StringArgumentItemProps = {
  id: string;
  definition: CT.StringArg;
  state: CT.StringArgState;
  onValueChange: (value: CT.StringArgState) => void;
};

export const StringArgumentItem: FunctionComponent<StringArgumentItemProps> = ({
  id,
  definition,
  state,
  onValueChange,
}) => (
  <input
    id={id}
    type="text"
    value={state.value}
    onChange={(event) =>
      onValueChange({ type: 'string', value: event.target.value })
    }
    disabled={definition.display === 'readonly'}
  ></input>
);
