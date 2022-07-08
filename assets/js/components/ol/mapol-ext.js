import 'ol/ol.css';
import 'geoportal-extensions-openlayers/dist/GpPluginOpenLayers.css';
import 'geoportal-extensions-openlayers/src/OpenLayers/CSS/Controls/SearchEngine/GPsearchEngineOpenLayers.css';
import '../../../css/gp.css';

import Map from 'ol/Map';
import View from 'ol/View';
import { MVT } from "ol/format";
import { fromLonLat, transformExtent } from 'ol/proj';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import WMTS from 'ol/source/WMTS';
import VectorTileSource from 'ol/source/VectorTile';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import SearchEngine from 'geoportal-extensions-openlayers/src/OpenLayers/Controls/SearchEngine';
import LayerSwitcher from 'geoportal-extensions-openlayers/src/OpenLayers/Controls/LayerSwitcher';
import GetFeatureInfo from "geoportal-extensions-openlayers/src/OpenLayers/Controls/GetFeatureInfo";
import ScaleLine from 'ol/control/ScaleLine';
import DEFAULT_OPTIONS from '../defaults';
import { Wait } from '../../utils';
import { applyStyle } from 'ol-mapbox-style';


/**
 * Extension de Map d'openlayers
 */
export default class MapOlExt extends Map {
    constructor(target) {
        // Controles par defaut
        let controls = defaultControls({
            attribution: true,
            rotate: true,
            zoom: true
        });

        // Controles supplementaires
        controls.push(new ScaleLine());
        controls.push(new SearchEngine({
            apiKey: 'essentiels',
            collapsed: false,
            displayAdvancedSearch: false,
            displayMarker: false,
            zoomTo: 'current zoom'
        }));

        let viewOptions = Object.assign({}, DEFAULT_OPTIONS);
        viewOptions.center = fromLonLat(viewOptions.center);
        let view = new View(viewOptions);

        let options = Object.assign({}, {
            target: target,
            controls: controls,
            interactions: defaultInteractions(),
            view: view
        });

        // Appel du constructeur parent
        super(options);
        this._wait = new Wait({ id: target });

        this._layerSwitcher = new LayerSwitcher();
        this.getControls().push(this._layerSwitcher);
        
        // Ajout de la couche de fond
        this.addBackgroundLayer();
        this.on('backgroundlayeradded', () => {
            this._wait.show("Chargement des tuiles vecteurs du PCI");

            this.addPCI().then(result => {
                let informations = result.informations;

                let layer = new VectorTileLayer({
                    minZoom: informations.minzoom,
                    maxZoom: informations.maxzoom,
                    declutter: true,
                    source: new VectorTileSource({
                        url: informations.tiles[0],
                        format: new MVT(),
                        tileSize: informations.tileSize
                    }),
                });
                this.addLayer(layer, {
                    title: informations.title,
                    description: informations.description,
                });
                applyStyle(layer, result.style, 'pci');
                
                let control = new GetFeatureInfo({
                    options: { auto: true, hidden: true },
                    layers: [{ obj: layer }]
                });
                this.addControl(control);
                this._wait.hide();
            }).catch(error => {
                console.log(error);
                this._wait.hide();
            })
        })
    }

    /**
     * Ajout de la couche de fond
     */
    addBackgroundLayer() {
        const layerName = 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2';

        let url = `https://wxs.ign.fr/cartes/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities`;
        fetch(url).then((response) => {
            if (response.status != 200) throw response.statusText;
            return response.text();
        }).then((response) => {
            let format = new WMTSCapabilities();
            let capabilities = format.read(response);

            const layers = capabilities['Contents']['Layer'];
            const l = layers.find(layer => {
                return (layerName === layer['Identifier']);
            });
            if (! l) {
                throw Error();
            }
            let wmtsOptions = optionsFromCapabilities(capabilities, {
                layer: layerName
            });

            let layer = new TileLayer({
                opacity: 1,
                source: new WMTS(wmtsOptions)
            })
            this.addLayer(layer, { title: l.Title, description: l.Abstract });
            this.dispatchEvent({ type: 'backgroundlayeradded' });
        }).catch(error => {
            console.log(`La couche ${layerName} n'a pas été trouvée.`, "warning");
        });
    }

    /**
     * Ajout de la couche PCI
     * @returns 
     */
     async addPCI() {
        let response = await fetch('https://wxs.ign.fr/parcellaire/geoportail/tms/1.0.0/PCI');
        response  = await response.text();

        const parser = new DOMParser();
        let document = parser.parseFromString(response, 'application/xml');
        let informations = this.getInformations(document);

        response = await fetch('https://wxs.ign.fr/parcellaire/geoportail/tms/1.0.0/PCI/metadata.json/');
        response  = await response.json();
        
        informations = Object.assign(informations, response);

        // Le style
        response = await fetch('https://wxs.ign.fr/static/vectorTiles/styles/PCI/pci.json');
        
        let style = await response.json();
        style.glyphs = 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf';
        style.layers.forEach(layer => {
            if ('layout' in layer && 'text-font' in layer.layout) {
                layer.layout['text-font'] = ["Open Sans Bold Italic"];
            }
        });

        return Promise.resolve({
            informations: informations,
            style: style 
        });
    }

    /**
     * Ajout d'une couche
     * @param {ol.layer} layer 
     * @param {Object} opt_options options de la couche
     *      - title {string}: Titre
     *      - description {string}: Description
     *      - keywords{Array}: Mots cles
     *      - attribution{Object|null} : Attribution
     * 
     * @param {string} description 
     */
    addLayer(layer, opt_options) {
        let options = opt_options || {};
        options = $.extend({ title: null, description: null, keywords: [], attribution: {} }, options)
        super.addLayer(layer);

        let description = `<p>${options.description}</p>`;
        if (options.keywords.length) {
            description += '<p><span class="font-weight-bold">Mots clés : </span>' + options.keywords.join(', ') + '</p>';
        }
        this._layerSwitcher.addLayer(layer, {
            title: options.title,
            description: description
        });
    }

    /**
     * Recuperation des infos contenues dans les capabilities
     * @param {string} capabilities 
     * @returns 
     */
     getInformations(document) {
        let informations = {
            title: null,
            tileSize: null
        };

        // Titre
        let tileNode = document.firstElementChild;
        informations.title = tileNode.getElementsByTagName("Title")[0].textContent;

        // Taille des tuiles
        let tileFormat = tileNode.getElementsByTagName("TileFormat")[0];
        let tileSize = tileFormat.getAttribute('width');
        informations.tileSize = parseInt(tileSize, 10);

        return informations;
    }
}