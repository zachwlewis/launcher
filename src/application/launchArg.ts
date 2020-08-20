/** The type of the argument. */
export enum LaunchArgType {
    String = "string",
    Boolean = "boolean",
    Number = "number",
    Option = "option",
}

/** The way the argument should be displayed. */
export enum LaunchArgDisplay {
    Default = "default",
    Hidden = "hidden",
    Constant = "const",
}

export type LaunchArgValue =  string | boolean | number;

export interface LaunchArgProps {
    /** Display Name */
    name: string;
    /** Argument Type */
    type: LaunchArgType;
    /** Default Value */
    default?: LaunchArgValue;
    /** Display Type */
    display?: LaunchArgDisplay;
    /** Text to prepend to the value. */
    pre?: string;
    /** Text to append to the value. */
    post?: string;
    /** Ignore the argument if the value matches. */
    ignoreIfMatches?: LaunchArgValue | LaunchArgValue[];
    /** Additional information about the argument. */
    tooltip?: string;
}

type LaunchArgStringProps = LaunchArgProps;

interface LaunchArgBooleanProps extends LaunchArgProps {
    /** Values when false and true. */
    values?: [string, string];
}

interface LaunchArgNumberProps extends LaunchArgProps {
    /** Minimum and maximum values of the number. */
    range?: [number, number];
    /** Amount to increment the value. */
    step?: number;
}

export interface LaunchArgOptionProps extends LaunchArgProps {
    options?: [string, string][];
}


/**
 * Represents a launch argument.
 */
export abstract class LaunchArg {
    protected _props: LaunchArgProps;
    protected _value: LaunchArgValue;

    constructor(def: LaunchArgProps, value?: LaunchArgValue) {
        this._props = def;
        if (value == null) {
            this._value = def.default;
        } else {
            this._value = value;
        }
    }
    /** The props defining the argument. Used for storage. */
    get props(): LaunchArgProps { return this._props; }
    
    /** The human-readable name of the argument. */
    get name(): string { return this._props.name; }
    
    /** The current value of the argument. */
    get value(): LaunchArgValue { return this._value; }
    set value(value: LaunchArgValue) { this._value = value; }

    get type(): LaunchArgType | string { return this._props.type; }
    get display(): LaunchArgDisplay | string { return this._props.display; }

    /** The tooltip to display when hovering over the argument. */
    get tooltip(): string { return this._props.tooltip; }

    /** Does the argument have a tooltip to display? */
    get hasTooltip(): boolean { return this.tooltip !== undefined && this.tooltip.length > 0; }

    /** The type to use for the argument's \<input\>. */
    get inputType(): string { return ""; };

    get pre(): string { return `${this._props.pre != null ? this._props.pre : ''}`; }
    get post(): string { return `${this._props.post != null ? this._props.post : ''}`; }
    /** The current value of the argument represented as a string. */
    get stringValue(): string { return "Invalid"; }
    /** The argument string to be sent to the process. */
    toString(): string { return `${this.pre}${this.stringValue}${this.post}`; };

    get shouldIgnore(): boolean {
        // The argument should be ignored if its empty.
        if (this.toString().length == 0) return true;

        // If ignoreIfMatches isn't defined, don't ignore it.
        if (this.props.ignoreIfMatches === undefined) return false;

        let matches: LaunchArgValue[] = [];
        matches = matches.concat(this.props.ignoreIfMatches);

        return matches.includes(this.value);
    }
}

class LaunchArgString extends LaunchArg {
    get inputType(): string { return 'text'; }
    get stringValue(): string { return (this.value as string); }
}

class LaunchArgBoolean extends LaunchArg {
    get inputType(): string { return 'checkbox'; }
    get stringValue(): string { return (this._props as LaunchArgBooleanProps).values[(this.value as boolean) ? 1 : 0]; }
}

class LaunchArgNumber extends LaunchArg {
    get inputType(): string { return 'number'; }
    get stringValue(): string { return (this.value as string); }
    get value(): LaunchArgValue { return (this._value as number); }
    set value(value: LaunchArgValue) {
        if (typeof value === "string") this._value = parseFloat(value);
        else if (typeof value === "number") this._value = value;
        else if (typeof value === "boolean") this._value = value ? 1 : 0;

        if (typeof this._value !== "number" || isNaN(this._value)) {
            this._value = this._props.default;
        }
    }
}

export class LaunchArgOption extends LaunchArg {
    get inputType(): string { return 'select'; }
    get value(): LaunchArgValue { return this._value as number; }
    get stringValue(): string {
        return (this.props as LaunchArgOptionProps).options[this._value as number][1];
    }
    set value(value: LaunchArgValue) {
        if (typeof value === "string") this._value = parseFloat(value);
        else if (typeof value === "number") this._value = value;
        else if (typeof value === "boolean") this._value = value ? 1 : 0;

        if (typeof this._value !== "number" || isNaN(this._value)) {
            this._value = this._props.default;
        }
    }
}

const LaunchArgStringDefaults: LaunchArgStringProps = {
    name: 'String Argument',
    type: LaunchArgType.String,
    default: '',
    display: LaunchArgDisplay.Default,
    pre: '',
    post: '',
    tooltip: '',
}

const LaunchArgBooleanDefaults: LaunchArgBooleanProps = {
    name: 'Boolean Argument',
    type: LaunchArgType.Boolean,
    default: false,
    display: LaunchArgDisplay.Default,
    pre: '',
    post: '',
    values: ['false', 'true'],
    tooltip: '',
}

const LaunchArgNumberDefaults: LaunchArgNumberProps = {
    name: 'Numeric Argument',
    type: LaunchArgType.Number,
    default: '',
    display: LaunchArgDisplay.Default,
    pre: '',
    post: '',
    range: null,
    step: null,
    tooltip: '',
}

const LaunchArgOptionDefaults: LaunchArgOptionProps = {
    name: 'Option Argument',
    type: LaunchArgType.Option,
    default: 0,
    display: LaunchArgDisplay.Default,
    pre: '',
    post: '',
    options: [["",""]],
    tooltip: '',
}

export function constructLaunchArg(props: LaunchArgProps, value?: LaunchArgValue): LaunchArg {
    console.log("Constructing arg:", props, value);
    if (props.type == LaunchArgType.String)
        return new LaunchArgString({...LaunchArgStringDefaults, ...props}, value);
    if (props.type == LaunchArgType.Boolean)
        return new LaunchArgBoolean({...LaunchArgBooleanDefaults, ...props}, value);
    if (props.type == LaunchArgType.Number)
        return new LaunchArgNumber({...LaunchArgNumberDefaults, ...props}, value);
    if (props.type === LaunchArgType.Option)
        return new LaunchArgOption({...LaunchArgOptionDefaults, ...props}, value);

    return null;
}