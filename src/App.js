import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/Header';
import GradientDescent from './gradientDescent/GradientDescent';
import Mnist from './mnist/Mnist';

class App extends Component {

  render() {
    console.log('ll')
    return (
      <Router>
        <div>
          <Header />
          <Route path="/" exact component={GradientDescent} />
          <Route path="/gradient_descent" component={GradientDescent} />
          <Route path="/mnist" component={Mnist} />
        </div>
      </Router>
    );
  }
}

export default App;
