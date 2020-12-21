import React, { Component, Fragment } from 'react';
import { createLineSquares } from './utils/helpers.js';
import Search from './Search';
import List from './List';
import './Panel.css';
//renders HTML string in React
import parse from 'html-react-parser';

class Panel extends Component {
  render() {
    const {
      selectSta,
      selectedSta,
      clickMapSta,
      clickedMapSta,
      selectedRestId,
      items,
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

    let displayAddress =
      selectedSta.city !== 'Chicago'
        ? `${selectedSta.address}, ${selectedSta.city}`
        : `${selectedSta.address}`;

    let isMobile = window.innerWidth < 768;

    return (

      <Fragment>
        <div className="Panel--wrapper">
          <Search
            selectSta={selectSta}
            clickedMapSta={clickedMapSta}
            clickMapSta={clickMapSta}
          />

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
                  <p className="trailer-0 text-light">{displayAddress}</p>
                  {!isMobile &&
                    <div
                      className="Station--details-zoom esri-icon-zoom-in-magnifying-glass text-light"
                      onClick={zoomToSta}
                    ></div>
                  }
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
        </div>
      </Fragment>
    );
  }
}

export default Panel;
