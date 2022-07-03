import { Map } from 'maplibre-gl'

const map = new Map({
    container: 'map-maplibre',
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [2.33333, 46.866669], // starting position [lng, lat]
    zoom: 5 // starting zoom
})

console.log('hello from map-maplibre.js');