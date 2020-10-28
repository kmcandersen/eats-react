import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Panel from './Panel';
import EsriMap from './EsriMap';
import { createFeatureArr } from './utils/createFeatureArr.js';
import './App.css';

class App extends Component {
  state = {
    selectedSta: {
      id: 0,
      name: '',
      address: '',
      coords: [],
      lines: [],
    },
    searchResults: [],
    data: '',
    onMapLoad: false,
  };

  async componentDidMount() {
    try {
      const url =
        'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=41.867405&longitude=-87.62659&radius=804&limit=10';

      const selectedStaInfo = {
        id: 0,
        name: 'Roosevelt/Wabash',
        address: '22 E. Roosevelt Road',
        coords: [-87.62659, 41.867405],
        lines: ['red', 'green', 'orange'],
      };

      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
        })
        .then(res => {
          let searchData = createFeatureArr(res.data.businesses);
          this.setState({
            selectedSta: selectedStaInfo,
            searchResults: searchData,
            data: 'searchResults',
          });
        });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { selectedSta, data, searchResults, onMapLoad } = this.state;
    return (
      <div>
        <Header />
        <main className="Main--wrapper">
          <Panel />
          <EsriMap
            selectedSta={selectedSta}
            data={data}
            searchResults={searchResults}
            onMapLoad={onMapLoad}
          />
        </main>
      </div>
    );
  }
}

export default App;
