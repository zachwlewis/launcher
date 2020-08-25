import React, {FunctionComponent, Component, ChangeEvent} from 'react'
import {LA} from '../launcher-core/la'
import {AArg} from '../launcher-core/aarg'
import * as AT from '../launcher-core/argTypes'

type StringArgumentItemProps = {
		id: string;
		definition: AT.StringArg;
		value: string;
    onValueChange: (value: string) => void;
}

export const StringArgumentItem: FunctionComponent<StringArgumentItemProps> = ({id, definition, value, onValueChange}) =>
<li>
	<label htmlFor={id} title={definition.name}>{definition.name} <i>Peek</i></label>
	<input id={id} type="text" value={value} onChange={(event) => onValueChange(event.target.value)}></input>
</li>