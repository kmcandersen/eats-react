import { loadModules } from 'esri-loader';

export function loadHome(view) {
  return loadModules(['esri/widgets/Home']).then(([Home]) => {
    const home = new Home({
      view,
    });
    view.ui.add(home, 'top-left');
    return view;
  });
}

export function loadLocate(view) {
  return loadModules(['esri/widgets/Locate']).then(([Locate]) => {
    const locate = new Locate({
      view,
    });
    view.ui.add(locate, 'top-left');
    return view;
  });
}
