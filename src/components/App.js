import React, { Component } from 'react';
import Header from './Header';
import Home from './Home';
import '../css/App.css';

class App extends Component {
  render() {
    return (
      <section className="container">
        <Header />
        <section className="app-content">
          <Home  />
        </section>
      </section>
    );
  }
}

export default App;
