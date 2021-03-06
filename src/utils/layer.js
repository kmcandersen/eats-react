import { loadModules } from 'esri-loader';
import blueIcon from '../img/map-pin-blue.svg';
import yellowIcon from '../img/map-pin-yellow.svg';

export const loadLinesLayer = () => {
  return loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
    const layer = new FeatureLayer({
      url:
        'https://services6.arcgis.com/Wd9JN4VBanznW8Yf/arcgis/rest/services/CTA_Lines/FeatureServer',
    });
    return layer;
  });
};

export const loadStationsLayer = () => {
  return loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
    const layer = new FeatureLayer({
      outFields: ['*'],
      url:
        'https://services6.arcgis.com/Wd9JN4VBanznW8Yf/arcgis/rest/services/CTA_Stations/FeatureServer',
    });
    return layer;
  });
};

// searchResults arr OR selectedRest (yellow icon) -- an array of one
export function loadDataLayer(graphicsArr, color = 'blue') {
  let iconByColor = color === 'yellow' ? yellowIcon : blueIcon;
  let title = color === 'yellow' ? 'Selected Restaurant' : 'Restaurant Results';
  return loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
    const layer = new FeatureLayer({
      title: title,
      copyright: 'Yelp Inc.',
      outFields: [
        'ObjectID',
        'category1',
        'category2',
        'latitude',
        'longitude',
        'distance',
        'distanceStr',
        'id',
        'image_url',
        'address',
        'city',
        'name',
        'rating',
        'url',
      ],
      fields: [
        {
          name: 'ObjectID',
          type: 'oid',
        },
        {
          name: 'category1',
          type: 'string',
        },
        {
          name: 'category2',
          type: 'string',
        },
        {
          name: 'latitude',
          type: 'double',
        },
        {
          name: 'longitude',
          type: 'double',
        },
        {
          name: 'distance',
          type: 'double',
        },
        {
          name: 'distanceStr',
          type: 'string',
        },
        {
          name: 'id',
          type: 'string',
        },
        {
          name: 'image_url',
          type: 'string',
        },
        {
          name: 'address',
          type: 'string',
        },
        {
          name: 'city',
          type: 'string',
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'rating',
          type: 'double',
        },
        {
          name: 'url',
          type: 'string',
        },
      ],

      objectIdField: 'ObjectID',
      geometryType: 'point',
      spatialReference: { wkid: 4326 },
      source: graphicsArr || [], // empty arr at first
      minScale: 72223.819286,
      renderer: {
        type: 'simple', // autocasts as new SimpleRenderer()
        symbol: {
          type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          url: iconByColor,
          width: '30px',
          height: '30px',
          yoffset: '15px',
        },
      },
    });
    return layer;
  });
}
