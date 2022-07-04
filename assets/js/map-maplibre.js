// import { Map, NavigationControl, ScaleControl } from 'maplibre-gl';
import { Map, NavigationControl, ScaleControl } from 'maplibre-gl/dist/maplibre-gl-dev';
import { LayerSwitcherControl } from './components/maplibre/layer-switcher-control';
import 'maplibre-gl/dist/maplibre-gl.css';


const map = new Map({
    container: 'map-maplibre',
    style: {
        version: 8,
        sources: {
            'Plan IGN V2': {
                type: 'raster',
                tiles: [
                    'https://wxs.ign.fr/cartes/geoportail/wmts?SERVICE=WMTS&style=normal&VERSION=1.0.0&REQUEST=GetTile&format=image/png&layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&tilematrixset=PM&TileMatrix={z}&TileCol={x}&TileRow={y}'
                ],
                tileSize: 256,
                attribution:'Orthophotos <a target="_top" rel="noopener" href="http://www.ign.fr">IGN</a>'
            }
        },
        layers: [{
            id: 'simple-tiles',
            type: 'raster',
            source: 'Plan IGN V2',
            minzoom: 0,
            maxzoom: 22
        }]
    },
    center: [2.35, 48.85],  // Paris
    zoom: 14
});

map.addControl(new NavigationControl({visualizePitch: true}), 'top-left');
map.addControl(new ScaleControl());

map.on('load', () => {
    /* map.addSource('PCI Vecteur', {
        type: 'vector',
        scheme: 'tms',
        tiles: [
            'https://wxs.ign.fr/parcellaire/geoportail/tms/1.0.0/PCI/{z}/{x}/{y}.pbf'
        ]  
    }); */

    // let url = 'https://wxs.ign.fr/static/vectorTiles/styles/PCI/pci.json';
    /* let url = 'https://wxs.ign.fr/static/vectorTiles/styles/PCI/noir_et_blanc.json';
    fetch(url).then(res => res.json()).then(style => {
        map.setStyle(style);
    }).catch((error) => {
        console.log(error)
    }); */

    map.addControl(new LayerSwitcherControl());
})
