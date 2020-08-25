import React, {Component} from 'react'
import {LA, LAProps} from '../launcher-core/la'
import {AArgProps} from '../launcher-core/aarg'
import {ApplicationListItem} from './applicationListItem'

import './applicationList.css'

type ApplicationListProps = {
	definitions: LAProps[];
	selected: number;
	onApplicationSelected: (n: number) => void;
}

export class ApplicationList extends Component<ApplicationListProps> {
	constructor(props: ApplicationListProps) {
		super(props);
	}

	render() {
		let listItems = this.props.definitions.map((app, index) =>
		<ApplicationListItem
			key={index}
			name={app.name}
			selected={index === this.props.selected}
			onClick={()=>this.props.onApplicationSelected(index)}
		/>);
		
		return (
			<section>
			<h1>Applications</h1>
			<ul className="application-list">
					{listItems}
			</ul>
		</section>
		);
	}
}
