import { AArg, AArgProps } from './aarg'
import { app } from 'electron';

/** Launchable Application Properties */
export type LAProps = {
	name: string;
	path: string;
}

/** Launchable Application */
export class LA {
	private props: LAProps;
	private _args: AArg[];

	constructor(props: LAProps, args: AArgProps[]) {
		this.props = props;
		this._args = args.map((arg) => new AArg(arg));
	}


	get name(): string { return this.props.name; }

	get args(): AArg[] { return this._args; }

	toStringArray(values?: { value: string }[]): string[] {
		// The application path is always the first argument.
		// #TODO: Support launching inside a console.
		let sa = [this.props.path];

		let ar: string[] = [];
		// If no values were passed in, use the default values.
		if (values === undefined) ar = this.args.map((arg) => arg.toString());
		// If values were passed in, use them instead of the defaults.
		else {
			if (values.length !== this.args.length)
				ar.push(`Argument mismatch. Expected ${this.args.length}, provided ${values.length}.`);
			else {
				ar = this.args.map((arg, index) => arg.toString(values[index].value));
			}
		}

		return sa.concat(ar);
	}
}
