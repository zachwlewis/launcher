import React, { FunctionComponent, Component, ChangeEvent } from 'react';
import * as CT from '../launcher-core/coreTypes';

type OptionArgumentItemProps = {
  id: string;
  definition: CT.OptionArg;
  state: CT.OptionArgState;
  onValueChange: (value: CT.OptionArgState) => void;
};

export const OptionArgumentItem: FunctionComponent<OptionArgumentItemProps> = ({
  id,
  definition,
  state,
  onValueChange,
}) => {
  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    onValueChange({ type: 'option', value: event.target.value });
  }
  const options = definition.options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.name}
    </option>
  ));
  return (
    <select id={id} value={state.value} onChange={handleChange}>
      {options}
    </select>
  );
};
