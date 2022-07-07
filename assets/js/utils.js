/**
 * Returns unique identifier
 * @returns {String}
 */
export const guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
};

/**
 * Convertit des octets en KB, MB ...
 * @param {integer} x 
 * @returns 
 */   
 export const niceBytes = (x) => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let l = 0, n = parseInt(x, 10) || 0;
    while(n >= 1024 && ++l){
        n = n/1024;
    }
  
    return(n.toFixed(n < 10 && l > 0 ? 2 : 0) + ' ' + units[l]);
}

/**
 * Supprime les accents d'une chaine de caracteres
 * œ => OE et æ => AE
 */
 export const removeDiacritics = function(str) {
    function removeLigature(s) {
        return s.replace(/\u0152/g, 'OE')
            .replace(/\u0153/g, 'oe')
            .replace(/\u00c6/g, 'AE')
            .replace(/\u00e6/g, 'ae');
            
    }
    if (! (typeof str === "string")) {
        return str;
    }
    var s = str.normalize('NFD');
    s = removeLigature(s);
    return s.replace(/[\u0300-\u036f]/g, "");
};


/**
 * Affichage d'une patience sur la div dont l'id est id. Si id n'est pas defini => body
 * @param {string | undefined } id
 */
 export class Wait {
    constructor(options) {
        options = $.extend({ id: 'body' }, options);
        let uuid = guid();

        const template = `
            <div class="p-2" id=wait-${uuid}>
                <div class="text-center">
                    <div class="spinner-border" role="status">
                </div>
                <h6 class="font-weight-bold"></h6>
            </div>`;

        let element = (options.id !== 'body') ? document.getElementById(options.id) : options.id;
        $(element).css('position', 'relative');

        let $template = $(template);
        $template.css({ 
            'display': 'none', 
            'position': 'absolute', 
            'color': 'white',
            'background-color': 'rgba(0,0,0,0.5)',
            'z-index': 1000,
            'top': 0, 
            'left': 0, 
            'right': 0, 
            'bottom': 0
        });
        $(element).append($template);
        this.$div = $(`div#wait-${uuid}`);
    }
  
    show(text) {
        this.$div.find('h6').html(text);
        this.$div.css({
            'display': 'flex', 
            'flex-direction': 'column', 
            'justify-content': 'center',
            'align-items': 'center'
        });
    }

    hide() {
        this.$div.css({
            'display': 'none', 
            'flex-direction': '', 
            'justify-content': ''
        });
    }
}