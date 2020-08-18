
import { LaunchArg, LaunchArgProps, LaunchArgValue, constructLaunchArg } from './launchArg';

interface LaunchAppProps {
    name: string;
    executablePath: string;
}

export class LaunchApp {
    protected _args: LaunchArg[];
    protected _props: LaunchAppProps;
    constructor(props: LaunchAppProps, args?: LaunchArg[]) {
        this._props = props;
        if (args == null) {
            this._args = [];
        } else {
            this._args = args;
        }
        
    }

    get args(): LaunchArg[] { return this._args; }
    get props(): LaunchAppProps { return this._props; }

    get name(): string { return this._props.name; }
    get path(): string { return this._props.executablePath; }

    debugPrint(): void {
        console.log(`Launch Application: ${this._props.name}`);
        let argIndex = 0;
        console.log(`[${argIndex++}] ${this._props.executablePath}`);

        for (const ar of this._args)
        {
            console.log(`[${argIndex++}] ${ar.name}: ${ar.toString()}`);
        }

        console.log(this.argArray);

        console.log("Launch String:", this.argString);
    }

    /**
     * An array of arguments, with the executable path as arg[0].
     */
    get argArray(): string[] {
        let value: string[] = [this._props.executablePath];
        for (const ar of this._args) {
            value.push(ar.shouldIgnore ? "" : ar.toString());
        }
        return value;
    }

    get argString(): string {
        let value = "";
        for (const s of this.argArray) {
            value += ` ${s}`.trim();
        }
        return value;
    }

    addLaunchArg(argProps: LaunchArgProps, value?: LaunchArgValue): void {
        this._args.push(constructLaunchArg(argProps, value));
    }
}