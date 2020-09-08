import React from 'react';
import { ipcRenderer } from 'electron';

import './titleBar.css';

type TitleBarProps = {
  title: string;
};

export const TitleBar = (props: TitleBarProps) => {
  const handleCloseClicked = () => {
    ipcRenderer.send('closeWindow');
  };

  const handleMinimizeClicked = () => {
    ipcRenderer.send('minimizeWindow');
  };
  const title =
    props.title.length > 0
      ? `Launcher [${process.platform}] | ${props.title}`
      : `Launcher [${process.platform}]`;
  if (process.platform === 'win32') {
    return (
      <nav id="title-bar">
        <span>{title}</span>
        <button title="Minimize" onClick={() => handleMinimizeClicked()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          title="Close"
          className="close"
          onClick={() => handleCloseClicked()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    );
  } else {
    // Don't add special buttons for non-windows builds.
    return (
      <nav id="title-bar">
        <span>{title}</span>
      </nav>
    );
  }
};
