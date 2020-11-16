import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Search.css';
import { station_list } from './utils/station_list';

class Search extends Component {
  state = {
    optionStaInfo: null,
  };

  handleChange = (event, newValue) => {
    this.setState({ optionStaInfo: newValue }, () => {
      // newValue = array of objects given by Autocomplete options property
      this.props.selectSta(this.state.optionStaInfo);
    });
  };
  render() {
    return (
      <div className="Search--wrapper">
        <Autocomplete
          id="combo-box-demo"
          options={station_list}
          getOptionLabel={option => option.SHORTNAME}
          renderOption={option => option.SHORTNAME}
          style={{
            width: '90%',
          }}
          onChange={this.handleChange}
          name="optionStaInfo"
          value={this.state.optionStaInfo}
          renderInput={params => (
            <TextField
              {...params}
              label="Enter or select station name"
              variant="outlined"
            />
          )}
        />
      </div>
    );
  }
}

export default Search;
