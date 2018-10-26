import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="list-item">
        <div >{this.props.title}</div>
        <div >{this.props.text}</div>
      </div>
    );
  }
}

export default App;
