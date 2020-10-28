import { loadModules } from 'esri-loader';

// arr = search results or bookmarks
// create an array of graphics based on arr
export function setGraphics(arr) {
  return loadModules(['esri/Graphic']).then(([Graphic]) => {
    let graphics = [];
    let graphic;
    for (let i = 0; i < arr.length; i++) {
      graphic = new Graphic({
        geometry: {
          type: 'point',
          latitude: arr[i].latitude,
          longitude: arr[i].longitude,
        },
        attributes: arr[i],
      });
      graphics.push(graphic);
    }
    return graphics;
  });
}
