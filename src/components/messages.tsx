import React, { FunctionComponent, Component, ChangeEvent } from 'react'
import './messages.css'

type MessagesProps = {
  messages: Array<[string, string]>;
  onMessageDismissed: (index: number) => void;
}

export const Messages = (props: MessagesProps) => {
  const items = props.messages.map((m, i) => 
  <li key={`msg${i}`} className={m[1]}>
    <span>{m[0]}</span>
    <button onClick={() => props.onMessageDismissed(i)}>Dismiss</button>
  </li>).reverse();

  return (
    <ol className="messages">
      {items}
    </ol>
  )
}
