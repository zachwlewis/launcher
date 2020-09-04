import React, { Component } from 'react';
import * as CT from '../launcher-core/coreTypes';

type NumberArgumentItemProps = {
  id: string;
  definition: CT.NumberArg;
  state: CT.NumberArgState;
  onValueChange: (value: CT.NumberArgState) => void;
};

export class NumberArgumentItem extends Component<
  NumberArgumentItemProps,
  CT.NumberArgState
> {
  constructor(props: NumberArgumentItemProps) {
    super(props);
    this.state = {
      ...props.state,
      ...{ value: this.sanitize(props.state.value) },
    };
  }

  parseNumber(value: string): number {
    return this.props.definition.format === 'integer'
      ? parseInt(value)
      : parseFloat(value);
  }

  handleValueSubmit(value: string) {
    let n = this.sanitize(this.parseNumber(value));
    this.setState({ value: n });
    this.props.onValueChange({ type: 'number', value: n });
  }

  handleValueChange(value: string) {
    let n = this.parseNumber(value);
    this.setState({ value: n });
    this.props.onValueChange({ type: 'number', value: this.sanitize(n) });
  }

  sanitize(value: number): number {
    let n = isNaN(value) ? 0 : value;
    if (this.props.definition.minimum !== undefined)
      n = Math.max(n, this.props.definition.minimum);
    if (this.props.definition.maximum !== undefined)
      n = Math.min(n, this.props.definition.maximum);
    return n;
  }

  render = () => (
    <input
      id={this.props.id}
      type="number"
      value={this.state.value}
      step={this.props.definition.step}
      min={this.props.definition.minimum}
      max={this.props.definition.maximum}
      onBlur={(event) => this.handleValueSubmit(event.target.value)}
      onChange={(event) => this.handleValueChange(event.target.value)}
      disabled={this.props.definition.display === 'readonly'}
    />
  );
}
