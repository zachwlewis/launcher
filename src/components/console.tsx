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
  constructor(props: ConsoleProps, state?: ConsoleState) {
    super(props);
    this.state = { expanded: props.expanded };
  }

  handleExpansion() {
    this.setState({ expanded: !this.state.expanded });
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

    const expansionIcon = this.state.expanded ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    );

    return (
      <section className="console">
        <span className="prompt">{this.props.prompt || '>'}</span>
        <code className={consoleClass}>{argList}</code>
        <button
          className="expansion-toggle"
          onClick={() => this.handleExpansion()}
        >
          {expansionIcon}
        </button>
      </section>
    );
  }
}
