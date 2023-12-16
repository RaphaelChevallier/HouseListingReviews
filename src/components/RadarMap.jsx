'use client'
import React from 'react';
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';
import axios from 'axios'
import { RadiusUnits } from '@prisma/client';

let createGeoJSONCircle = function(center, radiusInKm, points) {
  if(!points) points = 64;

  var coords = {
      latitude: center[1],
      longitude: center[0]
  };

  var km = radiusInKm;

  var ret = [];
  var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
  var distanceY = km/110.574;

  var theta, x, y;
  for(var i=0; i<points; i++) {
      theta = (i/points)*(2*Math.PI);
      x = distanceX*Math.cos(theta);
      y = distanceY*Math.sin(theta);

      ret.push([coords.longitude+x, coords.latitude+y]);
  }
  ret.push(ret[0]);

  return {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Polygon",
                  "coordinates": [ret]
              }
          }]
      }
  };
};

const getPreciseCoordinates = async (location) => {
  const headers = {
    Authorization: 'prj_test_pk_372da21bdc800cb008116a62df37f05d3f2a32b0',
    };

    let results = await axios.get(`https://api.radar.io/v1/geocode/forward?query=${location}`, {headers: headers})
    let dataResults = await results.data
    return dataResults
}

function convertToKm(radius, radiusUnits){
  if (radiusUnits === RadiusUnits.MILES) {
      return radius * 1.60934;
  } else if (radiusUnits === RadiusUnits.METERS) {
      return radius / 1000;
  } else if (radiusUnits === RadiusUnits.YARDS) {
      return radius / 1094;
  } else {
      return radius / 1;
  }
}

async function build(location, radius, radiusUnits) {
  const radiusInKm = convertToKm(parseFloat(radius), radiusUnits)
  const locationData = await getPreciseCoordinates(location)
  Radar.initialize('prj_test_pk_372da21bdc800cb008116a62df37f05d3f2a32b0');
  let zoom = 12
  if(radiusInKm >= 0 && radiusInKm < .45){
    zoom = 15
  } else if(radiusInKm >= .45 && radiusInKm < 1.2){
    zoom = 13
  }else if(radiusInKm >= 3 && radiusInKm < 6){
    zoom = 11
  } else if(radiusInKm >= 6 && radiusInKm < 12){
    zoom = 10
  } else if(radiusInKm >= 12 && radiusInKm < 25){
    zoom = 9
  } else if(radiusInKm >= 25 && radiusInKm < 50){
    zoom = 8
  } else if(radiusInKm >= 50 && radiusInKm < 100){
    zoom = 7
  } else if(radiusInKm >= 100 && radiusInKm < 200){
    zoom = 6
  } else if(radiusInKm >= 200 && radiusInKm < 400){
    zoom = 5
  } else if(radiusInKm >= 400 && radiusInKm < 800){
    zoom = 4
  } else if(radiusInKm >= 800 && radiusInKm < 1600){
    zoom = 3
  } else if(radiusInKm >= 1600 && radiusInKm < 3200){
    zoom = 2
  } else if(radiusInKm >= 3200 && radiusInKm < 6400){
    zoom = 1
  } else if(radiusInKm >= 6400 && radiusInKm < 12800){
    zoom = 0
  }

  // create a map
  const map = new Radar.ui.map({
    container: 'map',
    style: 'radar-default-v1',
    center: locationData.addresses[0].geometry.coordinates,
    zoom: zoom,
  })


  map.on("load", function () {
    Radar.ui.marker({ text: 'Radar HQ' })
    .setLngLat(locationData.addresses[0].geometry.coordinates)
    .addTo(map);

    map.addSource("polygon", createGeoJSONCircle(locationData.addresses[0].geometry.coordinates, radiusInKm));

    map.addLayer({
        "id": "polygon",
        "type": "fill",
        "source": "polygon",
        "layout": {},
        "paint": {
            "fill-color": "blue",
            "fill-opacity": 0.3
        }
    });
    }
  )
}

class RadarMap extends React.Component {
  async componentDidUpdate() {
      await build(this.props.location, this.props.radius, this.props.radiusUnits)
    }

  async componentDidMount() {
    await build(this.props.location, this.props.radius, this.props.radiusUnits)
  }

  render() {
    return (
      <>
      <div id="map-container" style={{height: '30rem', position: 'relative', zIndex: 0, width: '100%' }}>    
        <div id="map" style={{ height: '100%', position: 'absolute', zIndex: 0, width: '100%' }} >
        </div>
      </div>
    </>
    );
  }
};

export default RadarMap;