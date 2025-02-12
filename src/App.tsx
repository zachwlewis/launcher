import { ipcRenderer } from 'electron';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Console } from './components/console';
import { ApplicationList } from './components/applicationList';
import { ArgumentList } from './components/argumentList';
import { Message, Messages } from './components/messages';
import { DragArea } from './components/dragArea';
import { TitleBar } from './components/titleBar';

import { Store } from './store';

import * as CT from './launcher-core/coreTypes';
import * as CF from './launcher-core/coreFunctions';

import './App.css';

type LauncherProps = {};

/** The state of an application. */
type AppState = {
  selected: boolean;
  args: CT.AnyArgState[];
};

/** The state of the launcher. */
type LauncherState = {
  readonly defs: CT.AppDefinition[];
  selected: number;
  apps: AppState[];
  /** The argument index to highlight. */
  peek: number;
  /** Messages currently visible to the user. */
  messages: Message[];
};

const defaultLauncherState: LauncherState = {
  defs: [],
  selected: -1,
  apps: [],
  peek: -1,
  messages: [],
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
        consoleExpanded: false,
        consolePrompt: '>',
      },
    });

    this.state = defaultLauncherState;
  }

  componentDidMount(): void {
    // Load definitions

    const definitionsPath = this.store.get('appsConfigPath') || '';

    const loadResult = CF.loadDefinitions(definitionsPath);
    const source = this.sourceDefinitions(loadResult.value || []);
    this.setState({
      ...source,
      ...this.store.get('lastState'),
      ...{ messages: [] },
    });
  }

  sourceDefinitions(
    definitions: CT.AppDefinition[],
  ): { defs: CT.AppDefinition[]; apps: AppState[]; selected: number } {
    const appState = definitions.map<AppState>((def) => {
      return {
        selected: false,
        args: def.args.map((arg) => CT.createStateFor(arg)),
      };
    });

    return { defs: definitions, apps: appState, selected: -1 };
  }

  saveState(): void {
    this.store.set('lastState', this.state);
  }

  updateJumpList(): void {
    let tasks: Electron.Task[] = [];
    for (let i = 0; i < this.state.defs.length; ++i) {
      const output = this.makeOutput(i);
      let path = this.state.defs[i].app.path;
      let args = output
        .slice(1)
        .join(' ')
        .trim()
        .replace(/\s{2,}/g, ' ');
      tasks.push({
        program: path,
        arguments: args,
        description: `Launch ${this.state.defs[i].app.name} with last configuration.`,
        title: this.state.defs[i].app.name,
        iconIndex: 0,
        iconPath: path,
      });
    }
    ipcRenderer.send('setUserTasks', tasks);
  }

  handleApplicationSelection(index: number): void {
    const s = this.state.apps.map((app, idx) => {
      return {
        selected: idx === index,
        args: app.args,
      };
    });

    // Message testing
    this.addMessage(`${this.state.defs[index].app.name} selected.`);
    this.setState({ selected: index, apps: s });
    this.saveState();
  }

  handleArgChange(value: CT.AnyArgState, index: number): void {
    let s = this.state.apps;
    s[this.state.selected].args[index] = value;
    this.setState({ apps: s });
    this.updateJumpList();
    this.saveState();
  }

  handleArgPeek(index: number): void {
    const peekIndex = index < 0 ? -1 : index + 1;
    this.setState({ peek: peekIndex });
  }

  handleLaunchClick(index?: number): void {
    let output: string[] = [];
    let valid = false;
    if (index === undefined) index = this.state.selected;

    output = this.makeOutput(index);
    valid = output.length > 0;

    if (!valid) output = ['Invalid selection.'];

    this.addMessage(
      output
        .join(' ')
        .trim()
        .replace(/\s{2,}/g, ' '),
      CT.ErrorLevel.Error,
    );

    if (valid) {
      ipcRenderer.send('launch', output);
    }
  }

  handleConsoleExpansionChange(expanded: boolean): void {
    this.store.set('consoleExpanded', expanded);
  }

  handleConsolePromptChange(prompt: string): void {
    this.store.set('consolePrompt', prompt);
  }

  addMessage(message: string, type: CT.ErrorLevel = CT.ErrorLevel.Info): void {
    let m = this.state.messages;
    switch (type) {
      case CT.ErrorLevel.Info:
        console.log(message);
        break;
      case CT.ErrorLevel.Warn:
        console.warn(message);
        m.push({ message: message, error: type });
        this.setState({ messages: m });
        break;
      case CT.ErrorLevel.Error:
        console.error(message);
        m.push({ message: message, error: type });
        this.setState({ messages: m });
        break;
    }
  }

  removeMessage(index: number): void {
    let m = this.state.messages.filter((msg, idx) => idx !== index);
    this.setState({ messages: m });
  }

  titleForIndex(index: number): string {
    if (index < 0) return '';
    const def = this.appForIndex(index);
    if (def === null) return '';
    return def.app.name || '';
  }

  appForIndex(value: number): CT.AppDefinition | null {
    if (value < 0) return null;
    const count = this.state.defs.length;
    if (value >= count) return null;

    return this.state.defs[value] || null;
  }

  argsForIndex(value: number): CT.AnyArgState[] {
    // Handle no selection.
    if (value < 0) return [];
    // Handle out of bounds selections.
    const count = this.state.apps.length;
    if (value >= count) return [];

    return this.state.apps[value].args;
  }

  /** Converts the launch values to an output string array. */
  makeOutput(index: number): string[] {
    const values = this.state.apps[index].args;
    const args = this.state.defs[index].args.map((arg, index) => {
      let svalue: string;
      let ignored = false;
      switch (arg.type) {
        case 'string':
          svalue = values[index].value as string;
          ignored = (arg.ignored || []).includes(svalue);
          break;
        case 'number':
          const v = values[index].value as number;
          svalue = v.toString(arg.radix || 10);
          // If the value is included in the ignored list, it should be ignored.
          ignored = (arg.ignored || []).includes(v);
          break;
        case 'boolean':
          svalue = (values[index].value as boolean) ? arg.true : arg.false;
          break;
        case 'option':
          svalue = values[index].value as string;
          // If the value is included in the ignored list, it should be ignored.
          ignored = (arg.ignored || []).includes(svalue);
          break;
      }

      return ignored ? '' : `${arg.pre || ''}${svalue}${arg.post || ''}`;
    });

    return [this.state.defs[index].app.path].concat(args);
  }

  get selectedOutput(): string[] {
    if (!this.appForIndex(this.state.selected)) {
      return ['No app selected.'];
    }

    return this.makeOutput(this.state.selected);
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
    const selectedAppTitle = this.titleForIndex(this.state.selected);
    const selectedApp = this.appForIndex(this.state.selected);
    const selectedAppArgs = selectedApp ? selectedApp.args : [];
    return (
      <div className="app">
        <TitleBar title={selectedAppTitle} />
        <section className="main">
          <section className="application-list">
            <nav>
              <h1>Applications</h1>
            </nav>
            <ApplicationList
              definitions={appDefs}
              selected={this.state.selected}
              onApplicationSelected={(index) =>
                this.handleApplicationSelection(index)
              }
              onApplicationQuickLaunched={(index) =>
                this.handleLaunchClick(index)
              }
            />
            <DragArea
              onFilesDropped={(paths) => this.handleFilesDropped(paths)}
            />
          </section>
          <section className="argument-list">
            <nav>
              <h1>
                {selectedAppTitle.length > 0
                  ? selectedAppTitle
                  : 'No App Selected'}
              </h1>
              <button onClick={() => this.handleLaunchClick()}>Launch</button>
            </nav>
            <ArgumentList
              definitions={selectedAppArgs}
              values={this.argsForIndex(this.state.selected)}
              onArgChange={(value, index) => this.handleArgChange(value, index)}
              onArgPeek={(index) => this.handleArgPeek(index)}
            />
          </section>
        </section>
        <Messages
          messages={this.state.messages}
          onMessageDismissed={(index) => this.removeMessage(index)}
        />
        <Console
          args={this.selectedOutput}
          selected={this.state.peek}
          expanded={this.store.get('consoleExpanded')}
          prompt={this.store.get('consolePrompt')}
          onExpansionChanged={(e) => this.handleConsoleExpansionChange(e)}
          onPromptChanged={(e) => this.handleConsolePromptChange(e)}
        />
      </div>
    );
  }
}

ReactDOM.render(<Launcher />, document.getElementById('root'));
