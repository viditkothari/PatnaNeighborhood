import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
  // Add PropTypes validation
  static propTypes = {
    updateQuery: PropTypes.func.isRequired,
  }

  // App's internal state
  state = {
    inputValue: '',
  }

  updateInput = (inputValue) => {
    this.setState({ inputValue });
  }

  render() {
    const { inputValue } = this.state;
    const { updateQuery } = this.props;
    return (
      <div>
        <input
          id="filter-text"
          type="text"
          role="search"
          placeholder="Search places"
          value={inputValue}
          onChange={(event) => {
            this.updateInput(event.target.value);
            updateQuery(event.target.value);
          }}
        />
        <button id="filter-help">Filter</button>
      </div>
    );
  }
}

export default Filter;