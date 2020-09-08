import React, { Component } from 'react';

import './console.css';

type ConsoleProps = {
  args: string[];
  selected: number;
  expanded: boolean;
  prompt?: string;
  onExpansionChanged: (expanded: boolean) => void;
  onPromptChanged: (prompt: string) => void;
};

type ConsoleState = {
  expanded: boolean;
  prompt: string;
};

export class Console extends Component<ConsoleProps, ConsoleState> {
  readonly prompts = ['>', '$', '%', '→', '#', ':', '@', '💩'];
  constructor(props: ConsoleProps, state?: ConsoleState) {
    super(props);
    this.state = {
      expanded: props.expanded,
      prompt: props.prompt || this.prompts[0],
    };
  }

  handleExpansion() {
    const expanded = !this.state.expanded;
    this.props.onExpansionChanged(expanded);
    this.setState({ expanded: expanded });
  }

  nextPrompt() {
    const i = this.prompts.indexOf(this.state.prompt) + 1;
    const nextPrompt =
      i < this.prompts.length ? this.prompts[i] : this.prompts[0];
    this.props.onPromptChanged(nextPrompt);
    this.setState({ prompt: nextPrompt });
  }

  /**
   * Adds non-breaking hyphens and zero-width spaces
   * to support pretty line wrapping for console output.
   */
  formatForDisplay(s: string): string {
    return s
      .replace(/-/g, '\u2011')
      .replace(/\\/g, '\\\u200B')
      .replace(/\//g, '/\u200B')
      .replace(/=/g, '=\u200B');
  }

  /** Cleans added formatting characters. */
  formatForClipboard(s: string): string {
    return s.replace(/‑/g, '-').replace(/\u200B/g, '');
  }

  handleCopy(e: React.ClipboardEvent): void {
    e.preventDefault();
    if (!e.clipboardData) return;
    const selection = document.getSelection() || '';
    e.clipboardData.setData(
      'text/plain',
      this.formatForClipboard(selection.toString()),
    );
  }

  render() {
    const argList = this.props.args.map((arg, index) => (
      <span key={`out${index}`}>
        <span className={`arg${this.props.selected === index ? ' peek' : ''}`}>
          {this.formatForDisplay(arg)}
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
      <section className={consoleClass}>
        <span className="prompt" onClick={() => this.nextPrompt()}>
          {this.state.prompt}
        </span>
        <code onCopy={(e) => this.handleCopy(e)}>{argList}</code>
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
