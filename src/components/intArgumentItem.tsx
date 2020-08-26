import React, { FunctionComponent, Component, ChangeEvent } from 'react';
import * as AT from '../launcher-core/coreTypes';

type IntArgumentItemProps = {
  id: string;
  definition: AT.NumberArg;
  value: number;
  onValueChange: (value: number) => void;
};

export const IntArgumentItem = (props: IntArgumentItemProps) => (
  <input
    id={props.id}
    type="number"
    value={props.value}
    onChange={(event) => props.onValueChange(parseInt(event.target.value, 10))}
  />
);
