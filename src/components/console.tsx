import React, {FunctionComponent} from 'react'

import './console.css'

type ConsoleProps = {
    args: string[],
    selected: number,
    expanded: boolean
}

export const Console: FunctionComponent<ConsoleProps> = ({args, selected, expanded}) =>
<section>
    <code className='console'>{args.join(' ')}</code>
    <i>{expanded ? 'Collapse' : 'Expand'}</i>
</section>