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
//let stationsLayer;

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
        let staLayer = loadStationsLayer();
        this._view.map.add(staLayer);
        //return stationsLayer;
      })
      .then(() => {
        this._view.map.add(loadLinesLayer());
      });

    // if (this._view) {
    //   console.log('VIEW');
    //   setTimeout(() => {
    //     this._view.whenLayerView(stationsLayer).then(layerView => {
    //       console.log('LAYERVIEW', layerView);
    //     });
    //   }, 1000);
    // }
    //.then(() => console.log(this._view.map.layers.items), 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      //delay nec to capture view
      setTimeout(() => {
        if (this._view) {
          let currResultsLayer = this._view.map.layers.getItemAt(2);
          // nec--there will always be a currResultsLayer??
          if (currResultsLayer) {
            this._view.map.remove(currResultsLayer);
          }
          const staLayer = this._view.map.layers.getItemAt(1);
          this._view.whenLayerView(staLayer).then(layerView => {
            console.log('LAYERVIEW', layerView);
            this.props.onMapLoad(true);

            //will need to handle station AND result clicks
            //mouseover + lines; displays popup
            const mapClickHandler = event => {
              this._view.hitTest(event).then(response => {
                if (response.results.length) {
                  if (highlight) {
                    highlight.remove();
                  }
                  const feature = response.results[0].graphic;
                  if (feature.layer.title === 'CTA Stations Details') {
                    highlight = layerView.highlight(feature);
                    this.props.selectSta(feature.attributes);
                    let { LAT_1, LONG } = feature.attributes;
                    this.props.getRestData(LAT_1, LONG);
                  } else if (feature.layer.title === 'Restaurants') {
                    console.log('restaurant');
                    //select restaurant
                    //change pin color: remove existing selected rest layer, create new one at curr loc--this happens in prevProps.selectedRest[0]
                  }
                } else if (!response.results.length) {
                  // if (this._view.popup.visible) {
                  //   this._view.popup.visible = false;
                  // }
                  // this.props.removeSelectedSta();
                  // this.props.removeSearchResults();
                }
                //end hitTest
              });
              //end clickHandler
            };
            this._view.on('immediate-click', mapClickHandler);
            //end whenLayerView
          });

          setGraphics(this.props.searchResults)
            .then(graphicsArr => {
              let resultsLayer = loadDataLayer(graphicsArr);
              return resultsLayer;
            })
            .then(resultsLayer => this._view.map.add(resultsLayer))
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
          //change to use .filter ?
          // const graphic = response.results.filter(function(result) {
          //   return result.graphic.layer === hurricanesLayer;
          // })[0].graphic;
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

    if (
      this.props.selectedSta.station_id !== prevProps.selectedSta.station_id
    ) {
      setTimeout(() => {
        if (this._view) {
          // index of stations layer:
          const staLayer = this._view.map.layers.getItemAt(1);
          this._view.whenLayerView(staLayer).then(layerView => {
            // highlight point of selected station (initial selection or when selected via Search, NOT map click)
            let query = staLayer.createQuery();
            let queryString = `STATION_ID = ${this.props.selectedSta.station_id}`;
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
      }, 200);
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
