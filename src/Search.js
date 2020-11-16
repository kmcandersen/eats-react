import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Search.css';
import { station_list } from './utils/station_list';

class Search extends Component {
  addLineName = el => {
    let hyphenLine = `- ${el.LINE_LIST}`;
    return `${el.SHORTNAME} ${el.DUP_NAME ? hyphenLine : ''}`;
  };
  render() {
    return (
      <div className="Search--wrapper">
        <Autocomplete
          id="combo-box-demo"
          options={station_list}
          getOptionLabel={option => `${this.addLineName(option)}`}
          renderOption={option => (
            <React.Fragment>
              <span>{this.addLineName(option)}</span>
            </React.Fragment>
          )}
          style={{
            width: '90%',
          }}
          renderInput={params => (
            <TextField
              {...params}
              label="Enter station name"
              variant="outlined"
            />
          )}
        />
      </div>
    );
  }
}

export default Search;
