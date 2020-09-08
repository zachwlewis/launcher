import React, { FunctionComponent, Component, ChangeEvent } from 'react';
import * as CT from '../launcher-core/coreTypes';
import './messages.css';

export type Message = {
  message: string;
  error: CT.ErrorLevel;
};

type MessagesProps = {
  messages: Message[];
  onMessageDismissed: (index: number) => void;
};

export const Messages = (props: MessagesProps) => {
  const getErrorClass = (error: CT.ErrorLevel): string => {
    switch (error) {
      case CT.ErrorLevel.Info:
        return 'info';
      case CT.ErrorLevel.Warn:
        return 'warning';
      case CT.ErrorLevel.Error:
        return 'error';
    }
  };
  const items = props.messages
    .map((m, i) => (
      <li
        key={`msg${i}`}
        className={getErrorClass(m.error)}
        onClick={() => props.onMessageDismissed(i)}
      >
        <span>{m.message}</span>
      </li>
    ))
    .reverse();

  return <ol className="messages">{items}</ol>;
};
