import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Panel from './Panel';
import EsriMap from './EsriMap';
import { createFeatureArr } from './utils/createFeatureArr.js';
import './App.css';

class App extends Component {
  state = {
    selectedStaId: 0,
    selectedSta: {
      station_id: 0,
      shortname: '',
      address: '',
      lines: '',
      sta_desc_n: '',
      coords: [],
    },
    selectedRest: [],
    searchResults: [],
    bookmarks: [],
    // searchResults or bookmarks
    data: '',
    mapLoaded: false,
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
      station_id: 410,
      shortname: 'Roosevelt',
      address: '22 E. Roosevelt Road',
      lines: 'Red, Green, Orange',
      sta_desc_n: 'Roosevelt (Red, Orange & Green Lines)',
      coords: [-87.62659, 41.867405],
    };

    //sample--delete
    // const selectedRestInfo = {
    //   latitude: 41.8653913003346,
    //   longitude: -87.6260132093555,
    //   distance: 987,
    //   id: '3BKnY2wzy4QM20Fr1nqDsg',
    //   image_url:
    //     'https://s3-media3.fl.yelpcdn.com/bphoto/CCbcgS9VzaJYRXiPAsYglg/o.jpg',
    //   address: '1310 S Wabash Ave',
    //   city: 'Evanston',
    //   name: 'Flo & Santos',
    //   rating: 4,
    //   url:
    //     'https://www.yelp.com/biz/flo-and-santos-chicago-3?adjust_creative=yBSQxTfRYukNfg2kMSU4Sw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=yBSQxTfRYukNfg2kMSU4Sw',
    // };

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
            // selectedRest: [selectedRestInfo],
            searchResults: searchResults,
            data: 'searchResults',
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getRestData = async (lat, long) => {
    // using heroku url = cors error here
    const url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${lat}&longitude=${long}&radius=804&limit=10`;

    this.onMapLoad(false);

    await axios
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
            searchResults: searchResults,
            data: 'searchResults',
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // componentDidUpdate(prevState) {
  //   if (this.state.selectedStaId !== prevState.selectedStaId) {
  //     console.log('CDU');

  //   }
  // }

  selectSta = selectedStaAllInfo => {
    let selectedStaInfo = {
      station_id: selectedStaAllInfo.STATION_ID,
      shortname: selectedStaAllInfo.SHORTNAME,
      address: selectedStaAllInfo.ADDRESS,
      lines: selectedStaAllInfo.LINE_LIST,
      sta_desc_n: selectedStaAllInfo.STA_DESC_N,
      coords: [
        Number(selectedStaAllInfo.LONG),
        Number(selectedStaAllInfo.LAT_1),
      ],
    };

    this.setState({
      selectedStaId: selectedStaAllInfo.STATION_ID,
      selectedSta: selectedStaInfo,
    });
  };

  onMapLoad = boolean => {
    this.setState({ mapLoaded: boolean });
  };

  // removeSelectedSta = () => {
  //   console.log('removed');
  //   this.setState({
  //     selectedStaId: 0,
  //     selectedSta: {
  //       id: 0,
  //       name: '',
  //       address: '',
  //       coords: [],
  //       lines: [],
  //     },
  //   });
  // };

  // removeSearchResults = () => {
  //   this.setState({ searchResults: [] });
  // };

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
            mapLoaded={this.state.mapLoaded}
          />
          <EsriMap
            {...this.state}
            selectSta={this.selectSta}
            onMapLoad={this.onMapLoad}
            getRestData={this.getRestData}
            // removeSelectedSta={this.removeSelectedSta}
            // removeSearchResults={this.removeSearchResults}
          />
        </main>
      </div>
    );
  }
}

export default App;
