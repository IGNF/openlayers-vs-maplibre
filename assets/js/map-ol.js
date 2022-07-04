import 'ol/ol.css';
import Map from 'ol/Map';
import OSM, { ATTRIBUTION } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';


const osm = new TileLayer({
	source: new OSM({ attributions: ATTRIBUTION }),
});

const map = new Map({
	layers: [osm],
	target: 'map-ol',
	view: new View({
		maxZoom: 18,
		center: fromLonLat([2.35, 48.85]),  // Paris
		zoom: 14
	})
});