import React, { FunctionComponent } from 'react';
import * as AT from '../launcher-core/coreTypes';

type ArgumentLabelProps = {
  for: string;
  definition: AT.AnyArg;
  onStartPeek: () => void;
  onEndPeek: () => void;
};

export const ArgumentLabel = (props: ArgumentLabelProps) => (
  <label htmlFor={props.for} title={props.definition.tooltip || ''}>
    {props.definition.name}{' '}
    <i onMouseEnter={props.onStartPeek} onMouseLeave={props.onEndPeek}>
      Peek
    </i>
  </label>
);
