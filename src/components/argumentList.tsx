import React, { Component, FunctionComponent, ChangeEvent } from 'react'
import { LA } from '../launcher-core/la'
import { AArg, AArgState } from '../launcher-core/aarg'
import { StringArgumentItem } from './stringArgumentItem';
import { BooleanArgumentItem } from './booleanArgumentItem';
import { IntArgumentItem } from './intArgumentItem';
import { OptionArgumentItem } from './optionArgumentItem';
import * as AT from '../launcher-core/argTypes'

import './argumentList.css'

type ApplicationListProps = {
	definitions: AT.AnyArg[];
	values: (string|number|boolean)[];
	onArgChange: (value: string|number|boolean, index: number) => void;
};

export class ArgumentList extends Component<ApplicationListProps> {

	constructor(props: ApplicationListProps) {
		super(props);
	}

	buildStringArgumentItem(arg: AT.StringArg, index: number): JSX.Element { return (
		<StringArgumentItem
				definition={arg}
				key={index}
				value={this.props.values[index] as string || ''}
				id={`arg${index}`}
				onValueChange={(value) => this.props.onArgChange(value, index)}
		/>
	);}

	buildBooleanArgumentItem(arg: AT.BooleanArg, index: number): JSX.Element { return (
		<BooleanArgumentItem
				definition={arg}
				key={index}
				value={this.props.values[index] as boolean || false}
				id={`arg${index}`}
				onValueChange={(value) => this.props.onArgChange(value, index)}
		/>
	);}

	buildIntArgumentItem(arg: AT.NumberArg, index: number): JSX.Element { return (
		<IntArgumentItem
				definition={arg}
				key={index}
				value={this.props.values[index] as number || 0}
				id={`arg${index}`}
				onValueChange={(value) => this.props.onArgChange(value, index)}
		/>
	);}

	buildOptionArgumentItem(arg: AT.OptionArg, index: number): JSX.Element { return (
		<OptionArgumentItem
				definition={arg}
				key={index}
				value={this.props.values[index] as string || ''}
				id={`arg${index}`}
				onValueChange={(value) => this.props.onArgChange(value, index)}
		/>
	);}

	makeArgumentItem(arg: AT.AnyArg, index: number): JSX.Element {
		switch (arg.type) {
			case 'string': return this.buildStringArgumentItem(arg, index);
			case 'number': return this.buildIntArgumentItem(arg, index);
			case 'boolean': return this.buildBooleanArgumentItem(arg, index);
			case 'option': return this.buildOptionArgumentItem(arg, index);
		}
		//return <li key={index} className="error">[{arg.name}] ArgError: Type "{arg.type}" is invalid.</li>
	}

	render() {

		const listItems = this.props.definitions.map((arg, index) => this.makeArgumentItem(arg, index));

		return (
			<ol className="argument-list">{listItems}</ol>
		);
	}
}

/*
<ol>
	<li>
		<label htmlFor="arg1" title="Argument One Tooltip">String Argument <i>Peek</i></label>
		<input id="arg1" type="text" value="string_value"></input>
	</li>
	<li>
		<input id="arg2" type="checkbox"></input>
		<label htmlFor="arg2" title="Argument Two Tooltip">Boolean Argument <i>Peek</i></label>
	</li>
	<li>
		<label htmlFor="arg3" title="Argument Three Tooltip">Number Argument <i>Peek</i></label>
		<input id="arg3" type="number" value="420"></input>
	</li>
	<li>
		<label htmlFor="arg4" title="Argument Four Tooltip">Dropdown Argument <i>Peek</i></label>
		<select id="arg4">
			<option value="option1">Option 1</option>
			<option value="option2">Option 2</option>
			<option value="option3">Option 3</option>
		</select>
	</li>
	<li>
		<i>Peek</i>
		<input type="radio" id="arg4_option1" name="arg5" value="option1"></input>
		<label htmlFor="arg5_option1" title="Argument Five Tooltip 1">Option 1</label>
		<input type="radio" id="arg4_option2" name="arg5" value="option2"></input>
		<label htmlFor="arg5_option2" title="Argument Five Tooltip 2">Option 2</label>
		<input type="radio" id="arg4_option3" name="arg5" value="option3"></input>
		<label htmlFor="arg5_option3" title="Argument Five Tooltip 3">Option 3</label>
	</li>
</ol>
*/
