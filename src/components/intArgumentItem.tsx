import React, {FunctionComponent, Component, ChangeEvent} from 'react'
import {LA} from '../launcher-core/la'
import {AArg} from '../launcher-core/aarg'
import * as AT from '../launcher-core/argTypes'

type IntArgumentItemProps = {
		id: string;
		definition: AT.NumberArg;
		value: number;
		onValueChange: (value: number) => void;
}

export const IntArgumentItem: FunctionComponent<IntArgumentItemProps> = ({id, definition, value, onValueChange}) =>
<li>
	<label htmlFor={id} title={definition.name}>{definition.name} <i>Peek</i></label>
	<input
	id={id}
	type="number"
	value={value}
	onChange={(event) => onValueChange(parseInt(event.target.value, 10))} />
</li>