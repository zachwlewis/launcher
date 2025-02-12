import React, { Component } from 'react';
import { ApplicationListItem } from './applicationListItem';
import * as CT from '../launcher-core/coreTypes';

import './applicationList.css';

type ApplicationListProps = {
  definitions: CT.App[];
  selected: number;
  onApplicationSelected: (n: number) => void;
  onApplicationQuickLaunched: (n: number) => void;
};

export class ApplicationList extends Component<ApplicationListProps> {
  constructor(props: ApplicationListProps) {
    super(props);
  }

  render() {
    let listItems = this.props.definitions.map((app, index) => (
      <ApplicationListItem
        key={index}
        name={app.name}
        selected={index === this.props.selected}
        onClick={() => this.props.onApplicationSelected(index)}
        onQuickLaunch={() => this.props.onApplicationQuickLaunched(index)}
      />
    ));

    return <ul className="application-list">{listItems}</ul>;
  }
}
