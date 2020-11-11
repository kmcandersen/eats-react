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

  // ** single click = multiple "response.results"

  componentDidUpdate(prevProps) {
    // data = none, searchResults, or Bookmarks
    if (this.props.data !== prevProps.data) {
      //delay nec to capture view
      setTimeout(() => {
        if (this._view) {
          let restLayer = this._view.map.layers.getItemAt(2);

          if (restLayer && this.props.selectedStaId) {
            this._view.map.remove(restLayer);
          }
          const staLayer = this._view.map.layers.getItemAt(1);
          this._view.whenLayerView(staLayer).then(layerView => {
            console.log('LAYERVIEW', layerView);
            this.props.onMapLoad(true);

            // mapClickHandler/hitTest takes clicks & changes appropriate state. Other CDU conditions modify layers accordingly
            const mapClickHandler = event => {
              this._view.hitTest(event).then(response => {
                if (response.results.length) {
                  console.log('response.results', response.results);
                  const feature = response.results[0].graphic;
                  if (feature.layer.title === 'CTA Stations Details') {
                    if (this.props.selectedRest.length) {
                      this.props.removeSelectedRest();
                    }
                    this.props.selectSta(feature.attributes);
                  } else if (feature.layer.title === 'Restaurant Results') {
                    this.props.selectRest(feature.attributes);
                  } else if (feature.layer.title === 'Selected Restaurant') {
                    // if selected rest pin clicked, it sb "deselected"; this empties info, & the change triggers the yellow pin layer's removal below
                    this.props.removeSelectedRest();
                  }
                } else if (!response.results.length) {
                  //removes the selected rest pin layer?
                  if (this.props.selectedRest.length) {
                    this.props.removeSelectedRest();
                  }
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

    // actions can't be only on hitTest bc rest_id could change via panel item click/hover
    //selectedRestId used bc selectedRest[0].id not directly accessible; need to use arr so can re-use setGraphics func
    // note that this doesn't remove currSelectedRestLayer if it is re-clicked
    // ** acct for if new selectedRestId is 0
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
            });
          //end this._view
        }
      }, 200);
    }

    // this section incl actions that can be triggered by multiple events: click, search box input, & mouseover
    if (
      // this condition includes initial load of Roosevelt sta
      this.props.selectedSta.station_id !== prevProps.selectedSta.station_id
    ) {
      setTimeout(() => {
        if (this._view) {
          // index of stations layer:
          const staLayer = this._view.map.layers.getItemAt(1);
          //seems more reliable but layerView not found initially:
          // const staLayer = this._view.map.layers.find(layer => {
          //   return layer.title === 'CTA Stations Details';
          // });
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
          this._view.whenLayerView(staLayer).then(layerView => {
            if (highlight) {
              highlight.remove();
            }
            // highlight point of selected station (initial selection or when selected via Search, NOT map click--that's in hitTest)
            let query = staLayer.createQuery();
            let queryString = `STATION_ID = ${this.props.selectedSta.station_id}`;
            query.where = queryString;
            staLayer.queryFeatures(query).then(result => {
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
