import React, { Component, Fragment } from 'react';
import { createLineSquares } from './utils/helpers.js';
import ListItem from './ListItem';
import Search from './Search';
import './Panel.css';
//renders HTML string in React
import parse from 'html-react-parser';

class Panel extends Component {
  state = {
    listHeight: 0,
  };

  componentDidMount = () => {
    this.getListHeight();
    window.addEventListener('resize', () => {
      this.getListHeight();
    });
  };

  getListHeight = () => {
    //header + search + station
    let elsHeight = 60 + 110 + 100;
    let listHeight = window.innerHeight - elsHeight;
    this.setState({
      listHeight: listHeight,
    });
  };

  render() {
    const { selectedSta, items } = this.props;

    let colorSquaresStr;

    if (selectedSta.lines.length) {
      colorSquaresStr = createLineSquares(selectedSta.lines);
    }

    return (
      <Fragment>
        <div className="Panel--wrapper">
          <Search />
          <div className="Station--wrapper">
            <div className="panel modifier-class">
              <div className="Station--header">
                <div className="Station--name">
                  <h4>{selectedSta.name}</h4>
                </div>
                <div className="Station--squares">
                  {selectedSta.lines.length && parse(colorSquaresStr)}
                </div>
              </div>

              <p className="trailer-0 text-light">{selectedSta.address}</p>
            </div>
          </div>
          {items && (
            <div
              className="List--wrapper"
              style={{ height: this.state.listHeight, overflow: 'scroll' }}
            >
              {items.map(item => (
                <ListItem item={item} key={item.id} />
              ))}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default Panel;
