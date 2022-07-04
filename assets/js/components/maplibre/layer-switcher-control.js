export class LayerSwitcherControl {
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'layer-switcher';

        let button = document.createElement('button');
        button.className = 'button';
        let i = document.createElement('i');
        i.className = 'icons-tiles';
        button.append(i);
        this._container.append(button);

        let lc = document.createElement('div');
        lc.className = 'layer-container';
        let ul = document.createElement('ul');
        ul.className = 'panel';

        let style = map.getStyle();
        if (style && style.sources) {
            let sources = Object.keys(style.sources);
            sources.forEach(source => {
                let li = this._addSouce(source);
                ul.append(li);
            }, this)
        }
        
        lc.append(ul);
        this._container.append(lc);

        return this._container;
    }
     
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    _addSouce(name) {
        let li = document.createElement('li');
        li.innerHTML = `<i class="icons-voir"></i>${name}`;
        return li;  
    }
}