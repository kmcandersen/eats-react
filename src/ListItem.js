import React, { Component } from 'react';
import { createStarString } from './utils/helpers.js';
import './ListItem.css';
//renders HTML string in React
import parse from 'html-react-parser';

class ListItem extends Component {
  render() {
    const {
      id,
      image_url,
      url,
      name,
      rating,
      address,
      city,
      category1,
      category2,
      distanceStr,
    } = this.props.item;

    //if there's a 2nd category, append it to the 1st category
    let categories = category2 ? `${category1}, ${category2}` : `${category1}`;

    //if city isn't Chicago, display city
    let fullAddress = city !== 'Chicago' ? `${address}, ${city}` : `${address}`;

    let starString = createStarString(rating);

    let selectedRest = this.props.selectedRestId === id ? true : false;

    return (
      <div className="ListItem--wrapper" data-id={id}>
        <div className="card card-wide">
          <figure className="card-wide-image-wrap">
            <img className="card-wide-image" src={image_url} alt={name} />
          </figure>
          <div
            className={`ListItem--content card-content ${
              selectedRest && 'ListItem--selected'
            }`}
          >
            <h5 className="trailer-half">
              <a href={url}>{name}</a>
            </h5>
            <p className="font-size--1 trailer-half">{fullAddress}</p>

            <p className="font-size--1 trailer-half text-light">{categories}</p>

            <div className="ListItem--bottom-row">
              <div className="ListItem--stars">{parse(starString)}</div>
              <div className="ListItem--rating">
                <p className="font-size--1 trailer-half">{distanceStr}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListItem;
