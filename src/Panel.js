import React, { Component, Fragment } from 'react';
import { createLineSquares } from './utils/helpers.js';
import Search from './Search';
import List from './List';
// import ListItem from './ListItem';
import './Panel.css';
//renders HTML string in React
import parse from 'html-react-parser';

class Panel extends Component {
  render() {
    const {
      selectSta,
      selectedSta,
      selectedRestId,
      items,
      mapLoaded,
      selectRest,
      removeSelectedRest,
      zoomToSta,
      restSelectedOnMap,
    } = this.props;

    let colorSquaresStr;

    if (selectedSta.lines.length) {
      colorSquaresStr = createLineSquares(selectedSta.lines);
    }

    let lineQty = selectedSta.lines.split(', ').length > 1 ? 'lines' : 'line';

    return (
      <Fragment>
        <div className="Panel--wrapper">
          <Search selectSta={selectSta} />

          {mapLoaded && (
            <div className="Results--wrapper">
              <div className="Station--wrapper">
                <div className="panel modifier-class">
                  <div className="Station--header">
                    <div className="Station--name">
                      <h4>{selectedSta.shortname}</h4>
                    </div>
                    <div className="Station--squares-wrapper">
                      <a
                        className="tooltip tooltip-top modifier-class"
                        aria-label={`${selectedSta.lines} ${lineQty}`}
                      >
                        <div className="Station--squares">
                          {selectedSta.lines.length && parse(colorSquaresStr)}
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="Station--details">
                    <p className="trailer-0 text-light">
                      {selectedSta.address}
                    </p>
                    <div
                      className="Station--details-zoom esri-icon-zoom-in-magnifying-glass text-light"
                      onClick={zoomToSta}
                    ></div>
                  </div>
                </div>
              </div>
              {items && (
                <List
                  items={items}
                  selectedRestId={selectedRestId}
                  selectRest={selectRest}
                  removeSelectedRest={removeSelectedRest}
                  restSelectedOnMap={restSelectedOnMap}
                />
              )}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default Panel;
