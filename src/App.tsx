import { ipcRenderer } from 'electron';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Console } from './components/console';
import { ApplicationList } from './components/applicationList';
import { ArgumentList } from './components/argumentList';
import { Message, Messages } from './components/messages';
import { DragArea } from './components/dragArea';

import { Store } from './store';

import * as CT from './launcher-core/coreTypes';
import * as CF from './launcher-core/coreFunctions';

import './App.css';

type LauncherProps = {
  //apps: CT.AppDefinition[];
};
type AppState = {
  selected: boolean;
  values: Array<string | boolean | number>;
};
type LauncherState = {
  readonly defs: CT.AppDefinition[];
  selected: number;
  apps: AppState[];
  /** The argument index to highlight. */
  peek: number;
  /** Messages currently visible to the user. */
  messages: Message[];
};

class Launcher extends Component<LauncherProps, LauncherState> {
  readonly store: Store;
  constructor(props: LauncherProps) {
    super(props);

    // Create a Store to handle launcher persistence.

    this.store = new Store({
      // We'll call our data file 'user-preferences'
      configName: 'launcherConfig',
      defaults: {
        appsConfigPath: '',
      },
    });

    this.state = {
      defs: [],
      selected: -1,
      apps: [],
      peek: -1,
      messages: [],
    };
  }

  componentDidMount(): void {
    // Load definitions

    const definitionsPath = this.store.get('appsConfigPath') || '';

    const loadResult = CF.loadDefinitions(definitionsPath);
    console.log(
      `Sourcing ${loadResult.value || [].length} definitions.`,
      loadResult.value,
    );
    const source = this.sourceDefinitions(loadResult.value || []);

    this.setState(source);
  }

  sourceDefinitions(
    definitions: CT.AppDefinition[],
  ): { defs: CT.AppDefinition[]; apps: AppState[]; selected: number } {
    const appState = definitions.map<AppState>((def) => {
      return {
        selected: false,
        values: def.args.map((arg) => arg.value),
      };
    });

    console.log(
      `Sourced ${appState.length} of ${definitions.length} definitions.`,
      appState,
      definitions,
    );

    return { defs: definitions, apps: appState, selected: -1 };
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
      CT.ErrorLevel.Error,
    );
    ipcRenderer.send('launch', output);
  }

  addMessage(message: string, type: CT.ErrorLevel = CT.ErrorLevel.Info): void {
    let m = this.state.messages;
    m.push({ message: message, error: type });
    this.setState({ messages: m });
  }

  removeMessage(index: number): void {
    let m = this.state.messages.filter((msg, idx) => idx !== index);
    this.setState({ messages: m });
  }

  get selectedApp(): CT.AppDefinition | null {
    const count = this.state.defs.length;
    if (count === 0 || this.state.selected >= count) {
      console.log(
        `Unable to select application ${this.state.selected}.`,
        CT.ErrorLevel.Warn,
      );
      return null;
    }

    return this.state.defs[this.state.selected];
  }
  get selectedArgs(): (string | boolean | number)[] {
    if (this.state.selected < 0) return [];

    const count = this.state.apps.length;

    if (count === 0 || this.state.selected >= count) return [];

    return this.state.apps[this.state.selected].values;
  }

  get selectedOutput(): Array<string> {
    if (!this.selectedApp) {
      return ['No app selected'];
    }

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

    if (paths.length > 0) {
      this.store.set('appsConfigPath', paths[0]);
      const source = this.sourceDefinitions(
        CF.loadDefinitions(paths[0]).value || [],
      );
      this.setState(source);
    }
  }

  render() {
    const appDefs = this.state.defs.map<CT.App>((app) => app.app);
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
            <h1>
              {this.selectedApp ? this.selectedApp.app.name : 'No App Selected'}
            </h1>
            <button onClick={() => this.handleLaunchClick()}>Launch</button>
          </nav>
          <ArgumentList
            definitions={this.selectedApp ? this.selectedApp.args : []}
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

ReactDOM.render(<Launcher />, document.getElementById('root'));
