import { loadModules } from 'esri-loader';
import grayIcon from '../img/map-pin-gray.svg';
import orangeIcon from '../img/map-pin-orange.svg';

export const loadLinesLayer = () => {
  return loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
    const layer = new FeatureLayer({
      url:
        'https://services6.arcgis.com/Wd9JN4VBanznW8Yf/arcgis/rest/services/CTA_Lines/FeatureServer',
      popupTemplate: {
        title: '{Name}',
      },
    });
    return layer;
  });
};

export const loadStationsLayer = () => {
  return loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
    const layer = new FeatureLayer({
      url:
        'https://services6.arcgis.com/Wd9JN4VBanznW8Yf/arcgis/rest/services/CTA_Stations/FeatureServer',
      popupTemplate: {
        title: '{STA_DESC_N}',
      },
    });
    return layer;
  });
};

// searchResults arr OR selectedRest (yellow icon) -- an array of one
export function loadDataLayer(graphicsArr, color = 'gray') {
  let iconByColor = color === 'orange' ? orangeIcon : grayIcon;
  return loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
    const layer = new FeatureLayer({
      title: 'Restaurants',
      copyright: 'Yelp Inc.',
      outFields: [
        'ObjectID',
        // 'category1',
        // 'category2',
        'latitude',
        'longitude',
        'distance',
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
      renderer: {
        type: 'simple', // autocasts as new SimpleRenderer()
        symbol: {
          type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          url: iconByColor,
          width: '30px',
          height: '30px',
        },
      },
    });
    return layer;
  });
}
