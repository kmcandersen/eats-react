import { loadModules } from 'esri-loader';

// create an array of graphics based on arr
export function setGraphics(arr) {
  return loadModules(['esri/Graphic']).then(([Graphic]) => {
    let graphics = [];
    let graphic;
    for (let el of arr) {
      graphic = new Graphic({
        geometry: {
          type: 'point',
          latitude: el.latitude,
          longitude: el.longitude,
        },
        attributes: el,
      });
      graphics.push(graphic);
    }
    return graphics;
  });
}
