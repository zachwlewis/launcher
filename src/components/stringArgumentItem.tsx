import React, { FunctionComponent, Component, ChangeEvent } from 'react';
import * as AT from '../launcher-core/coreTypes';

type StringArgumentItemProps = {
  id: string;
  definition: AT.StringArg;
  value: string;
  onValueChange: (value: string) => void;
};

export const StringArgumentItem: FunctionComponent<StringArgumentItemProps> = ({
  id,
  definition,
  value,
  onValueChange,
}) => (
  <input
    id={id}
    type="text"
    value={value}
    onChange={(event) => onValueChange(event.target.value)}
  ></input>
);
