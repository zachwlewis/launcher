import React, { Component, FunctionComponent } from 'react';
import ReactDOM from 'react-dom';

import { Console } from './components/console';
import { ApplicationList } from './components/applicationList'
import { ArgumentList } from './components/argumentList'

import { LA, LAProps } from './launcher-core/la'
import { AArgProps, AArgState } from './launcher-core/aarg'

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
	args: AArgProps[];
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
				type: 'bool',
				value: '',
				pre: '--arg1.3=',
				options: ['false', 'true']
			}
		]
	},
	{
		la: { name: 'App Two', path: '/path/two' },
		args: [
			{
				name: 'Arg 2.1',
				type: 'int',
				value: '',
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
				type: 'bool',
				value: '',
				pre: '--arg2.3=',
				options: ['false', 'true']
			}
		]
	},
	{
		la: { name: 'App Three', path: '/path/three' },
		args: [
			{
				name: 'Arg 3.1',
				type: 'bool',
				value: '',
				pre: '--arg3.1=',
				options: ['false', 'true']
			},
			{
				name: 'Arg 3.2',
				type: 'int',
				value: '',
				pre: '--arg3.2='
			},
			{
				name: 'Arg 3.3',
				type: 'bool',
				value: '',
				pre: '--arg3.3=',
				options: ['false', 'true']
			}
		]
	},
]

const applications: LA[] = appProps.map((props) => new LA(props.la, props.args));

type LauncherProps = {
	apps: LA[];
}

type LauncherState = {
	selected: number;
	apps: {
		selected: boolean;
	}[]
	args: {
		value: string;
	}[][];
}

class Launcher extends Component<LauncherProps, LauncherState> {
	constructor(props: LauncherProps) {
		super(props);
		// Apps Definition
		const appState = props.apps.map((app, index) => {return { selected: index===0 }});
		const argState = props.apps.map((app) => app.args.map((arg) => {return { value: arg.value }}));
		let v: AArgState[] = props.apps[0].args.map<AArgState>((arg) => {return {value: arg.value};});
		this.state = { selected: 0, apps: appState, args: argState };
	}

	handleApplicationSelection(index: number): void {
		const appState = this.props.apps.map((app, idx) => {return { selected: idx===index }});
		this.setState({ selected: index, apps: appState });
	}

	handleArgChange(value: string, index: number): void {
		let s = this.state.args;
		s[this.state.selected][index].value = value;
		this.setState({args: s});
	}

	get selectedApp(): LA { return this.props.apps[this.state.selected]; }
	get selectedArgs(): {value: string}[] {
		return this.state.args[this.state.selected];
	}

	render() {
		const argValues: string[] = this.selectedArgs.map((state) => state.value);
		return (
			<div>
				<ApplicationList
					apps={this.props.apps}
					selected={this.state.selected}
					onApplicationSelected={(index) => { this.handleApplicationSelection(index); }}
				/>
				<section>
					<nav>
						<h1>{this.selectedApp.name}</h1>
						<button>Launch</button>
					</nav>
					<ArgumentList
						args={this.selectedApp.args}
						values={argValues}
						onArgChange={(value, index) => this.handleArgChange(value, index)}
					/>
				</section>
				<Console args={this.selectedApp.toStringArray(this.selectedArgs)} selected={-1} expanded={false} />
			</div>
		);
	}
}

ReactDOM.render(
	<Launcher apps={applications} />, document.getElementById('root')
);
