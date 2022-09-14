# openlayers-vs-maplibre

Ce démonstrateur compare les possibilités des bibliothèques **OpenLayers** ([openlayers/openlayers](https://github.com/openlayers/openlayers)) et **MapLibre** ([maplibre/maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js)) pour la visualisation de couches de tuiles raster (WMTS) et de tuiles vectorielles dans une interface cartographique incluant quelques fonctionnalités de navigation et de recherche.

## Contexte

L'IGN utilise davantage OpenLayers historiquement et développe et maintient notamment une [extension Geoportail OpenLayers](https://github.com/IGNF/geoportal-extensions/).

Le développement des tuiles vectorielles comme mode de diffusion de données spatiales pose la question de la pertinence de l'usage de cette bibliothèque par rapport à une bibliothèque nativement conçue pour ce format tel MapLibre ([maplibre/maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js)).

## Fonctionnalités

Ce démonstrateur est constitué de 2 pages presque identiques, l'une construite avec OpenLayers, l'autre avec MapLibre, qui affichent :

- un fond `PLANIGN` raster WMTS
- une couche de tuiles vectorielles `PCI` (Plan Cadastral)
- des contrôles de zoom et déplacement (+ rotation, inclinaison avec MapLibre)
- une barre d'échelle
- un gestionnaire de couches
- une popup affichant les informations attributaires lorsque l'on clique sur un objet de la couche PCI

### Le gestionnaire de couches

Par rapport à celui d'OpenLayers, le gestionnaire de couches construit pour MapLibre est une arborescence qui contient le niveau pyramide (pci) et un sous-niveau pour chacune des `source-layer` décrite dans le style. Le niveau `layer` est trop fin car dans cette pyramide par exemple chaque source-layer est représentée dans plusieurs layer (contour, toponyme...).

=> On peut donc réaliser un gestionnaire de couche plus fin avec MapLibre qu'avec OpenLayers.

### Sélection des objets

Avec MapLibre, l'événement `onClick` est enregistré au niveau de la `layer` et on a donc plusieurs réactions au même endroit pour un même objet s'il est représenté plusieurs fois, ce qui entraîne plusieurs bulles d'information. Il a été nécessaire de tenter d'identifier les doublons de sélection pour ne pas avoir ces multiples infobulles.

Il peut néanmoins toujours légitimement y avoir plusieurs objets différents en un même endroit.
  
## Documentation Développeur

### Générer un build
```
yarn build-dev
yarn build
```

### Générer un build en continu (watch)
```
yarn build:watch
```

### Lancer le serveur de développement (indépendant du build)
```
yarn start
```
