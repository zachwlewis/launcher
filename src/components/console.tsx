import React, { FunctionComponent } from 'react'

import './console.css'

type ConsoleProps = {
	args: string[],
	selected: number,
	expanded: boolean
}

export const Console: FunctionComponent<ConsoleProps> = ({ args, selected, expanded }) => {

	const argList = args.map((arg, index) =>
		<span key={`out${index}`}>
			<span className={`arg${selected === index ? ' peek' : ''}`}>{arg}</span>{arg.length !== 0 ? '\u0020' : ''}
		</span>
	);

	return (
		<section>
			<code className='console'>{argList}</code>
			<i>{expanded ? 'Collapse' : 'Expand'}</i>
		</section>
	);
};
