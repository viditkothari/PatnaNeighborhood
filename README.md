# Neighborhood Map Project
Developed using Google Map API & React, the initial location data is being fetched from [Foursquare API](#thirt-party-apis). Location can be filtered from the text input filter & the text will update the markers & listings. Also, details about each can be seen by clicking/tapping on the marker or select one of the listed places.

## Getting Started

You need to set up the application before you can see it running live in your browser.
Please check the [installation](#how-to-launch-the-app-locally) section to know more.

## Folder Structure
Your project folder should look like this:
```
├── README.md - 
├── package.json # npm package file
├── .eslintrc.json # ESlint configs
├── public
│   ├── index.html
│   ├── manifest.json # Used in mobile when someone chooses to 'Add webpage to homescreen'
│   ├── favicon.ico # Custom Map Icon in .ico file format
│   ├── favicon.png # Custom Map Icon in .png file format (backup)
│   ├── marker.png
│   ├── marker.svg
│   └── close.png
└── src
    └── components
        └── Header
            └── Header.js
            └── Toggle.js
        └── Search
            └── Filter.js
            └── GoogleMap.js # React Map component
            └── PlaceList.js # React place list component
            └── Search.js
        └── index.js # for DOM rendering
    ├── App.css # Styles
    ├── App.js # Root
    ├── registerSW.js # ServiceWorker
    ├── index.css # Global Styling

```

## How to launch the app locally?

### Installation

1. Clone OR Download & extract the Project
2. `CD` / Go into the directory
Then in either a Terminal / Shell / Command-Prompt
3. Enter `npm install` to install the dependencies
4. Enter `npm start` to start the app
```
The application will launch & run at http://localhost:8000
```

## Highlights
![image](http://vidit.co.in/neighborhood/img_1.jpg)
![image](http://vidit.co.in/neighborhood/img_2.jpg)
![image](http://vidit.co.in/neighborhood/img_3.jpg)

## 3rd Party APIs
* Foursquare API: Loading the neighbouring locations for the given lattitude & longitude from this API. The places received are shown in the place listing.
```
Foursquare API URL: "https://api.foursquare.com/v2/venues/search?ll=25.6020106,85.11038&client_id=<YOUR_CLIENT_ID>&client_secret=<YOUR_CLIENT_SECRET>&limit=21&v=20180707"

I am calling this 'Patna Darshan' so I've used the coordinate of Patna, Bihar, India 25.6020106° N, 85.11038° E
```

* Wiki API
Fetching the wiki data using its API for each place when the corresponding marker is clicked.
```
Wiki API URL: "https://en.wikipedia.org/w/api.php"
```

## References & resources
- [All aria-* attribute](https://www.w3.org/TR/wai-aria-1.1/)
- [WebAIM Checklist for Accessibility](https://webaim.org/standards/wcag/checklist)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Maps JavaScript API Reference](https://developers.google.com/maps/documentation/javascript/reference)
- [Google Maps Infowindow](https://developers.google.com/maps/documentation/javascript/infowindows)
- [MediaWiki API](https://en.wikipedia.org/w/api.php)
- [Foursquare API](https://developer.foursquare.com/)
- [Google Map & React](https://stackoverflow.com/questions/34779489/rendering-a-google-map-without-react-google-map)
- [react-throttle](https://github.com/gmcquistin/react-throttle)
- [Refs in React](https://reactjs.org/docs/refs-and-the-dom.html)
- [React componentDidUpdate lifecycle](https://reactjs.org/docs/react-component.html)