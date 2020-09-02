import React, { FunctionComponent } from 'react';

type ApplicationListItemProps = {
  name: string;
  selected: boolean;
  onClick: () => void;
  onQuickLaunch: () => void;
};

export const ApplicationListItem: FunctionComponent<ApplicationListItemProps> = ({
  name,
  selected,
  onClick,
  onQuickLaunch,
}) => {
  function handleQuickLaunch(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    onQuickLaunch();
  }

  return (
    <li
      className={
        selected ? 'application-list-item selected' : 'application-list-item'
      }
      onClick={() => onClick()}
    >
      <span className="label">{name}</span>
      <button onClick={(event) => handleQuickLaunch(event)}>Launch</button>
    </li>
  );
};
