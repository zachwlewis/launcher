import React, {FunctionComponent} from 'react'

type ApplicationListItemProps = {
	name:string;
	selected:boolean;
	onClick: () => void;
}

export const ApplicationListItem: FunctionComponent<ApplicationListItemProps> = ({name, selected, onClick}) => 
	<li className={selected?'selected':''}onClick={()=>onClick()}>
		<span className="label">{name}</span>
		<i onClick={() => {console.log(`Quicklaunch: ${name}`);}}>QL</i>
	</li>
