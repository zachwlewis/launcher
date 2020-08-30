import React, { Component } from 'react';
import * as CT from '../launcher-core/coreTypes';
import * as AIC from './argumentItemComponents';

import './argumentList.css';

type ArgumentListProps = {
  definitions: CT.AnyArg[];
  values: CT.AnyArgState[];
  onArgChange: (value: CT.AnyArgState, index: number) => void;
  onArgPeek: (index: number) => void;
};

type ArgumentListState = {
  args: CT.AnyArgState[];
};

export class ArgumentList extends Component<
  ArgumentListProps,
  ArgumentListState
> {
  constructor(props: ArgumentListProps, state: ArgumentListState) {
    super(props);
  }

  handlePeek(index: number): void {
    this.props.onArgPeek(index);
  }

  buildStringArgumentItem(
    arg: CT.StringArg,
    state: CT.StringArgState,
    index: number,
  ): JSX.Element {
    const k = `arg${index}`;
    return (
      <li key={k}>
        <AIC.ArgumentLabel
          for={k}
          definition={arg}
          onStartPeek={() => this.handlePeek(index)}
          onEndPeek={() => this.handlePeek(-1)}
        />
        <AIC.StringArgumentItem
          definition={arg}
          state={state}
          id={k}
          onValueChange={(value) => this.props.onArgChange(value, index)}
        />
      </li>
    );
  }

  buildBooleanArgumentItem(
    arg: CT.BooleanArg,
    state: CT.BooleanArgState,
    index: number,
  ): JSX.Element {
    const k = `arg${index}`;
    return (
      <li key={k}>
        <AIC.BooleanArgumentItem
          definition={arg}
          state={state}
          id={`arg${index}`}
          onValueChange={(value) => this.props.onArgChange(value, index)}
        />
        <AIC.ArgumentLabel
          for={k}
          definition={arg}
          onStartPeek={() => this.handlePeek(index)}
          onEndPeek={() => this.handlePeek(-1)}
        />
      </li>
    );
  }

  buildIntArgumentItem(
    arg: CT.NumberArg,
    state: CT.NumberArgState,
    index: number,
  ): JSX.Element {
    const k = `arg${index}`;
    return (
      <li key={k}>
        <AIC.ArgumentLabel
          for={k}
          definition={arg}
          onStartPeek={() => this.handlePeek(index)}
          onEndPeek={() => this.handlePeek(-1)}
        />
        <AIC.NumberArgumentItem
          definition={arg}
          state={state}
          id={`arg${index}`}
          onValueChange={(value) => this.props.onArgChange(value, index)}
        />
      </li>
    );
  }

  buildOptionArgumentItem(
    arg: CT.OptionArg,
    state: CT.OptionArgState,
    index: number,
  ): JSX.Element {
    const k = `arg${index}`;
    return (
      <li key={k}>
        <AIC.ArgumentLabel
          for={k}
          definition={arg}
          onStartPeek={() => this.handlePeek(index)}
          onEndPeek={() => this.handlePeek(-1)}
        />
        <AIC.OptionArgumentItem
          definition={arg}
          state={state}
          id={`arg${index}`}
          onValueChange={(value) => this.props.onArgChange(value, index)}
        />
      </li>
    );
  }

  makeArgumentItem(
    arg: CT.AnyArg,
    state: CT.AnyArgState,
    index: number,
  ): JSX.Element {
    switch (arg.type) {
      case 'string':
        return this.buildStringArgumentItem(
          arg,
          state as CT.StringArgState,
          index,
        );
      case 'number':
        return this.buildIntArgumentItem(
          arg,
          state as CT.NumberArgState,
          index,
        );
      case 'boolean':
        return this.buildBooleanArgumentItem(
          arg,
          state as CT.BooleanArgState,
          index,
        );
      case 'option':
        return this.buildOptionArgumentItem(
          arg,
          state as CT.OptionArgState,
          index,
        );
    }
  }

  render() {
    const listItems = this.props.definitions.map((arg, index) =>
      this.makeArgumentItem(arg, this.props.values[index], index),
    );

    return <ol className="argument-list">{listItems}</ol>;
  }
}
