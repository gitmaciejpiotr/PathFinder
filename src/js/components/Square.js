// import { templates } from '../settings.js';
// import { utils } from '../utils.js';

class Square {
  constructor(element) {
    const thisSquare = this;

    thisSquare.row = element.parentElement.getAttribute('data-id');
    thisSquare.col = element.getAttribute('data-id');

    // console.log(row, col);
  }
}

export default Square;