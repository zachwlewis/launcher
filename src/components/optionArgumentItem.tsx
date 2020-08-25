import React, { FunctionComponent, Component, ChangeEvent } from 'react'
import * as AT from '../launcher-core/argTypes'

type OptionArgumentItemProps = {
	id: string;
	definition: AT.OptionArg;
	value: string;
	onValueChange: (value: string) => void;
}

export const OptionArgumentItem: FunctionComponent<OptionArgumentItemProps> = ({ id, definition, value, onValueChange }) => {
  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    onValueChange(event.target.value);
  }
  const options = definition.options.map((option) => <option key={option.value} value={option.value}>{option.name}</option>);
	return (
		<li>
      <label htmlFor={id} title={definition.name}>{definition.name} <i>Peek</i></label>
			<select id={id} value={value} onChange={handleChange}>
        {options}
      </select>
		</li>
		
	);
}