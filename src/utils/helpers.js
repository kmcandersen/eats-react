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
