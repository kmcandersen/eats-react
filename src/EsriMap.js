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
//import yellowIcon from './img/map-pin-yellow.svg';

let highlight;
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
          let currResultsLayer = this._view.map.layers.getItemAt(2);
          if (currResultsLayer) {
            this._view.map.remove(currResultsLayer);
          }

          setGraphics(this.props.searchResults)
            .then(graphicsArr => {
              let resultsLayer = loadDataLayer(graphicsArr);
              return resultsLayer;
            })
            .then(resultsLayer => {
              this._view.map.add(resultsLayer);
            })
            .then(() =>
              this._view.goTo({ center: this.props.selectedSta.coords })
            );
          //end this._view
        }
        //end setTimeout
      }, 200);
      //end this.props.data
    }

    if (this.props.selectedRest[0] !== prevProps.selectedRest[0]) {
      setTimeout(() => {
        if (this._view) {
          let currSelectedRestLayer = this._view.map.layers.getItemAt(3);
          if (currSelectedRestLayer) {
            this._view.map.remove(currSelectedRestLayer);
          }
          setGraphics(this.props.selectedRest)
            .then(graphicsArr => {
              let selectedRestLayer = loadDataLayer(graphicsArr, 'yellow');
              return selectedRestLayer;
            })
            .then(selectedRestLayer => {
              this._view.map.add(selectedRestLayer);
            });
          //.then(() => console.log('how many layers?', this._view.map.layers));
          //end this._view
        }
      }, 200);
    }

    if (this.props.selectedSta !== prevProps.selectedSta) {
      if (this._view) {
        // index of stations layer:
        const staLayer = this._view.map.layers.getItemAt(1);
        this._view.whenLayerView(staLayer).then(layerView => {
          // highlight point of selected station (when not selected via Search, NOT map click)
          let query = staLayer.createQuery();
          let queryString = `STATION_ID = '${this.props.selectedSta.id}'`;
          query.where = queryString;
          staLayer.queryFeatures(query).then(result => {
            if (highlight) {
              highlight.remove();
            }
            highlight = layerView.highlight(result.features);
          });
          //whenLayerView--staLayer
        });

        //this._view
      }
      //props.selectedSta
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
