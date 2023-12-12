'use client'
import React from 'react';
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';

var createGeoJSONCircle = function(center, radiusInKm, points) {
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

class RadarMap extends React.Component {
  async componentDidMount() {
    Radar.initialize('prj_test_pk_372da21bdc800cb008116a62df37f05d3f2a32b0');

    // create a map
    const map = new Radar.ui.map({
      container: 'map',
      style: 'radar-default-v1',
      center: [-73.9911, 40.7342], // NYC
      zoom: 12,
    })


    map.on("load", function () {
      // add a marker to the map
      Radar.ui.marker({ text: 'Radar HQ' })
      .setLngLat([-73.9910078, 40.7342465])
      .addTo(map);

      map.addSource("polygon", createGeoJSONCircle([-73.9910078, 40.7342465], 1));

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
    )}

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