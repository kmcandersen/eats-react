import React, { Component, createRef } from 'react';
import { loadMap } from './utils/map';
import { loadHome, loadLocate } from './utils/widgets';
import {
  loadLinesLayer,
  loadStationsLayer,
  loadDataLayer,
} from './utils/layer';
import { setGraphics } from './utils/graphics';
import './EsriMap.css';

//let mapClickListener;

class EsriMap extends Component {
  constructor(props) {
    super(props);
    this.mapDiv = createRef();
    this.state = {
      mapHeight: '',
    };
  }

  componentDidMount() {
    const container = this.mapDiv.current;
    this.calcMapSize();
    window.addEventListener('resize', () => {
      this.calcMapSize();
    });
    loadMap(container)
      .then(view => {
        this._view = view;
        loadHome(this._view);
        loadLocate(this._view);
        //this.props.setSampleArtwork(sampleArtwork);
        //const stationsLayer = loadStationsLayer();
        this._view.map.add(loadStationsLayer());
      })
      .then(() => {
        this._view.map.add(loadLinesLayer());
      });
    //.then(() => console.log(this._view.map.layers.items), 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      //delay nec to capture view
      setTimeout(() => {
        if (this._view) {
          let layer = '';
          layer = this._view.map.layers.getItemAt(2);
          if (layer) {
            this._view.map.remove(layer);
          }

          setGraphics(this.props.searchResults)
            .then(graphicsArr => {
              return (layer = loadDataLayer(graphicsArr));
            })
            .then(layer => {
              this._view.map.add(layer);
            })
            .then(() =>
              this._view.goTo({ center: this.props.selectedSta.coords })
            );
        }
        //end setTimeout
      }, 200);
    }
  }

  calcMapSize = () => {
    this.setState({
      mapHeight: window.innerHeight - 60 + 'px',
    });
  };

  componentWillUnmount() {
    if (this._view) {
      this._view.container = null;
      delete this._view;
    }
  }

  render() {
    const { mapHeight } = this.state;
    return (
      <div className="Map--wrapper" style={{ height: mapHeight, width: '65%' }}>
        <div className="Map--map" ref={this.mapDiv}>
          {/* <div className={`${!this.props.mapLoaded && "loading-spinner"}`}></div> */}
        </div>
      </div>
    );
  }
}

export default EsriMap;
