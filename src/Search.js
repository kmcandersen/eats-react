import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
  render() {
    return (
      <div className="Search--wrapper">
        <form>
          <label>
            Search by station name
            <input
              type="text"
              placeholder="enter a station name"
              className="modifier-class input-search"
            />
            {/* input-error class */}
            {/* <div class="input-error-message is-active">
              No results--please try again
            </div> */}
          </label>
        </form>
      </div>
    );
  }
}

export default Search;
