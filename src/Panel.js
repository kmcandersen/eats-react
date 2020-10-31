import React, { Component, Fragment } from 'react';
import ListItem from './ListItem';
import './Panel.css';

class Panel extends Component {
  render() {
    const { selectedSta, items } = this.props;
    return (
      <Fragment>
        <div className="Panel--wrapper">
          <div className="Station--wrapper">
            <div className="panel modifier-class">
              <h4 className="trailer-half">{selectedSta.name}</h4>
              <p className="trailer-0">{selectedSta.address}</p>
            </div>
          </div>
          {items && (
            <div className="List--wrapper">
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
