import React, {FunctionComponent, Component, ChangeEvent} from 'react'
import {LA} from '../launcher-core/la'
import {AArg} from '../launcher-core/aarg'

type IntArgumentItemProps = {
		id: string;
		arg: AArg;
		value: string;
    onValueChange: (value: string) => void;
}

export const IntArgumentItem: FunctionComponent<IntArgumentItemProps> = ({id, arg, value, onValueChange}) =>
<li>
	<label htmlFor={id} title={arg.name}>{arg.name} <i>Peek</i></label>
	<input
    id={id}
    type="number"
    value={value}
    onChange={(event) => onValueChange(event.target.value)} />
</li>