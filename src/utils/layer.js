import { loadModules } from 'esri-loader';

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
