import starYellow from '../img/star-yellow.png';
import starGray from '../img/star-gray.png';
import starHalf from '../img/star-half.png';

export const createStarString = rating => {
  let origRating = rating;
  let roundedRating = Math.floor(rating);
  let decimal = origRating - roundedRating > 0 ? true : false;
  let count = roundedRating;
  // prettier-ignore
  let stars = "";

  for (let i = 0; i < roundedRating; i++) {
    stars += `<img src=${starYellow} alt='full star' />`;
  }
  if (decimal) {
    stars += `<img src=${starHalf} alt='half star' />`;
    count++;
  }
  if (count < 5) {
    for (let i = count; i < 5; i++) {
      stars += `<img src=${starGray} alt='empty star' />`;
    }
  }
  return stars;
};

const colorNameToHex = colorName => {
  switch (colorName) {
    case 'Blue':
      return '#1AA2DB';
    case 'Brown':
      return '#61361E';
    case 'Green':
      return '#159940';
    case 'Orange':
      return '#F7482B';
    case 'Pink':
      return '#E07FA6';
    case 'Purple':
      return '#522A95';
    case 'Purple Express':
      return '#522A95';
    case 'Purple Exp':
      return '#522A95';
    case 'Red':
      return '#C41235';
    case 'Yellow':
      return '#F8E133';
    default:
      return null;
  }
};

export const createLineSquares = lineListStr => {
  let lineListArr = lineListStr.split(', ');
  let colorSquares = '';
  for (let el of lineListArr) {
    let hex = colorNameToHex(el);
    colorSquares += `<div class='Station--color-square' style='background-color: ${hex}'></div>`;
  }
  return colorSquares;
};
