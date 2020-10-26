import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Panel from './Panel';
import EsriMap from './EsriMap';
import './App.css';

class App extends Component {
  state = {
    selectedSta: 0,
  };

  async componentDidMount() {
    try {
      const { REACT_APP_API_KEY } = process.env;
      const url =
        'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=41.867405&longitude=-87.62659&radius=804&limit=10';

      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

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
