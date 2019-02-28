import React, { Component } from 'react';
import Header from './components/Header';
import LinearRegression from './components/LinearRegression';

class App extends Component {

  render() {
    return (
      <div>
        <Header />
        <LinearRegression />
      </div>
    );
  }
}

export default App;
