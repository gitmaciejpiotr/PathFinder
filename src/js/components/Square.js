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
    thisSquare.previousSquareDirection = null;
    thisSquare.previousSquareMarkedNeighbour = {};
    thisSquare.markVolume = null;
    thisSquare.markVolumeChanged = false;
    thisSquare.shown = false;
  }

  setPreviousMarkedSquare(prevSqaure){
    const thisSquare = this;

    const prevSquareName = prevSqaure.name;

    for(let i = 0; i < 4; i++){
      if(prevSqaure.neighbours[i] == thisSquare.name){
        if(i == 0){
          thisSquare.previousSquareMarkedNeighbour[prevSquareName] = 'top';
        } else if (i == 1){
          thisSquare.previousSquareMarkedNeighbour[prevSquareName] = 'bottom';
        } else if (i == 2){
          thisSquare.previousSquareMarkedNeighbour[prevSquareName] = 'left';
        } else if (i == 3){
          thisSquare.previousSquareMarkedNeighbour[prevSquareName] = 'right';
        }
      }
    }

    thisSquare.previousSquareDirection = thisSquare.previousSquareMarkedNeighbour[prevSquareName];
  }

  setMarkVolume(volume){
    const thisSquare = this;

    if(thisSquare.markVolumeChanged == false){
      thisSquare.markVolume = volume;
      thisSquare.element.setAttribute('mark-volume', volume);
      thisSquare.markVolumeChanged = true;
    }
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

      if (row < 11 && row > 0 && col < 11 && col > 0){
        let neighbourName = row.toString() + ':' + col.toString();
        neighnours.push(neighbourName);
      } else {
        neighnours.push(null);
      }
    }

    return neighnours;
  }
}

export default Square;