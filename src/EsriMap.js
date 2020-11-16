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
let mapClickListener;
//let staLayer;

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
        let staLayer = loadStationsLayer();
        this._view.map.add(staLayer);
      })
      .then(() => {
        this._view.map.add(loadLinesLayer());
      })
      .catch(err => {
        console.log(err);
      })
      // adjusts station symbol size at scale breakpoints, but degrades performance:
      .then(() => {
        this._view.watch('scale', newValue => {
          let staLayer = this._view.map.layers.find(layer => {
            return layer.title === 'CTA Stations Details';
          });
          if (staLayer) {
            const renderer = staLayer.renderer.clone();
            if (newValue >= 577790.554289) {
              renderer.symbol.size = 4.5;
              renderer.symbol.outline.width = 0.6;
            } else if (newValue >= 144447.638572) {
              renderer.symbol.size = 6;
              renderer.symbol.outline.width = 0.7;
            } else {
              renderer.symbol.size = 8;
              renderer.symbol.outline.width = 1.1;
            }
            staLayer.renderer = renderer;
          }
        });
      });
  }

  componentDidUpdate(prevProps) {
    // data = none, searchResults, or Bookmarks
    // runs 2x every time there's a search (this.state.data changes from searchResults to none to searchResults); prevProps.selectedSta.station_id also runs with ea search
    if (this.props.data !== prevProps.data) {
      console.log('CDU data running');
      //delay nec to capture view
      setTimeout(() => {
        if (this._view) {
          //so click listeners don't accumulate with ea Update & run multiple times
          if (mapClickListener) {
            mapClickListener.remove();
          }

          // .find layers is flexible but doesn't work here
          const staLayer = this._view.map.layers.getItemAt(1);

          this._view
            .whenLayerView(staLayer)
            .then(layerView => {
              console.log('LAYERVIEW', layerView);

              const restLayer = this._view.map.layers.find(layer => {
                return layer.title === 'Restaurant Results';
              });
              if (restLayer && this.props.selectedStaId) {
                this._view.map.remove(restLayer);
              }

              //to highlight Roosevelt on initial load
              if (prevProps.selectedStaId === 0) {
                let query = staLayer.createQuery();
                let queryString = `STATION_ID = 410`;
                query.where = queryString;
                staLayer.queryFeatures(query).then(result => {
                  highlight = layerView.highlight(result.features);
                });
              }

              this.props.onMapLoad(true);

              // mapClickHandler/hitTest takes clicks & changes appropriate state. Other CDU conditions modify layers accordingly
              let mapClickHandler = event => {
                this._view.hitTest(event).then(response => {
                  if (response.results.length) {
                    const feature = response.results[0].graphic;
                    if (feature.layer.title === 'CTA Stations Details') {
                      if (this.props.selectedRest.length) {
                        this.props.removeSelectedRest();
                      }
                      this.props.selectSta(feature.attributes, true);
                      this.props.clickMapSta(true);
                    } else if (feature.layer.title === 'Restaurant Results') {
                      this.props.selectRest(feature.attributes, true);
                    } else if (feature.layer.title === 'Selected Restaurant') {
                      // if selected rest pin clicked, it sb "deselected"; this empties info, & the change triggers the yellow pin layer's removal below
                      this.props.removeSelectedRest();
                    }
                  } else if (!response.results.length) {
                    //so the selected rest pin layer is removed (below)
                    if (this.props.selectedRest.length) {
                      this.props.removeSelectedRest();
                    }
                  }
                  //end hitTest
                });
                //end clickHandler
              };
              mapClickListener = this._view.on(
                'immediate-click',
                mapClickHandler
              );
              //end whenLayerView
            })
            .catch(err => {
              console.log(err);
            });

          setGraphics(this.props.searchResults)
            .then(graphicsArr => {
              let resultsLayer = loadDataLayer(graphicsArr);
              return resultsLayer;
            })
            .then(resultsLayer => this._view.map.add(resultsLayer))
            .then(() =>
              this._view.goTo({ center: this.props.selectedSta.coords })
            )
            .catch(err => {
              console.log(err);
            });
          //end this._view
        }
        //end setTimeout
      }, 200);
      //end this.props.data
    }

    //selectedRestId used bc selectedRest[0].id not directly accessible; need to use arr so can re-use setGraphics func
    // note that this doesn't remove currSelectedRestLayer if it is re-clicked
    if (this.props.selectedRestId !== prevProps.selectedRestId) {
      setTimeout(() => {
        if (this._view) {
          let selectedRestLayer = this._view.map.layers.find(layer => {
            return layer.title === 'Selected Restaurant';
          });
          if (selectedRestLayer) {
            this._view.map.remove(selectedRestLayer);
          }
          setGraphics(this.props.selectedRest)
            .then(graphicsArr => {
              let selectedRestLayer = loadDataLayer(graphicsArr, 'yellow');
              return selectedRestLayer;
            })
            .then(selectedRestLayer => {
              this._view.map.add(selectedRestLayer);
            })
            .catch(err => {
              console.log(err);
            });
          //end this._view
        }
      }, 200);
    }

    // this section carries out actions that can be triggered by multiple events: click, search box input, & mouseover
    // this condition includes initial load of Roosevelt sta
    if (
      this.props.selectedSta.station_id !== prevProps.selectedSta.station_id
    ) {
      console.log('CDU station_id running');
      setTimeout(() => {
        if (this._view) {
          const staLayer = this._view.map.layers.find(layer => {
            return layer.title === 'CTA Stations Details';
          });
          const restLayer = this._view.map.layers.find(layer => {
            return layer.title === 'Restaurant Results';
          });
          // only removes existing results layer if station id change NOT on initial load
          if (restLayer && this.props.selectedStaId) {
            this._view.map.remove(restLayer);
          }
          const selectedRestLayer = this._view.map.layers.find(layer => {
            return layer.title === 'Selected Restaurant';
          });
          if (selectedRestLayer) {
            this._view.map.remove(selectedRestLayer);
          }
          // only initiates API call if station id change NOT on initial load
          if (this.props.selectedStaId) {
            let longitude = this.props.selectedSta.coords[0];
            let latitude = this.props.selectedSta.coords[1];
            this.props.getRestData(latitude, longitude);
          }
          this._view
            .whenLayerView(staLayer)
            .then(layerView => {
              console.log('LAYERVIEW 2', layerView);
              if (highlight) {
                highlight.remove();
              }
              //     // highlight point of selected station (initial selection or when selected via Search, NOT map click--that's in hitTest)
              let query = staLayer.createQuery();
              let queryString = `STATION_ID = ${this.props.selectedSta.station_id}`;
              query.where = queryString;
              staLayer.queryFeatures(query).then(result => {
                highlight = layerView.highlight(result.features);
              });
              //     //whenLayerView--staLayer
            })
            .catch(err => {
              console.log(err);
            });

          //this._view
        }
      }, 200);
      //props.selectedSta
    }
    if (this.props.zoomToStaVar !== prevProps.zoomToStaVar) {
      //delay nec to capture view
      setTimeout(() => {
        if (this._view) {
          this._view.goTo({ center: this.props.selectedSta.coords, zoom: 15 });
        }
      });
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
