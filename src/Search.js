import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Search.css';
import { station_list } from './utils/station_list';

class Search extends Component {
  state = {
    optionStaInfo: null,
  };

  componentDidUpdate(prevProps) {
    // when new sta selected on map, state.clickedMapSta (App) becomes true & search box is emptied of previously-searched sta
    if (this.props.clickedMapSta && !prevProps.clickedMapSta) {
      this.setState({ optionStaInfo: null });
    }
  }

  handleChange = (event, newValue) => {
    this.setState({ optionStaInfo: newValue }, () => {
      // newValue = array of objects given by Autocomplete options property
      this.props.selectSta(this.state.optionStaInfo);
      this.props.clickMapSta(false);
    });
  };

  render() {
    return (
      <div className="Search--wrapper">
        <Autocomplete
          id="combo-box-demo"
          options={station_list}
          getOptionLabel={option => option.DISPLAY_NAME}
          renderOption={option => option.DISPLAY_NAME}
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
