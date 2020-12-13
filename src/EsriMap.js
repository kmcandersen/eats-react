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
      // adjusts station symbol size at scale breakpoints **effect on performance?
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
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidUpdate(prevProps) {
    // if (this.props.data === 'searchResults' && prevProps.data === 'none') {
    if (this.props.searchResults !== prevProps.searchResults) {
      setTimeout(() => {
        if (this._view) {
          //so click listeners don't accumulate with ea Update & run multiple times
          if (mapClickListener) {
            mapClickListener.remove();
          }

          // .find layers is flexible but doesn't work here 100%
          const staLayer = this._view.map.layers.getItemAt(1);

          const restLayer = this._view.map.layers.find(layer => {
            return layer.title === 'Restaurant Results';
          });
          if (restLayer && this.props.selectedStaId) {
            this._view.map.remove(restLayer);
          }
          const selectedRestLayer = this._view.map.layers.find(layer => {
            return layer.title === 'Selected Restaurant';
          });
          if (selectedRestLayer) {
            this._view.map.remove(selectedRestLayer);
          }

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
          mapClickListener = this._view.on('immediate-click', mapClickHandler);
          this._view.whenLayerView(staLayer).then(layerView => {
            let query = staLayer.createQuery();
            let queryString = `STATION_ID = ${this.props.selectedSta.station_id}`;
            query.where = queryString;
            staLayer
              .queryFeatures(query)
              .then(result => {
                if (highlight) {
                  highlight.remove();
                }
                highlight = layerView.highlight(result.features);
              })
              .catch(err => {
                console.log(err);
              });

            setGraphics(this.props.searchResults)
              .then(graphicsArr => {
                let resultsLayer = loadDataLayer(graphicsArr);
                return resultsLayer;
              })
              .then(resultsLayer => {
                this._view.map.add(resultsLayer);
                this.props.onMapLoad(true);
              })
              .then(() =>
                this._view.goTo({ center: this.props.selectedSta.coords })
              )
              .catch(err => {
                console.log(err);
              });

            //end whenLayerView
          });
          //end this.view
        }
        //end setTimeout
      }, 500);
    }

    // triggered by map click OR Search
    if (
      this.props.selectedSta.station_id !== prevProps.selectedSta.station_id
    ) {
      if (this.props.selectedStaId) {
        let longitude = this.props.selectedSta.coords[0];
        let latitude = this.props.selectedSta.coords[1];
        this.props.getRestData(latitude, longitude);
      }
    }

    //selectedRestId used bc selectedRest[0].id not directly accessible; need to use arr so can re-use setGraphics func
    // note that this doesn't remove currSelectedRestLayer if it is re-clicked
    if (this.props.selectedRestId !== prevProps.selectedRestId) {
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
    }

    // click zoom on station in List panel
    if (this.props.zoomToStaVar !== prevProps.zoomToStaVar) {
      if (this._view) {
        this._view.goTo({ center: this.props.selectedSta.coords, zoom: 15 });
      }
    }
  }

  calcMapSize = () => {
    this.setState({
      mapHeight: window.innerHeight - 60 + 'px',
    });
  };

  render() {
    const { mapHeight } = this.state;
    return (
      <div className="Map--wrapper" style={{ height: mapHeight, width: '65%' }}>
        <div className="Map--map" ref={this.mapDiv}>
          <div
            className={`${!this.props.mapLoaded && 'loading-spinner'}`}
          ></div>
        </div>
      </div>
    );
  }
}

export default EsriMap;
