enum LaunchArgType {
    LAT_String = "string",
    LAT_Boolean = "boolean",
    LAT_Number = "number",
}

enum LaunchArgDisplay {
    LAT_Shown = "default",
    LAT_Hidden = "hidden",
    LAT_Const = "const",
}

export type LaunchArgValue =  string | boolean | number;

export interface LaunchArgProps {
    name: string;
    type: LaunchArgType | string;
    default?: LaunchArgValue;
    display?: LaunchArgDisplay | string;
    pre?: string;
    post?: string;
    ignoreIfMatches?: LaunchArgValue | LaunchArgValue[];
    tooltip?: string;
}

type LaunchArgStringProps = LaunchArgProps;

interface LaunchArgBooleanProps extends LaunchArgProps {
    values?: string[];
}

interface LaunchArgNumberProps extends LaunchArgProps {
    range?: [number, number];
    step?: number;
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

const LaunchArgStringDefaults: LaunchArgStringProps = {
    name: 'String Argument',
    type: LaunchArgType.LAT_String,
    default: '',
    display: LaunchArgDisplay.LAT_Shown,
    pre: '',
    post: '',
    tooltip: '',
}

const LaunchArgBooleanDefaults: LaunchArgBooleanProps = {
    name: 'Boolean Argument',
    type: LaunchArgType.LAT_Boolean,
    default: false,
    display: LaunchArgDisplay.LAT_Shown,
    pre: '',
    post: '',
    values: ['false', 'true'],
    tooltip: '',
}

const LaunchArgNumberDefaults: LaunchArgNumberProps = {
    name: 'Numeric Argument',
    type: LaunchArgType.LAT_Number,
    default: '',
    display: LaunchArgDisplay.LAT_Shown,
    pre: '',
    post: '',
    range: null,
    step: null,
    tooltip: '',
}

export function constructLaunchArg(props: LaunchArgProps, value?: LaunchArgValue): LaunchArg {
    if (props.type == LaunchArgType.LAT_String)
        return new LaunchArgString({...LaunchArgStringDefaults, ...props}, value);
    if (props.type == LaunchArgType.LAT_Boolean)
        return new LaunchArgBoolean({...LaunchArgBooleanDefaults, ...props}, value);
    if (props.type == LaunchArgType.LAT_Number)
        return new LaunchArgNumber({...LaunchArgNumberDefaults, ...props}, value);
    return null;
}