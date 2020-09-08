import React, { Component } from 'react';
import './dragArea.css';

type DragAreaProps = {
  onFilesDropped: (paths: string[]) => void;
};

type DragAreaState = {
  dragging: boolean;
};

export class DragArea extends Component<DragAreaProps, DragAreaState> {
  constructor(props: DragAreaProps) {
    super(props);
    this.state = { dragging: false };
  }

  handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
  }

  handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: true });
  }

  handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files) {
      let paths: string[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; ++i) {
        paths.push(e.dataTransfer.files[i].path);
      }
      this.props.onFilesDropped(paths);
      this.setState({ dragging: false });
    }
  }

  render() {
    const dragClass = `dragArea${this.state.dragging ? ' dragging' : ''}`;
    return (
      <div
        className={dragClass}
        onDragOver={(e) => this.handleDragOver(e)}
        onDragStart={(e) => this.handleDragOver(e)}
        onDragEnd={(e) => this.handleDragOver(e)}
        onDragLeave={(e) => this.handleDragLeave(e)}
        onDrop={(e) => this.handleDrop(e)}
      >
        Drop configurations to load.
      </div>
    );
  }
}
