import React from 'react';
import './titleBar.css';

type TitleBarProps = {
  title: string;
};

export const TitleBar = (props: TitleBarProps) => {
  const title =
    props.title.length > 0 ? `Launcher | ${props.title}` : 'Launcher';
  return (
    <nav id="title-bar">
      <span>{title}</span>
    </nav>
  );
};
