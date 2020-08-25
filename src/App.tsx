import { ipcRenderer } from 'electron';

import React, { Component, FunctionComponent } from 'react';
import ReactDOM from 'react-dom';

import { Console } from './components/console';
import { ApplicationList } from './components/applicationList'
import { ArgumentList } from './components/argumentList'

import { LA, LAProps } from './launcher-core/la'
import { AArgProps, AArgState } from './launcher-core/aarg'
import * as AT from './launcher-core/argTypes'

import './App.css'

type Applications = Array<{
	name: string;
	args: Array<{
		name: string;
		type: string;
	}>;
}>;

/** Launch Application Definition */
type LAD = {
	la: LAProps;
	args: AT.AnyArg[];
}

const appProps: LAD[] = [
	{
		la: { name: 'App One', path: '/path/one' },
		args: [
			{
				name: 'Arg 1.1',
				type: 'string',
				value: '',
				pre: '--arg1.1='
			},
			{
				name: 'Arg 1.2',
				type: 'string',
				value: '',
				pre: '--arg1.2='

			},
			{
				name: 'Arg 1.3',
				type: 'boolean',
				value: false,
				pre: '--arg1.3=',
				true: 'true',
				false: 'false',
			}
		]
	},
	{
		la: { name: 'App Two', path: '/path/two' },
		args: [
			{
				name: 'Arg 2.1',
				type: 'number',
				value: 0,
				pre: '--arg2.1='
			},
			{
				name: 'Arg 2.2',
				type: 'string',
				value: '',
				pre: '--arg2.2='
			},
			{
				name: 'Arg 2.3',
				type: 'boolean',
				value: true,
				pre: '--arg2.3=',
				true: 'high',
				false: 'low'
			}
		]
	},
	{
		la: { name: 'App Three', path: '/path/three' },
		args: [
			{
				name: 'Arg 3.1',
				type: 'option',
				value: '',
				pre: '--arg3.1=',
				options: [
					{name: 'Option 1', value: 'value1'},
					{name: 'Option 2', value: 'value2'},
					{name: 'Option 3', value: 'value3'},
					{name: 'Option 4', value: 'She said "hey."'},
				]
			},
			{
				name: 'Arg 3.2',
				type: 'number',
				value: 420,
				pre: '--arg3.2=',
				radix: 16
			},
			{
				name: 'Arg 3.3',
				type: 'boolean',
				value: true,
				pre: '--arg3.3=',
				true: 'white',
				false: 'black'
			}
		]
	},
]

type LauncherProps = {
	apps: LAD[];
}

type LauncherState = {
	readonly defs: LAD[];
	selected: number;
	apps: {
		selected: boolean;
		values: Array<string|boolean|number>;
	}[]
}

class Launcher extends Component<LauncherProps, LauncherState> {
	constructor(props: LauncherProps) {
		super(props);
		// Apps Definition
		const appState = props.apps.map((app, index) => {
			return {
				selected: index === 0,
				values: app.args.map((arg) => arg.value)
		}});
		this.state = {
			defs:props.apps,
			selected: 0,
			apps: appState
		};
	}

	handleApplicationSelection(index: number): void {
		const s = this.state.apps.map((app, idx) => {
			return {
				selected: idx === index,
				values: app.values
		}});

		this.setState({ selected: index, apps: s });
	}

	handleArgChange(value: string|boolean|number, index: number): void {
		let s = this.state.apps;
		s[this.state.selected].values[index] = value;
		this.setState({apps: s});
	}

	handleLaunchClick(): void {
		const output = this.selectedOutput;
		ipcRenderer.send('launch', output);
	}

	get selectedApp(): LAD { return this.props.apps[this.state.selected]; }
	get selectedArgs(): (string|boolean|number)[] {
		return this.state.apps[this.state.selected].values;
	}

	get selectedOutput(): Array<string> {
		const values = this.selectedArgs;
		const args = this.selectedApp.args.map((arg, index) => {
			let svalue = '';
			switch(arg.type) {
				case 'string':
					svalue = values[index] as string || arg.value;
					break;
				case 'number':
					svalue = (values[index] as number||arg.value).toString(arg.radix||10);
					break;
				case 'boolean':
					svalue = (values[index] as boolean) ? arg.true : arg.false;
					break;
				case 'option':
					svalue = (values[index] as string||arg.value);
					break;
			}

			return `${arg.pre||''}${svalue}${arg.post||''}`;
		});

		return [this.selectedApp.la.path].concat(args);
	}

	render() {
		const appDefs = this.props.apps.map<LAProps>((app) => app.la);
		return (
			<div>
				<ApplicationList
					definitions={appDefs}
					selected={this.state.selected}
					onApplicationSelected={(index) => { this.handleApplicationSelection(index); }}
				/>
				<section>
					<nav>
						<h1>{this.selectedApp.la.name}</h1>
						<button onClick={() => this.handleLaunchClick()}>Launch</button>
					</nav>
					<ArgumentList
						definitions={this.selectedApp.args}
						values={this.selectedArgs}
						onArgChange={(value, index) => this.handleArgChange(value, index)}
					/>
				</section>
				<Console args={this.selectedOutput} selected={-1} expanded={false} />
			</div>
		);
	}
}

ReactDOM.render(
	<Launcher apps={appProps} />, document.getElementById('root')
);
