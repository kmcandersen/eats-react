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
    selectedRest: [],
    searchResults: [],
    bookmarks: [],
    // searchResults or bookmarks
    data: '',
    onMapLoad: false,
  };

  componentDidMount() {
    // const url =
    //   'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=41.867405&longitude=-87.62659&radius=804&limit=10';
    const url = `https://cors-anywhere.herokuapp.com/http://gafinal.herokuapp.com/?term=restaurant&latitude=41.867405&longitude=-87.62659&radius=804&limit=10`;

    const selectedStaInfo = {
      // id: 760,
      // name: 'Granville',
      // address: '1119 W. Granville Ave.',
      // coords: [-87.659202, 41.993664],
      // lines: ['red'],
      id: 410,
      name: 'Roosevelt/Wabash',
      address: '22 E. Roosevelt Road',
      coords: [-87.62659, 41.867405],
      lines: ['Red', 'Green', 'Orange'],
    };

    //sample--delete
    const selectedRestInfo = {
      latitude: 41.8653913003346,
      longitude: -87.6260132093555,
      distance: 987,
      id: '3BKnY2wzy4QM20Fr1nqDsg',
      image_url:
        'https://s3-media3.fl.yelpcdn.com/bphoto/CCbcgS9VzaJYRXiPAsYglg/o.jpg',
      address: '1310 S Wabash Ave',
      city: 'Evanston',
      name: 'Flo & Santos',
      rating: 4,
      url:
        'https://www.yelp.com/biz/flo-and-santos-chicago-3?adjust_creative=yBSQxTfRYukNfg2kMSU4Sw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=yBSQxTfRYukNfg2kMSU4Sw',
    };

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        if (res.data.businesses && res.data.businesses[0].categories) {
          let searchResults = createFeatureArr(res.data.businesses);

          this.setState({
            selectedSta: selectedStaInfo,
            selectedRest: [selectedRestInfo],
            searchResults: searchResults,
            data: 'searchResults',
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    // const { selectedSta, selectedRest, data, searchResults, onMapLoad } = this.state;
    return (
      <div>
        <Header />
        <main className="Main--wrapper">
          <Panel
            selectedSta={this.state.selectedSta}
            items={
              this.state.data === 'searchResults' && this.state.searchResults
            }
          />
          <EsriMap {...this.state} />
        </main>
      </div>
    );
  }
}

export default App;
