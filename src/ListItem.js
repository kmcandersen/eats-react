import React, { Component } from 'react';

class ListItem extends Component {
  render() {
    const {
      image_url,
      url,
      name,
      address,
      city,
      category1,
      category2,
    } = this.props.item;

    //if there's a 2nd category, append it to the 1st category
    let categories = category2 ? `${category1}, ${category2}` : `${category1}`;

    return (
      <div className="ListItem--wrapper">
        <div className="card card-wide">
          <figure className="card-wide-image-wrap">
            <img className="card-wide-image" src={image_url} alt={name} />
          </figure>
          <div className="ListItem card-content">
            <h5 className="trailer-half">
              <a href={url}>{name}</a>
            </h5>
            <p className="font-size--1 trailer-half">
              {address}
              {city !== 'Chicago' && `, ${city}`}
            </p>

            <p className="font-size--1 trailer-half">{categories}</p>

            <div className="ListItem--bottom-row">
              <div>
                <span className="icon-ui-favorites icon-ui-yellow icon-ui-flush"></span>
                <span className="icon-ui-favorites icon-ui-yellow icon-ui-flush"></span>
                <span className="icon-ui-favorites icon-ui-yellow icon-ui-flush"></span>
                <span className="icon-ui-favorites icon-ui-gray icon-ui-flush"></span>
                <span className="icon-ui-favorites icon-ui-gray icon-ui-flush"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListItem;
