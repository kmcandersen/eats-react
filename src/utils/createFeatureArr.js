//Yelp returns distance in meters
//1609.34 m in a mile
const roundToEighthsMi = meters => {
  switch (meters) {
    // Less than 1/16
    case meters < 100.584:
      return `${meters * 3.281} ft`;
    // 1/16-3/16
    case meters < 301.751:
      return '1/8 mi';
    // 3/16-5/16
    case meters < 502.919:
      return '1/4 mi';
    // 5/16-7/16
    case meters < 704.086:
      return '3/8 mi';
    default:
      return '1/2 mi';
  }
};

//arr = results
export const createFeatureArr = arr => {
  let features = [];
  let idCount = 0;

  for (let i = 0; i < arr.length; i++) {
    let el = arr[i];
    idCount++;

    let feature = {
      ObjectID: 0,
      category1: '',
      category2: '',
      latitude: 0,
      longitude: 0,
      distance: 0,
      id: '',
      image_url: 0,
      address: '',
      city: '',
      name: '',
      rating: 0,
      url: '',
    };

    feature.ObjectID = idCount;
    feature.category1 = el.categories[0].title || '';
    if (el.categories[1]) {
      feature.category2 = el.categories[1].title || '';
    }
    feature.latitude = el.coordinates.latitude;
    feature.longitude = el.coordinates.longitude;
    feature.distance = roundToEighthsMi(el.distance);
    feature.id = el.id;
    feature.image_url = el.image_url;
    feature.address = el.location.address1;
    feature.city = el.location.city;
    feature.name = el.name;
    feature.rating = el.rating;
    feature.url = el.url;

    features.push(feature);
  }
  return features;
};
