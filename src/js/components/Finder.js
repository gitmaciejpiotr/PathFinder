import { templates } from '../settings.js';
import { utils } from '../utils.js';
import Square from './Square.js';

class Finder {
  constructor(element) {
    const thisFinder = this;

    thisFinder.selectedSquares = {};
    thisFinder.startAndEndSquares = {
      'start': '',
      'end': ''
    };
    thisFinder.wrapper = element;

    thisFinder.render(element);
    thisFinder.getElements();
    thisFinder.initActions();
  }

  getElements() {
    const thisFinder = this;

    thisFinder.dom.sectionContainer = document.querySelector('.finder-wrapper');
    thisFinder.dom.matrix = thisFinder.dom.sectionContainer.querySelector('.matrix');
    thisFinder.dom.bottomButton = thisFinder.dom.wrapper.querySelector('.bottom-button');
    thisFinder.dom.allSquares = document.querySelectorAll('.square');
    thisFinder.dom.finishSpan = thisFinder.dom.bottomButton.querySelector('#finish');
    thisFinder.dom.computeSpan = thisFinder.dom.bottomButton.querySelector('#compute');
    thisFinder.dom.againSpan = thisFinder.dom.bottomButton.querySelector('#again');
    // thisFinder.dom.booksList = document.querySelector('.books-list');
    // thisFinder.dom.filtersContainer = document.querySelector('.filters div');
  }

  render(element) {
    const thisFinder = this;

    let generatedHTML = templates.finderPage();

    // thisFinder.dom = {};

    // thisFinder.dom.wrapper = element;

    /* Create element using utils.createElementFromHTML */
    thisFinder.element = utils.createDOMFromHTML(generatedHTML);

    thisFinder.dom = {};

    thisFinder.dom.wrapper = element;

    let generalInnerHTML = '';

    for (let i = 0; i < thisFinder.element.children.length; i++) {

      let child = thisFinder.element.children[i];

      if (child.classList.contains('matrix')) {
        const button = thisFinder.element.querySelector('.square');
        const row = thisFinder.element.querySelector('.row');
        const matrix = thisFinder.element.querySelector('.matrix');
        let buttons = '';
        let rows = '';

        for (let i = 0; i < 10; i++) {

          row.setAttribute('data-id', 1 + i);

          for (let j = 0; j < 10; j++) {
            button.setAttribute('data-id', 1 + j);
            buttons += button.outerHTML;
          }

          row.innerHTML = buttons;
          buttons = '';
          rows += row.outerHTML;
        }

        matrix.innerHTML = rows;
        generalInnerHTML += matrix.outerHTML;

      } else if (child == thisFinder.element.firstElementChild) {
        generalInnerHTML = child.outerHTML;
      } else {
        generalInnerHTML += child.outerHTML;
      }
    }

    thisFinder.element.innerHTML = generalInnerHTML;

    /* Add element to #menu */
    thisFinder.dom.wrapper.innerHTML = thisFinder.element.outerHTML;
  }

  initActions() {
    const thisFinder = this;
    console.log(thisFinder);
    thisFinder.addClassActiveFunc = thisFinder.addAddClassActiveFunc.bind(thisFinder);
    thisFinder.setSelectStartAndEndModeFunc = thisFinder.addSetSelectStartAndEndModeFunc.bind(thisFinder);
    thisFinder.setComputeShortestPathModeFunc = thisFinder.addSetComputeShortestPathModeFunc.bind(thisFinder);

    thisFinder.dom.sectionContainer.addEventListener('click', thisFinder.addClassActiveFunc);

    thisFinder.dom.bottomButton.addEventListener('click', thisFinder.setSelectStartAndEndModeFunc);
  }

  addSetSelectStartAndEndModeFunc(event) {
    const thisFinder = this;

    event.preventDefault();
    thisFinder.dom.sectionContainer.removeEventListener('click', thisFinder.addClassActiveFunc);
    thisFinder.setSelectStartAndEndMode(event);
  }

  addAddClassActiveFunc(event) {
    const thisFinder = this;

    event.preventDefault();
    console.log(event.target);
    // console.log(event.target.parentElement.classList);
    if (event.target.parentElement.classList.contains('row')) {
      thisFinder.addClassActive(event);
    }
  }

  addClassActive(event) {
    const thisFinder = this;

    const square = new Square(event.target, thisFinder.dom.matrix);

    if (thisFinder.checkIfFitsToPattern(square)) {
      // console.log('heja');
      // console.log(square);
      thisFinder.selectedSquares[square.name] = square;
      event.target.classList.add('active');
    }
  }

  checkIfFitsToPattern(square) {
    const thisFinder = this;

    if (thisFinder.selectedSquares.hasOwnProperty(square.name)) {
      return false;
    } else if (utils.isEmpty(thisFinder.selectedSquares)) {
      return true;
    } else {
      for (let neighbour of square.neighbours) {
        // console.log(neighbour);
        if (thisFinder.selectedSquares.hasOwnProperty(neighbour)) {
          return true;
        }
      }
    }

    return false;
  }

  setSelectStartAndEndMode() {
    let thisFinder = this;

    thisFinder.activeSquares = [];

    for (let square of thisFinder.dom.allSquares) {
      square.classList.add('noHoverEffect');
      if (square.classList.contains('active')) {
        thisFinder.activeSquares.push(square);
        square.addEventListener('click', function (event) {
          event.preventDefault();
          thisFinder.selectStartAndEnd(event);
        });
      }
    }

    thisFinder.dom.finishSpan.classList.add('hidden');
    thisFinder.dom.computeSpan.classList.remove('hidden');
  }


  selectStartAndEnd(event) {
    let thisFinder = this;
    const square = new Square(event.target, thisFinder.dom.matrix);
    const squareDOM = event.target;

    if (thisFinder.startAndEndSquares['start'] == '') {
      thisFinder.startAndEndSquares['start'] = square;
      squareDOM.classList.remove('noHoverEffect');
      squareDOM.classList.add('startAndEnd');
    } else if (thisFinder.startAndEndSquares['start'] !== '' && thisFinder.startAndEndSquares['end'] == '' && event.target !== thisFinder.startAndEndSquares['start']) {
      thisFinder.startAndEndSquares['end'] = square;
      for (let activeSquare of thisFinder.activeSquares) {
        activeSquare.classList.remove('noHoverEffect');
      }
      squareDOM.classList.add('startAndEnd');
      thisFinder.dom.bottomButton.removeEventListener('click', thisFinder.setSelectStartAndEndModeFunc);

      thisFinder.dom.bottomButton.addEventListener('click', thisFinder.setComputeShortestPathModeFunc);
    }
  }

  addSetComputeShortestPathModeFunc() {
    const thisFinder = this;

    thisFinder.computeShortestPath();

    thisFinder.dom.computeSpan.classList.add('hidden');
    thisFinder.dom.againSpan.classList.remove('hidden');
  }

  computeShortestPath() {
    const thisFinder = this;

    const endSquare = thisFinder.startAndEndSquares['end'];
    endSquare.setMarkVolume(1);
    // const startSquare = thisFinder.startAndEndSquares['start'];
    const arrayWithSquares = [endSquare];

    let squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(arrayWithSquares);

    // squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(squaresToMark);
    // squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(squaresToMark);
    // squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(squaresToMark);
    // squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(squaresToMark);


    // console.log(squaresToMark);

    while (utils.isEmpty(thisFinder.selectedSquares) === false) {
      squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(squaresToMark);
      console.log('heja');
    }


    // thisFinder.selectedSquaresSegregated = [];
    // const startSquare = thisFinder.startAndEndSquares['start'];

    // endSquare.element.setAttribute('mark-volume', markVolume);
    // markVolume = markVolume / 2;
    // endSquare.previousSquare = endSquare;
    // endSquare.setMarkVolume(1);

    // for (let square in thisFinder.selectedSquares) {

    //   thisFinder.giveMarkVolumeToActiveSquares(thisFinder.selectedSquares[square]);

    //   // if (i === 0){
    //   //   delete thisFinder.activeSquares[thisFinder.activeSquares.indexOf(endSquare.element)];
    //   // }
    // }
    // thisFinder.selectedSquaresSegregated.push(endSquare.element);

    // thisFinder.giveMarkVolumeToNeighbours(endSquare);

    // const startVolume = startSquare.element.getAttribute('mark-volume');
    // thisFinder.showTheShorstestPath(startSquare, startVolume);

    // console.log(thisFinder.selectedSquaresSegregated);


  }

  giveMarkVolumeToActiveSquares(arrayWithSquares) {
    const thisFinder = this;

    const newArrayWithSquares = [];

    for (let square of arrayWithSquares){
      const neighbours = square.neighbours;

      for (let neighbour of neighbours){
        if (thisFinder.selectedSquares.hasOwnProperty(neighbour)){
          const neighbourObj = thisFinder.selectedSquares[neighbour];

          newArrayWithSquares.push(neighbourObj);
          neighbourObj.setMarkVolume(square.markVolume/2);
          delete thisFinder.selectedSquares[neighbourObj.name];
        }
      }

      delete thisFinder.selectedSquares[square.name];
    }

    if (newArrayWithSquares.indexOf(thisFinder.startAndEndSquares['start']) !== -1){
      thisFinder.selectedSquares = {};
      return 'Finish!';
    } else {
      return newArrayWithSquares;
    }


    // if (thisFinder.activeSquares.indexOf(primeSquare.element) !== -1){
    //   delete thisFinder.activeSquares[thisFinder.activeSquares.indexOf(primeSquare.element)];
    // }

    // for (let neighbour of primeSquare.neighbours) {
    //   if (thisFinder.selectedSquares.hasOwnProperty(neighbour) && thisFinder.activeSquares.indexOf(thisFinder.selectedSquares[neighbour].element) !== -1) {
    //     thisFinder.selectedSquares[neighbour].element.setAttribute('mark-volume', markVolume);
    //     markVolume = markVolume / 2;
    //   }
    // }

    // for (let neighbour of primeSquare.neighbours) {
    //   if (thisFinder.selectedSquares.hasOwnProperty(neighbour) && thisFinder.activeSquares.indexOf(thisFinder.selectedSquares[neighbour].element) !== -1) {
    //     const neighbourObj = thisFinder.selectedSquares[neighbour];

    //     neighbourObj.previousSquare = primeSquare;
    //     neighbourObj.setMarkVolume(primeSquare.markVolume/2);
    //     thisFinder.selectedSquaresSegregated.push(primeSquare.element);
    //     thisFinder.giveMarkVolumeToNeighbours(neighbourObj);
    //   } else if (thisFinder.selectedSquares.hasOwnProperty(neighbour) && thisFinder.selectedSquares[neighbour].markVolume > primeSquare.markVolume * 2){
    //     const neighbourObj = thisFinder.selectedSquares[neighbour];

    //     primeSquare.markVolumeChanged = false;
    //     primeSquare.setMarkVolume(neighbourObj.markVolume/2);
    //     thisFinder.giveMarkVolumeToNeighbours(primeSquare);
    //   }
    // }

    // for (let square in thisFinder.selectedSquares) {

    //   const squareObj = thisFinder.selectedSquares[square];
    //   const neighbours = squareObj.neighbours;
    //   console.log(thisFinder.selectedSquares);
    //   // let theBiggestMarkVolume = 0; 
    //   // let previousSquare = null;

    //   for (let neighbour of neighbours) {
    //     if (thisFinder.selectedSquares.hasOwnProperty(neighbour)) {
    //       if (thisFinder.selectedSquares[neighbour].markVolume == primeSquare.markVolume && thisFinder.activeSquares.indexOf(thisFinder.selectedSquares[neighbour].element) !== -1) {
    //         const volume = primeSquare.markVolume / 2;

    //         squareObj.setMarkVolume(volume);
    //       }
    //     }
    //   }

    // if (theBiggestMarkVolume !== 0) {
    //   const volume = thisFinder.selectedSquares[previousSquare].markVolume / 2;

    //   squareObj.setMarkVolume(volume);
    //   delete thisFinder.activeSquares[thisFinder.activeSquares.indexOf(squareObj.element)];
    // }
    // }
  }

  // showTheShorstestPath(primeSquare, markVolume) {
  //   const thisFinder = this;

  //   for (let neighbour of primeSquare.neighbours) {
  //     if (thisFinder.selectedSquares.hasOwnProperty(neighbour)) {
  //       const neighbourVol = thisFinder.selectedSquares[neighbour].element.getAttribute('mark-volume');

  //       if (neighbourVol == markVolume * 2) {
  //         console.log(primeSquare.element);
  //         primeSquare.nextSquare = thisFinder.selectedSquares[neighbour];
  //         thisFinder.selectedSquares[neighbour].element.classList.add('startAndEnd');
  //         thisFinder.showTheShorstestPath(thisFinder.selectedSquares[neighbour], markVolume * 2);
  //       }
  //     }
  //   }
  // }
}



export default Finder;