import React, { FunctionComponent, Component, ChangeEvent } from 'react';
import * as CT from '../launcher-core/coreTypes';

type BooleanArgumentItemProps = {
  id: string;
  definition: CT.BooleanArg;
  state: CT.BooleanArgState;
  onValueChange: (value: CT.BooleanArgState) => void;
};

export const BooleanArgumentItem = (props: BooleanArgumentItemProps) => (
  <input
    id={props.id}
    type="checkbox"
    checked={props.state.value}
    onChange={(event) => {
      props.onValueChange({ type: 'boolean', value: event.target.checked });
    }}
  />
);
