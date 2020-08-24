import React, { FunctionComponent, Component, ChangeEvent } from 'react'
import { LA } from '../launcher-core/la'
import { AArg } from '../launcher-core/aarg'

type BooleanArgumentItemProps = {
	id: string;
	arg: AArg;
	value: string;
	onValueChange: (value: string) => void;
}

export const BooleanArgumentItem: FunctionComponent<BooleanArgumentItemProps> = ({ id, arg, value, onValueChange }) => {
	let content: JSX.Element;
	if (arg.options.length !== 2) {
		return (
			<li className="error">[{arg.name}] ArgError: Incorrect number of options. (Expected 2, found {arg.options.length}.)</li>
		);
	}

	return (
		<li>  
			<input
				id={id}
				type="checkbox"
				checked={value === arg.options[1]}
				ref={el => el && (el.indeterminate = !arg.options.includes(value))}
				onChange={(event) => {
					onValueChange(arg.options[event.target.checked === true ? 1: 0]);}}
			/>
			<label htmlFor={id} title={arg.name}>{arg.name} <i>Peek</i></label>
		</li>
		
	);
}