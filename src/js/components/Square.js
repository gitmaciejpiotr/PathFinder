// import { templates } from '../settings.js';
// import { utils } from '../utils.js';

class Square {
  constructor(element) {
    const thisSquare = this;

    thisSquare.element = element;
    thisSquare.row = element.parentElement.getAttribute('data-id');
    thisSquare.col = element.getAttribute('data-id');

    thisSquare.neighbours = thisSquare.getNeighbours();
    thisSquare.name = thisSquare.row + ':' + thisSquare.col;
    thisSquare.neverUsed = true;
  }

  getNeighbours() {
    const thisSquare = this;
    const neighnours = [];

    for (let i = 0; i < 4; i++) {
      let row = 0;
      let col = 0;
      if (i == 0) {
        row = parseInt(thisSquare.row) - 1;
        col = parseInt(thisSquare.col);
      } else if (i == 1) {
        row = parseInt(thisSquare.row) + 1;
        col = parseInt(thisSquare.col);
      } else if (i == 2) {
        row = parseInt(thisSquare.row);
        col = parseInt(thisSquare.col) - 1;
      } else if (i == 3) {
        row = parseInt(thisSquare.row);
        col = parseInt(thisSquare.col) + 1;
      }

      let neighbourName = row.toString() + ':' + col.toString();
      neighnours.push(neighbourName);
    }

    return neighnours;
  }
}

export default Square;