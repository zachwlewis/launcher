import React, { FunctionComponent, Component, ChangeEvent } from 'react'
import * as AT from '../launcher-core/coreTypes'

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
			<select id={id} value={value} onChange={handleChange}>
				{options}
			</select>
	);
}