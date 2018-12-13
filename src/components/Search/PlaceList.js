import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Define values for keycodes
const KEY_ENTER = 13;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

class PlaceList extends Component {
  // Helper function converting NodeLists to Arrays
  static slice = nodes => Array.prototype.slice.call(nodes);

  // Adding PropType validation
  static propTypes = {
    locations: PropTypes.instanceOf(Array).isRequired,
    selectPlace: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.refList = React.createRef();
  }

  state = {
    buttons: [],
    focusedIDx: 0,
    focusedButton: {},
  }

  componentDidUpdate(prevProps) {
    const { locations } = this.props;
    if (locations.length > 0 && prevProps.locations !== locations) {
      this.manageFocus();
    }
  }

  manageFocus() {
    const el = this.refList.current;
    const buttons = PlaceList.slice(el.childNodes);
    const focusedIDx = 0;
    const focusedButton = buttons[focusedIDx];

    let firstButton = true;
    for (const button of buttons) {
      if (firstButton) {
        button.tabIndex = '0';
        firstButton = false;
      } else {
        button.tabIndex = '-1';
      }
    }
    this.setState({ buttons, focusedIDx, focusedButton });
  }

  handleKeyDown(e) {
    const { selectPlace } = this.props;
    const { buttons } = this.state;
    let { focusedIDx } = this.state;
    switch (e.keyCode) {
      case KEY_UP:
      case KEY_LEFT: {
        e.preventDefault();
        focusedIDx -= 1;
        if (focusedIDx < 0) {
          focusedIDx += buttons.length;
        }
        break;
      }
      case KEY_DOWN:
      case KEY_RIGHT: {
        e.preventDefault();
        focusedIDx = (focusedIDx + 1) % buttons.length;
        break;
      }
      case KEY_ENTER:
      case KEY_SPACE: {
        e.preventDefault();
        const focusedButton = e.target;
        focusedButton.style.background = '#454545';
        const IDx = buttons.indexOf(focusedButton);
        if (IDx < 0) {
          return;
        }
        focusedIDx = IDx;
        selectPlace(e.target.innerText);
        break;
      }
      default:
        return;
    }
    this.changeFocus(buttons, focusedIDx);
  }

  handleClick(e) {
    const { buttons } = this.state;
    let { focusedIDx } = this.state;
    const button = e.target;
    button.style.background = '#454545';
    const IDx = buttons.indexOf(button);
    if (IDx < 0) {
      return;
    }
    focusedIDx = IDx;

    this.changeFocus(buttons, focusedIDx);
  }

  changeFocus(buttons, focusedIDx) {
    const { focusedButton } = this.state;
    // Setting the old button to tabindex -1
    focusedButton.tabIndex = -1;
    focusedButton.setAttribute('aria-selected', false);
    focusedButton.style.background = 'black';

    // Setting the new button to tabindex 0 & focus it
    const newButton = buttons[focusedIDx];
    newButton.tabIndex = 0;
    newButton.focus();
    newButton.setAttribute('aria-selected', true);
    newButton.style.background = '#454545';

    this.setState({ focusedButton: newButton, focusedIDx });
  }
  
  render() {
    const { locations, selectPlace } = this.props;
    return (
      <ul ref={this.refList} id="places-list" role="listbox" className="listbox">
        {locations.map((location, index) => (
          <li
            key={location.id}
            id={`mi-${index}`}
            className="places-list-item"
            role="option"
            aria-selected="false"
            onClick={(event) => { this.handleClick(event); selectPlace(event.target.innerText); }}
            onKeyDown={(event) => { this.handleKeyDown(event); }}
          >
            {location.name}
          </li>
        ))}
      </ul>
    );
  }
}

export default PlaceList;