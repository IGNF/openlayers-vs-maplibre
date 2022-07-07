export class LayerSwitcherControl {
    onAdd(map) {
        this._map = map;
        this._style = map.getStyle();

        let layers = this._style.layers;
        layers.forEach(function(part, index) {
            let layer = this[index];
            if (! ('source-layer' in layer)) {
                layer['source-layer'] = layer.id;
            }
        }, layers);

        this._buildContainer();
        return this._container;
    }
     
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    _buildContainer() {
        this._container = document.createElement('div');
        this._container.className = 'layer-switcher';

        let button = document.createElement('button');
        button.className = 'btn layer-switcher-control';
        button.innerHTML = '<i class="icons-tiles"></i>';
        button.addEventListener('click', event => {
            let ul = document.getElementById('layer-switcher-sources');
            let display = ul.style.display || 'none';
            ul.style.display = ( display === "none") ? "block" : "none"; 
        });
        this._container.append(button);
 
        let ulSrces = document.createElement('ul');
        ulSrces.className = 'layer-switcher-sources';
        ulSrces.id = 'layer-switcher-sources';
        this._container.append(ulSrces);

        if (this._style && this._style.sources) {
            let sources = Object.keys(this._style.sources);
            sources.forEach(source => {
                let li = this._addSouce(source);
                ulSrces.append(li);

                let ul = document.createElement('ul');
                ul.className = 'layer-switcher-layers';
                li.append(ul);

                const layers = {};
                this._style.layers.forEach(layer => {
                    if (source === layer.source) {
                        let name = layer["source-layer"];
                        if (! (name in layers)) {
                            layers[name] = []; 
                        }
                        layers[name].push(layer.id)
                    }
                });

                for (let name in layers) {
                    let li = this._addLayer(source, name, layers[name]);
                    ul.append(li);
                }
            })
        }
    }

    _addSouce(source) {
        let li = document.createElement('li');
        li.className = 'layer-switcher-source';

        let cb = document.createElement('input');
        cb.type             = 'checkbox';
        cb.className        = 'source';
        cb.id               = source;
        cb.dataset.source   = source;
        cb.checked          = true;
        
        /* Coche/decoche une source */
        cb.addEventListener('change', (event) => {
            let target  = event.currentTarget;
            let checked = target.checked;
            let source  = target.dataset.source;

            let parent = target.parentNode;
            const elements = parent.querySelectorAll(`input.layer[data-source="${source}"]`);

            elements.forEach(element => {
                let visible = checked ? 'visible' : 'none';
                element.checked = checked;
                let layerIds = element.dataset.ids.split(',');
                layerIds.forEach(layerId => {
                    this._map.setLayoutProperty(layerId, 'visibility', visible);
                })
            })
        })

        let label = this._addLabel(source);

        li.append(cb);
        li.append(label);
        return li;  
    }

    _addLayer(source, layer, ids) {
        let li = document.createElement('li');

        let cb = document.createElement('input');
        cb.type             = 'checkbox';
        cb.className        = 'layer';
        cb.id               = layer;
        cb.dataset.source   = source;
        cb.dataset.layer    = layer;
        cb.dataset.ids      = ids.join(',');
        cb.checked = true;
        
        /* Coche/decoche un layer */
        cb.addEventListener('change', (event) => {
            let target  = event.currentTarget;
            
            let checked = target.checked;
            let visible = checked ? 'visible' : 'none';

            // Mise a jour de tous les styles de meme source-layer
            let layerIds = target.dataset.ids.split(',');
            layerIds.forEach(layerId => {
                this._map.setLayoutProperty(layerId, 'visibility', visible);
            })

            // Mise a jour (checked) de la checkbox de la source
            let source = target.dataset.source;
            let cbSource = document.querySelector(`input.source[data-source="${source}"]`)

            let ulLayers = target.parentNode.parentNode;
            let elements = ulLayers.querySelectorAll('input.layer');
            let num = elements.length;

            let checkStates = { checked: 0, unchecked: 0 };
            elements.forEach(element => {
                element.checked ? checkStates.checked++ : checkStates.unchecked++;
            })
            if (num === checkStates.checked) {
                cbSource.checked = true;
            } else if (num === checkStates.unchecked) {
                cbSource.checked = false;
            }
        })

        let label = this._addLabel(layer);
        
        li.append(cb);
        li.append(label);
        return li;      
    }

    _addLabel(id) {
        let label = document.createElement('label');
        label.htmlFor = id;

        let span = document.createElement('span');
        span.innerHTML = id;
        label.append(span);
        return label;    
    }
}