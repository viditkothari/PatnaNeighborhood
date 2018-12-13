import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import PropTypes from 'prop-types';

class GoogleMap extends Component {
  /**
   * Creating markers on the map
   * @param:
   *      place (data type: object): location detail of the place
   *      map (data type: object): Google map object
   *      i (data type: integer): index of the place in the location array
   * @returns:
   *      marker(data type: object): new Google Marker object for given place
   */
  static mapMarkerToMap(place, map, i) {
    // Extracting 1st letter from the place-name & using it as the marker's label
    const label = place.name[0];
    const marker = new window.google.maps.Marker({
      map,
      position: { lat: place.location.lat, lng: place.location.lng },
      title: place.name,
      animation: window.google.maps.Animation.DROP,
      id: i,
      label,
    });
    return marker;
  }

  /**
   * Populating the infowindow with wiki link about the place
   * when the marker is clicked. We use use fetch API to get data from
   * Wiki API endpoints. It opens and anchores clicked the marker.
   * @param:
   *      marker(data type: object): marker object for the selected/clicked place
   *      map (data type: object): Google map object
   *      infowindow (data type: object): Google infowindow object from app's state
   * @returns:
   *      None
   */
  static populateInfoWindow = (map, marker, infowindow) => {
    if (infowindow.getPosition() !== marker.position) {
      if (infowindow.marker) {
        infowindow.marker.setAnimation(null);
      }

      // Animate the marker clicked or place selcted from the place list
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      infowindow.marker = marker;
      infowindow.setContent(`<div>${marker.title}</div>`);
      infowindow.open(map, marker);
      /**
       * Make sure the marker property is cleared if the infowindow is closed.
       * Also reset the position of the infowindow
       */
      infowindow.addListener('closeclick', () => {
        infowindow.setPosition(null);
        marker.setAnimation(null);
      });

      // Fetch the third party wiki api data for the given place to show inside infowindow
      GoogleMap.fetchWikiData(marker, infowindow);
    }
  };

  /**
   * This function is used to make asynchronous call to Wiki API and
   * We use use fetch API to get data and populate the infowindow with the data
   * also it shows error message in infowindow if API call fails
   * @param:
   *      marker(data type: object): marker object for the selected/clicked place
   *      infowindow (data type: object): Google infowindow object from app's state
   * @returns:
   *      None
   */
  static fetchWikiData = (marker, infowindow) => {
    const address = marker.title;
    // Wiki fetch API url
    const wikiURL = `https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&format=json&search=${address}`;
    // HTML block for the content to be shown inside infowindow
    let wikiElement = `<div class="infowindow" tabindex="0" role="dialog" aria-labelledby="infowindow-help">
      <h2>${address}</h2>
      <p id="infowindow-help">Relevant Wikipedia Links</p>
    <ul>`;

    // fetch API call to retrieve data from Wikipedia
    fetch(wikiURL)
      .then(response => response.json())
      .then((data) => {
        // Check if the response is an error object
        if (data.error && data.error.code && data.error.info) {
          throw data.error.info;
        }
        for (let i = 0; i < data.length; i += 1) {
          // Build the content of infowindow
          wikiElement += data[i].length
            ? `<li class="infowindow-item">
                <a target ="_blank" href=http://en.wikipedia.org/wiki/${data[i]}>
                  ${data[i]}
                </a>
            </li>`
            : '';
        }
        wikiElement += '</ul></div>';
        // Set the content for infowindow
        infowindow.setContent(wikiElement);
      })
      // Catch any error in the Fetch API or javascript error
      .catch((error) => {
        wikiElement += `<p class='error' style='color:red'>${error}</p></ul></div>`;
        // Set the error content for infowindow if anything fails
        infowindow.setContent(wikiElement);
      });
  };

  // Add PropTypes validation
  static propTypes = {
    locations: PropTypes.instanceOf(Array).isRequired,
    filterText: PropTypes.string.isRequired,
    selectedPlaceTitle: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.myMapContainer = React.createRef();
  }

  // App's state
  state = {
    map: null,
    largeInfoWindow: null,
    markers: [],
  }

  /**
   * This runs immediate after the component output has been rendered in the DOM.
   */
  componentDidMount() {
    window.initMap = this.initMap;
    window.googleError = this.googleError;
    // If Google map is already available, invoke the initMap()
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
      this.initMap();
    } else {
      // Invoke this method to put the async googleapi script in the DOM
      this.loadGoogleMapAPIJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyB0cPTa_Cx_ajI72lHP0Z9II4sve1aEO60&callback=initMap');
    }
  }

  /**
   * This method is invoked immediately after updating occurs; not called for the initial render.
   * You may call setState() immediately in componentDidUpdate() but it must be wrapped in a condition.
   */
  componentDidUpdate(prevProps) {
    // destructure the props object into individual variables
    const { filterText, selectedPlaceTitle, locations } = this.props;
    // destructure the app's state object into individual variables
    const { map } = this.state;
    // Invoke the filterMarkerOnMap() if the props is changed
    if (filterText !== prevProps.filterText) {
      this.setState({ markers: this.filterMarkerOnMap(filterText) });
    }
    // Invoke the animateSelectedPlaceOnMap() whenever a new place is selected/clicked
    if (selectedPlaceTitle !== prevProps.selectedPlaceTitle) {
      this.setState({ markers: this.animateSelectedPlaceOnMap(selectedPlaceTitle) });
    }
    // Invoke the loadMarkers() once the location data is updated in parent component
    if (locations.length && (locations !== prevProps.locations)) {
      if (map && !filterText) {
        this.loadMarkers();
      }
    }
  }

  /**
   * Creating & adding googlemapapis script tag into the DOM
   * @param:
   *      src(data type: string): script href tag value
   * @returns:
   *      None
   */
  loadGoogleMapAPIJS = (src) => {
    const ref = window.document.getElementsByTagName('script')[0];
    const script = window.document.createElement('script');
    script.src = src;
    script.setAttribute('onerror', 'googleError()');
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  /**
   * A Google map callback method once map api is loaded successfully
   * @param:
   *      None
   * @returns:
   *      None
   */
  initMap = () => {
    console.log("hi callback init");
    const { locations } = this.props;
    // Create google map instance to be added to the DOM
    const map = new window.google.maps.Map(this.myMapContainer.current, {
      center: { lat: 26.996471, lng: 75.876472 },
      zoom: 6,
    });

    // Create google map infowindow instance to be added to the DOM
    const largeInfoWindow = new window.google.maps.InfoWindow();
    // Update the app's state object wirh map, largeInfoWindow property
    this.setState({ map, largeInfoWindow });
    /**
     * This extra check is to make sure we have the location data
     * ready before calling the loadMarkers() method.
     */
    if (locations.length) {
      this.loadMarkers();
    }
  }

  /**
   * This function is Google map callback method for unwanted map error
   * @param:
   *      None
   * @returns:
   *      None
   */
  googleError = () => {
    const content = window.document.getElementById('map-error');
    content.hidden = false;
    window.document.getElementById('map').appendChild(content);
  }

  /**
   * This filters only the selected place from location list & sets the Animation property
   * of the specific marker in the app's markers array state property
   * @param:
   *      placeTitle(data type: string): place name for the selected/clicked place
   * @returns:
   *      markers(data type: array): updated markers array
   */
  animateSelectedPlaceOnMap = (placeTitle) => {
    // destructure the app's state object into individual variables
    const { map, markers, largeInfoWindow } = this.state;

    // Loop through markers array to find the impacted marker
    for (let i = 0; i < markers.length; i += 1) {
      if (placeTitle === markers[i].title) {
        // set the animation for the selected marker
        markers[i].setAnimation(window.google.maps.Animation.BOUNCE);
        // Open the infowindow for the selected marker
        GoogleMap.populateInfoWindow(map, markers[i], largeInfoWindow);
      } else {
        // set the animation for the mis matched markers to null
        markers[i].setAnimation(null);
      }
    }
    // Return the updated markers array
    return markers;
  };

  /**
   * This filters markers on the Map for the given input text & sets the map property
   * of the miss-matched markers to null so that it won't appear on the map.
   * @param:
   *      filterText(data type: string): marker object for the selected/clicked place
   * @returns:
   *      markers(data type: array): updated markers array
   */
  filterMarkerOnMap = (filterText) => {
    // destructure the app's state object into individual variables
    const { map, markers } = this.state;
    // Generate the RegEx for user input text
    const match = new RegExp(escapeRegExp(filterText.trim()), 'i');
    // Loop through markers array to find the impacted marker
    for (let i = 0; i < markers.length; i += 1) {
      // filter the markers based on input text against marker's title
      if (match.test(markers[i].title)) {
        markers[i].setMap(map);
      } else {
        // set the map for the mis matched markers to null
        markers[i].setMap(null);
      }
    }
    // Return the updated markers array
    return markers;
  }

  /**
   * This function adds markers to the map during initial load as wel as
   * updates the markers on map durion place search.
   * @param:
   *      None
   * @returns:
   *      None
   */
  loadMarkers = () => {
    // destructure the app's state object into individual variables
    const { map, largeInfoWindow, markers } = this.state;
    const { locations } = this.props;

    // create new map bound instance
    const bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < locations.length; i += 1) {
      // Create a marker per location, and put into markers array.
      const marker = GoogleMap.mapMarkerToMap(locations[i], map, i);
      markers.push(marker);
      /**
       * Create an onclick event to open an infowindow at each marker.
       * Using closure to make marker available in callbacks
       */
      marker.addListener('click', () => (function captureMarker() {
        GoogleMap.populateInfoWindow(map, marker, largeInfoWindow);
      }(marker)));
      bounds.extend(marker.position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
  }

  render() {
    return (
      <section id="maptab" role="application">
        {/* To be used to render the map by Google Map's initMap() callback */}
        <div ref={this.myMapContainer} id="map" aria-label="Places on Map" aria-describedby="map-help" />
        {/* Credits: Foursquare API. */}
        <div id="map-help">
          <p>
            Map showing the places as per the
            <a target="_blank" rel="noopener noreferrer" href="https://developer.foursquare.com/">
              <span> Foursquare API</span>
            </a>
          </p>
        </div>
        {/* HTML block for googleError callback method by Google Map's onerror attribute */}
        <div id="map-error" aria-label="Can not load the Map" hidden>
          <p>
            <span className="error">
              "This page can not load Google Maps correctly."
            </span>
            <br />
            <em>
              Google Map API now requires the use of a valid API Key.
            </em>
            <br />
            <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">
              Go get one!
            </a>
          </p>
        </div>
      </section>
    );
  }
}

export default GoogleMap;