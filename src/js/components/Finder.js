import { templates } from '../settings.js';
import { utils } from '../utils.js';
import Square from './Square.js';

class Finder {
  constructor(element) {
    const thisFinder = this;

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

    thisFinder.selectedSquares = {};
    thisFinder.squaresInOrder = {};
    thisFinder.startAndEndSquares = {
      'start': '',
      'end': ''
    };
    thisFinder.activeSquares = [];

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
    thisFinder.addClassActiveFunc = thisFinder.addAddClassActiveFunc.bind(thisFinder);
    thisFinder.setSelectStartAndEndModeFunc = thisFinder.addSetSelectStartAndEndModeFunc.bind(thisFinder);
    thisFinder.setComputeShortestPathModeFunc = thisFinder.addSetComputeShortestPathModeFunc.bind(thisFinder);


    thisFinder.dom.sectionContainer.addEventListener('click', thisFinder.addClassActiveFunc);

    thisFinder.dom.bottomButton.addEventListener('click', thisFinder.setSelectStartAndEndModeFunc);

    thisFinder.dom.bottomButton.innerHTML = 'FINISH DRAWING';
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
    if (event.target.parentElement.classList.contains('row')) {
      thisFinder.addClassActive(event);
    }
  }

  addClassActive(event) {
    const thisFinder = this;
    const square = new Square(event.target, thisFinder.dom.matrix);

    thisFinder.dom.bottomButton.removeEventListener('click', thisFinder.setResetAppFunc);

    // thisFinder.dom.computeSpan = thisFinder.dom.computeSpan.classList.add('hidden');
    // thisFinder.dom.againSpan = thisFinder.dom.againSpan.classList.remove('hidden');

    if (thisFinder.checkIfFitsToPattern(square)) {
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
        if (thisFinder.selectedSquares.hasOwnProperty(neighbour)) {
          return true;
        }
      }
    }

    return false;
  }

  setSelectStartAndEndMode() {
    let thisFinder = this;

    thisFinder.dom.bottomButton.innerHTML = 'COMPUTE';

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

  addSetComputeShortestPathModeFunc(event) {
    const thisFinder = this;

    event.preventDefault();
    thisFinder.computeShortestPath();
  }

  computeShortestPath() {
    const thisFinder = this;

    const endSquare = thisFinder.startAndEndSquares['end'];
    endSquare.setMarkVolume(1);
    const startSquare = thisFinder.startAndEndSquares['start'];
    const arrayWithSquares = [endSquare];

    let squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(arrayWithSquares);


    while (utils.isEmpty(thisFinder.selectedSquares) === false) {
      squaresToMark = thisFinder.giveMarkVolumeToActiveSquares(squaresToMark);
    }

    const startSquareMarkValue = thisFinder.startAndEndSquares['start'].element.getAttribute('mark-volume');
    thisFinder.startAndEndSquares['start'].setMarkVolume(startSquareMarkValue);

    let squareToShow = thisFinder.showTheShortestPath(startSquare);

    do {
      squareToShow = thisFinder.showTheShortestPath(squareToShow);
    } while (squareToShow !== endSquare);

    thisFinder.dom.bottomButton.innerHTML = 'START AGAIN';

    thisFinder.dom.bottomButton.removeEventListener('click', thisFinder.setComputeShortestPathModeFunc);
    // thisFinder.dom.sectionContainer.addEventListener('click', thisFinder.addClassActiveFunc);
    thisFinder.setResetAppFunc = thisFinder.addSetResetAppFunc.bind(thisFinder);
    thisFinder.dom.bottomButton.addEventListener('click', thisFinder.setResetAppFunc);
  }

  giveMarkVolumeToActiveSquares(arrayWithSquares) {
    const thisFinder = this;

    const newArrayWithSquares = [];

    for (let square of arrayWithSquares) {
      const neighbours = square.neighbours;

      for (let neighbour of neighbours) {
        if (thisFinder.selectedSquares.hasOwnProperty(neighbour)) {
          const neighbourObj = thisFinder.selectedSquares[neighbour];

          newArrayWithSquares.push(neighbourObj);
          neighbourObj.setMarkVolume(square.markVolume / 2);
          neighbourObj.setPreviousMarkedSquare(square);
          thisFinder.squaresInOrder[neighbourObj.name] = neighbourObj;
          delete thisFinder.selectedSquares[neighbourObj.name];
        }
      }

      delete thisFinder.selectedSquares[square.name];
    }


    return newArrayWithSquares;
  }

  showTheShortestPath(consideredSquare) {
    const thisFinder = this;

    if (consideredSquare == undefined) {
      return thisFinder.startAndEndSquares['end'];
    } else if (consideredSquare !== thisFinder.startAndEndSquares['start']) {
      consideredSquare.element.classList.add('startAndEnd');
    }

    for (let neighbour of consideredSquare.neighbours) {

      if (thisFinder.squaresInOrder[neighbour] !== undefined) {
        if (thisFinder.squaresInOrder[neighbour].markVolume == consideredSquare.markVolume * 2 && thisFinder.squaresInOrder[neighbour].shown == false) {
          const neighbourObj = thisFinder.squaresInOrder[neighbour];
          thisFinder.squaresInOrder[neighbour].shown = true;

          return neighbourObj;
        }
      }
    }
  }

  addSetResetAppFunc(event){
    const thisFinder = this;

    event.preventDefault();

    thisFinder.render(thisFinder.wrapper);
    thisFinder.getElements();
    thisFinder.initActions();
  }
}



export default Finder;