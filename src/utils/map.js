import { loadModules } from 'esri-loader';

export function loadMap(container) {
  return loadModules(
    ['esri/Map', 'esri/views/MapView'],
    // this stylesheet is only loaded once
    { css: 'https://js.arcgis.com/4.16/esri/themes/light/main.css' }
  ).then(([Map, MapView]) => {
    const map = new Map({
      basemap: 'gray',
    });
    const view = new MapView({
      map: map,
      container,
      zoom: 15,
      center: [-87.62659, 41.867405],
      constraints: {
        minZoom: 10,
        maxZoom: 17,
        rotationEnabled: false,
      },
      popup: {
        autoOpenEnabled: false,
        visible: false,
        actions: [],
        alignment: 'top-center',
        collapseEnabled: true,
        dockOptions: {
          buttonEnabled: false,
          breakpoint: false,
        },
        visibleElements: {
          closeButton: false,
        },
      },
      highlightOptions: {
        fillOpacity: 1,
        color: 'yellow',
      },
    });
    return view;
  });
}
