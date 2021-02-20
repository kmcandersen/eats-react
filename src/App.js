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
      station_id: 410,
      shortname: 'Roosevelt',
      address: '22 E. Roosevelt Road',
      city: 'Chicago',
      lines: 'Red, Green, Orange',
      coords: [-87.62659, 41.867405],
    },
    // needed bc arr contents not directly accessible; same as selectedRest[0].station_id
    selectedRestId: 0,
    //must be arr, so cb used in setGraphics(arr)
    selectedRest: [],
    //if true, ListItem should scrollIntoView
    restSelectedOnMap: false,
    searchResults: [],
    // becomes searchResults
    data: 'none',
    mapLoaded: false,
    //here, t/f has no semantic meaning; it's just a toggle to trigger an update
    zoomToStaVar: false,
    //becomes true when a sta is selected via map (emptying Search box)
    clickedMapSta: false,
  };

  componentDidMount() {
    let latitude = this.state.selectedSta.coords[1];
    let longitude = this.state.selectedSta.coords[0];
    this.getRestData(latitude, longitude);
  }

  getRestData = async (latitude, longitude) => {
    this.onMapLoad(false);

    try {
      let res = await axios.get(
        `https://eats-react.herokuapp.com/api/v1/yelp-restaurants?term=restaurant&latitude=${latitude}&longitude=${longitude}&radius=804&limit=10`
      );
      if (res.data.businesses && res.data.businesses[0].categories) {
        let searchResults = createFeatureArr(res.data.businesses);
        this.setState({
          searchResults: searchResults,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  selectSta = selectedStaAllInfo => {
    let selectedStaInfo = {
      station_id: selectedStaAllInfo.STATION_ID,
      shortname: selectedStaAllInfo.SHORTNAME,
      address: selectedStaAllInfo.ADDRESS,
      city: selectedStaAllInfo.CITY,
      lines: selectedStaAllInfo.LINE_LIST,
      dup_name: selectedStaAllInfo.DUP_NAME,
      coords: [
        Number(selectedStaAllInfo.LONG),
        Number(selectedStaAllInfo.LAT_1),
      ],
    };

    this.setState({
      selectedSta: selectedStaInfo,
      selectedStaId: selectedStaInfo.station_id,
    });
  };

  clickMapSta = bool => {
    this.setState({ clickedMapSta: bool });
  };

  zoomToSta = () => {
    this.setState({ zoomToStaVar: !this.state.zoomToStaVar });
  };

  selectRest = (selectedRestAllInfo, bool) => {
    let selectedRestInfo = {
      ObjectID: selectedRestAllInfo.ObjectID,
      id: selectedRestAllInfo.id,
      name: selectedRestAllInfo.name,
      latitude: selectedRestAllInfo.latitude,
      longitude: selectedRestAllInfo.longitude,
    };

    this.setState({
      selectedRestId: selectedRestInfo.id,
      selectedRest: [selectedRestInfo],
      restSelectedOnMap: bool,
    });
  };

  removeSelectedRest = () => {
    this.setState({
      selectedRestId: 0,
      selectedRest: [],
    });
  };

  onMapLoad = boolean => {
    this.setState({ mapLoaded: boolean });
  };

  render() {
    return (
      <div>
        <Header />
        <main className="Main--wrapper">
          <Panel
            selectSta={this.selectSta}
            selectedSta={this.state.selectedSta}
            clickedMapSta={this.state.clickedMapSta}
            clickMapSta={this.clickMapSta}
            selectedRestId={this.state.selectedRestId}
            selectRest={this.selectRest}
            removeSelectedRest={this.removeSelectedRest}
            items={this.state.searchResults}
            mapLoaded={this.state.mapLoaded}
            zoomToSta={this.zoomToSta}
            restSelectedOnMap={this.state.restSelectedOnMap}
          />
          <EsriMap
            {...this.state}
            selectSta={this.selectSta}
            clickMapSta={this.clickMapSta}
            selectRest={this.selectRest}
            removeSelectedRest={this.removeSelectedRest}
            onMapLoad={this.onMapLoad}
            getRestData={this.getRestData}
          />
        </main>
      </div>
    );
  }
}

export default App;
