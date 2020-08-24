/** Application Argument Properties */
export type AArgProps = {
	name: string;
	type: string;
	value: string;
	pre?: string;
	post?: string;
	options?: string[];
	optionNames?: string[];
}

export type AArgState = {
	value: string;
}

/** Application Argument */
export class AArg {
	private props: AArgProps;
	private state: AArgState;
	constructor(props: AArgProps, state?: AArgState) {
		this.props = props;
		this.state = state || {value: props.value};
	}

	/** The display name of the argument. */
	get name(): string { return this.props.name; }

	/** The type of the argument. */
	get type(): string { return this.props.type; }

	get value(): string { return this.state.value; }
	set value(s: string) { this.state.value = s; }

	/* The text to display before the argument value. */
	get pre(): string { return this.props.pre || ''; }

	/* The text to display after the argument value. */
	get post(): string { return this.props.post || ''; }

	get options(): string[] { return this.props.options || []; }

	toString(value?: string): string {
		return `${this.pre}${value || this.value}${this.post}`;
	}
}