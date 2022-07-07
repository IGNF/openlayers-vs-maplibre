const baseurl = 'https://wxs.ign.fr/essentiels/ols/apis/completion';

function toCarmenGeoJson(datas) {
    const features = []
    datas.forEach(data => {
        features.push({
            id: data.city,
            type: 'Feature',
            properties: data,
            geometry: {
                type: 'Point',
                coordinates: [data.x, data.y]
            },
            text: data.fulltext,
            place_name: data.fulltext,
            place_type: [data.kind],
            center: [data.x, data.y],  
        });
    });

    return { features: features };
}

/**
 * Appel à l'API d'auto completion de l'ign :
 * https://geoservices.ign.fr/documentation/services/api-et-services-ogc/autocompletion-rest)
 * @param {Object} config 
 * @returns 
 */
export default async function search(config) {
    let query = config.query;
    let url = `${baseurl}?text=${query}&type=PositionOfInterest&maximumResponses=5`;
    
    try {
        let response = await fetch(url);
        response = await response.json();
        
        return Promise.resolve(toCarmenGeoJson(response.results));
    } catch(err) {
        console.log(err);
    }
}