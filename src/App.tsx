import { ipcRenderer } from 'electron';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Console } from './components/console';
import { ApplicationList } from './components/applicationList';
import { ArgumentList } from './components/argumentList';
import { Messages } from './components/messages';
import { DragArea } from './components/dragArea';

import * as CT from './launcher-core/coreTypes';

import './App.css';

const appProps: CT.AppDefinition[] = [
  {
    app: { name: 'App One', path: '/path/one' },
    args: [
      {
        name: 'Arg 1.1',
        type: 'string',
        value: '',
        pre: '--arg1.1=',
      },
      {
        name: 'Arg 1.2',
        type: 'string',
        value: '',
        pre: '--arg1.2=',
      },
      {
        name: 'Arg 1.3',
        type: 'boolean',
        value: false,
        pre: '--arg1.3=',
        true: 'true',
        false: 'false',
      },
    ],
  },
  {
    app: { name: 'App Two', path: '/path/two' },
    args: [
      {
        name: 'Arg 2.1',
        type: 'number',
        value: 0,
        pre: '--arg2.1=',
        ignored: [69, 420],
        tooltip: 'Ignored if the value is nice.',
      },
      {
        name: 'Arg 2.2',
        type: 'string',
        value: '',
        pre: '--arg2.2=',
        tooltip: `Ignored if the value is nice, starts with ice or repeats 'a' just twice.`,
        ignored: ['nice', /^ice/, /(?:^|[^a])aa(?!a)/],
      },
      {
        name: 'Arg 2.3',
        type: 'boolean',
        value: true,
        pre: '--arg2.3=',
        true: 'high',
        false: 'low',
      },
    ],
  },
  {
    app: { name: 'App Three', path: '/path/three' },
    args: [
      {
        name: 'Arg 3.1',
        type: 'option',
        value: '',
        pre: '--arg3.1=',
        options: [
          { name: 'Option 1', value: 'value1' },
          { name: 'Option 2', value: 'value2' },
          { name: 'Option 3', value: 'value3' },
          { name: 'Option 4', value: 'She said "hey."' },
        ],
      },
      {
        name: 'Arg 3.2',
        type: 'number',
        value: 420,
        pre: '--arg3.2=',
        radix: 16,
      },
      {
        name: 'Arg 3.3',
        type: 'boolean',
        value: true,
        pre: '--arg3.3=',
        true: 'white',
        false: 'black',
      },
    ],
  },
];

type MessageErrorLevel = 'info' | 'warning' | 'error';

type LauncherProps = {
  apps: CT.AppDefinition[];
};

type LauncherState = {
  readonly defs: CT.AppDefinition[];
  selected: number;
  apps: {
    selected: boolean;
    values: Array<string | boolean | number>;
  }[];
  /** The argument index to highlight. */
  peek: number;
  /** Messages currently visible to the user. */
  messages: Array<[string, MessageErrorLevel]>;
};

class Launcher extends Component<LauncherProps, LauncherState> {
  constructor(props: LauncherProps) {
    super(props);
    // Apps Definition
    const appState = props.apps.map((app, index) => {
      return {
        selected: index === 0,
        values: app.args.map((arg) => arg.value),
      };
    });
    this.state = {
      defs: props.apps,
      selected: 0,
      apps: appState,
      peek: -1,
      messages: [],
    };
  }

  handleApplicationSelection(index: number): void {
    const s = this.state.apps.map((app, idx) => {
      return {
        selected: idx === index,
        values: app.values,
      };
    });

    // Message testing
    this.addMessage(`${this.state.defs[index].app.name} selected.`);
    this.setState({ selected: index, apps: s });
  }

  handleArgChange(value: string | boolean | number, index: number): void {
    let s = this.state.apps;
    s[this.state.selected].values[index] = value;
    this.setState({ apps: s });
  }

  handleArgPeek(index: number): void {
    const peekIndex = index < 0 ? -1 : index + 1;
    this.setState({ peek: peekIndex });
  }

  handleLaunchClick(): void {
    const output = this.selectedOutput;
    this.addMessage(
      output
        .join(' ')
        .trim()
        .replace(/\s{2,}/g, ' '),
      'error',
    );
    ipcRenderer.send('launch', output);
  }

  addMessage(message: string, type: MessageErrorLevel = 'info'): void {
    let m = this.state.messages;
    m.push([message, type]);
    this.setState({ messages: m });
  }

  removeMessage(index: number): void {
    let m = this.state.messages.filter((msg, idx) => idx !== index);
    this.setState({ messages: m });
  }

  get selectedApp(): CT.AppDefinition {
    return this.props.apps[this.state.selected];
  }
  get selectedArgs(): (string | boolean | number)[] {
    return this.state.apps[this.state.selected].values;
  }

  get selectedOutput(): Array<string> {
    const values = this.selectedArgs;
    const args = this.selectedApp.args.map((arg, index) => {
      let svalue: string;
      let ignored = false;
      switch (arg.type) {
        case 'string':
          svalue = (values[index] as string) || arg.value;
          // If every match is null, the value doesn't exist in the ignored list.
          ignored =
            (arg.ignored || []).find((m) => svalue.match(m) !== null) !==
            undefined;
          break;
        case 'number':
          const v = (values[index] as number) || arg.value;
          svalue = v.toString(arg.radix || 10);
          // If the value is included in the ignored list, it should be ignored.
          ignored = (arg.ignored || []).includes(v);
          break;
        case 'boolean':
          svalue = (values[index] as boolean) ? arg.true : arg.false;
          break;
        case 'option':
          svalue = (values[index] as string) || arg.value;
          break;
      }

      return ignored ? '' : `${arg.pre || ''}${svalue}${arg.post || ''}`;
    });

    return [this.selectedApp.app.path].concat(args);
  }

  handleFilesDropped(paths: string[]): void {
    for (const p of paths) {
      this.addMessage(`Dropped ${p}`);
    }
  }

  render() {
    const appDefs = this.props.apps.map<CT.App>((app) => app.app);
    return (
      <div>
        <section>
          <ApplicationList
            definitions={appDefs}
            selected={this.state.selected}
            onApplicationSelected={(index) => {
              this.handleApplicationSelection(index);
            }}
          />
          <DragArea
            onFilesDropped={(paths) => this.handleFilesDropped(paths)}
          />
        </section>
        <section>
          <nav>
            <h1>{this.selectedApp.app.name}</h1>
            <button onClick={() => this.handleLaunchClick()}>Launch</button>
          </nav>
          <ArgumentList
            definitions={this.selectedApp.args}
            values={this.selectedArgs}
            onArgChange={(value, index) => this.handleArgChange(value, index)}
            onArgPeek={(index) => this.handleArgPeek(index)}
          />
        </section>
        <section>
          <Console
            args={this.selectedOutput}
            selected={this.state.peek}
            expanded={false}
          />
        </section>
        <Messages
          messages={this.state.messages}
          onMessageDismissed={(index) => this.removeMessage(index)}
        />
      </div>
    );
  }
}

ReactDOM.render(<Launcher apps={appProps} />, document.getElementById('root'));
