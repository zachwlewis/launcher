import React, { FunctionComponent, Component, ChangeEvent } from 'react';
import * as CT from '../launcher-core/coreTypes';

type NumberArgumentItemProps = {
  id: string;
  definition: CT.NumberArg;
  state: CT.NumberArgState;
  onValueChange: (value: CT.NumberArgState) => void;
};

export const NumberArgumentItem = (props: NumberArgumentItemProps) => {
  function handleValueChange(value: string) {
    let n = parseFloat(value);
    if (props.definition.minimum !== undefined)
      n = Math.max(n, props.definition.minimum);
    if (props.definition.maximum !== undefined)
      n = Math.min(n, props.definition.maximum);
    props.onValueChange({ type: 'number', value: n });
  }

  return (
    <input
      id={props.id}
      type="number"
      value={props.state.value}
      step={props.definition.step}
      min={props.definition.minimum}
      max={props.definition.maximum}
      onChange={(event) => handleValueChange(event.target.value)}
      disabled={props.definition.display === 'readonly'}
    />
  );
};
