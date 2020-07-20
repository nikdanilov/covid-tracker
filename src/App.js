import React, { Component } from 'react';
import { Map, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import data from './data'

class App extends Component {

  componentDidMount() {
    var ZIP_CODE = "L5W 1N4"
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${ZIP_CODE}&key=${GEOCODING_API_KEY}`)
      .then(response => response.json())
      .then(data => data['results']['0'])
      .then(data => console.log(data))
  }

  render() {
    var centerLat = (data.minLat + data.maxLat) / 2;
    var distanceLat = data.maxLat - data.minLat;
    var bufferLat = distanceLat * 0.05;
    var centerLong = (data.minLong + data.maxLong) / 2;
    var distanceLong = data.maxLong - data.minLong;
    var bufferLong = distanceLong * 0.05;
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>COVID Tracker</h3>
        <Map
          style={{ height: "480px", width: "100%" }}
          zoom={1}
          center={[centerLat, centerLong]}
          bounds={[
            [data.minLat - bufferLat, data.minLong - bufferLong],
            [data.maxLat + bufferLat, data.maxLong + bufferLong]
          ]}
        >
          <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {data.frame.map((frame, k) => {
            return (
              <CircleMarker
                key={k}
                center={[frame["coordinates"][1], frame["coordinates"][0]]}
                radius={20 * Math.log(frame["count"] / 10000000)}
                fillOpacity={0.5}
                stroke={false}
              >
                <Tooltip direction="right" offset={[-8, -2]} opacity={1}>
                  <span>{frame["zip_code"] + ": " + "count" + " " + frame["count"]}</span>
                </Tooltip>
              </CircleMarker>)
          })
          }
        </Map>
      </div>
    );
  }
}

export default App;