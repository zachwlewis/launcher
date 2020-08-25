import React, { FunctionComponent, Component, ChangeEvent } from 'react'
import { LA } from '../launcher-core/la'
import { AArg } from '../launcher-core/aarg'
import * as AT from '../launcher-core/argTypes'

type BooleanArgumentItemProps = {
	id: string;
	definition: AT.BooleanArg;
	value: boolean;
	onValueChange: (value: boolean) => void;
}

export const BooleanArgumentItem: FunctionComponent<BooleanArgumentItemProps> = ({ id, definition, value, onValueChange }) => {
	let content: JSX.Element;
	return (
		<li>  
			<input
				id={id}
				type="checkbox"
				checked={value}
				onChange={(event) => {
					onValueChange(event.target.checked);}}
			/>
			<label htmlFor={id} title={definition.name}>{definition.name} <i>Peek</i></label>
		</li>
		
	);
}