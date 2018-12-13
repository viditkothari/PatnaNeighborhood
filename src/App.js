import React, { Component } from 'react';
import { Header, Search } from './components';
import './App.css';

class NeighborhoodApp extends Component {
// App's state
  state = {
    isListOpen: false,
  }

  showListView = () => {
    this.setState(prevState => ({
      isListOpen: !prevState.isListOpen,
    }));
  }

  render() {
    const { isListOpen } = this.state;
    return (
      <div className="App">
        <Header showPlaceList={this.showListView} />
        <Search isListOpen={isListOpen} />
      </div>
    );
  }
}

export default NeighborhoodApp;