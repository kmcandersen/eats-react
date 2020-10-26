import React, { Component } from 'react';
import Header from './Header';
import Panel from './Panel';
import EsriMap from './EsriMap';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <main className="Main--wrapper">
          <Panel />
          <EsriMap />
        </main>
      </div>
    );
  }
}

export default App;
