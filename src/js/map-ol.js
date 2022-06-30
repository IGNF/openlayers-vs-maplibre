import 'ol/ol.css';
import Map from 'ol/Map';
import OSM, { ATTRIBUTION } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

console.log('hello from map-ol.js');

const osm = new TileLayer({
  source: new OSM({ attributions: ATTRIBUTION }),
});

const map = new Map({
  layers: [osm],
  target: 'map-ol',
  view: new View({
    maxZoom: 18,
    center: [-244780.24508882355, 5986452.183179816],
    zoom: 15,
  }),
});