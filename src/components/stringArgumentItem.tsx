import React, {FunctionComponent, Component, ChangeEvent} from 'react'
import {LA} from '../launcher-core/la'
import {AArg} from '../launcher-core/aarg'

type StringArgumentItemProps = {
		id: string;
		arg: AArg;
		value: string;
    onValueChange: (value: string) => void;
}

export const StringArgumentItem: FunctionComponent<StringArgumentItemProps> = ({id, arg, value, onValueChange}) =>
<li>
	<label htmlFor={id} title={arg.name}>{arg.name} <i>Peek</i></label>
	<input id={id} type="text" value={value} onChange={(event) => onValueChange(event.target.value)}></input>
</li>