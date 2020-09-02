import React, { Component } from 'react';

import './console.css';

type ConsoleProps = {
  args: string[];
  selected: number;
  expanded: boolean;
  prompt?: string;
};

type ConsoleState = {
  expanded: boolean;
};

export class Console extends Component<ConsoleProps, ConsoleState> {
  constructor(props: ConsoleProps) {
    super(props);
    this.state = { expanded: props.expanded };
  }

  handleExpansion() {
    this.setState({ expanded: !this.state.expanded });
    console.log(this.state);
  }

  render() {
    const argList = this.props.args.map((arg, index) => (
      <span key={`out${index}`}>
        <span className={`arg${this.props.selected === index ? ' peek' : ''}`}>
          {arg}
        </span>
        {arg.length !== 0 ? '\u0020' : ''}
      </span>
    ));

    const consoleClass = this.state.expanded
      ? 'console expanded'
      : 'console collapsed';

    return (
      <section className="console">
        <span className="prompt">{this.props.prompt || '>'}</span>
        <code className={consoleClass}>{argList}</code>
        <button
          className="expansion-toggle"
          onClick={() => this.handleExpansion()}
        >
          {this.state.expanded ? '-' : '+'}
        </button>
      </section>
    );
  }
}
