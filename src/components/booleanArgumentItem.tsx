import React, { FunctionComponent, Component, ChangeEvent } from 'react'
import * as AT from '../launcher-core/coreTypes'

type BooleanArgumentItemProps = {
	id: string;
	definition: AT.BooleanArg;
	value: boolean;
	onValueChange: (value: boolean) => void;
}

export const BooleanArgumentItem = (props: BooleanArgumentItemProps) =>
	<input
		id={props.id}
		type="checkbox"
		checked={props.value}
		onChange={(event) => { props.onValueChange(event.target.checked); }}
	/>
