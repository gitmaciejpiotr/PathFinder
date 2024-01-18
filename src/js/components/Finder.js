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
    thisFinder.dom.header = thisFinder.dom.sectionContainer.querySelector('.parag-text h2');
  }

  render(element) {
    const thisFinder = this;

    let generatedHTML = templates.finderPage();

    thisFinder.element = utils.createDOMFromHTML(generatedHTML);

    thisFinder.selectedSquares = {};
    thisFinder.squaresInOrder = {};
    thisFinder.startAndEndSquares = {
      'start': '',
      'end': ''
    };
    thisFinder.activeSquares = [];
    thisFinder.previousClickedSqaure = null;

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
    thisFinder.dom.header.innerHTML = 'DRAW ROUTES';
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
    if (thisFinder.previousClickedSqaure !== null) {
      thisFinder.previousClickedSqaure.element.classList.remove('noHoverEffect');
    }

    if (thisFinder.checkIfFitsToPattern(square)) {
      thisFinder.selectedSquares[square.name] = square;
      thisFinder.activeSquares.push(square.element);
      event.target.classList.remove('proposed');
      event.target.classList.add('active');

      for (let neighbour of square.neighbours) {
        if (neighbour !== null) {
          const data = neighbour.split(':');
          const row = data[0];
          const col = data[1];
          const rowDOM = thisFinder.dom.matrix.querySelector('.row[data-id = "' + row + '"]');
          const neighbourDOM = rowDOM.querySelector('.square[data-id = "' + col + '"]');
          if (!neighbourDOM.classList.contains('active')) {
            neighbourDOM.classList.add('proposed');
          }
        }
      }
    }

    thisFinder.previousClickedSqaure = square;
  }

  checkIfFitsToPattern(square) {
    const thisFinder = this;

    if (thisFinder.selectedSquares.hasOwnProperty(square.name)) {
      if (thisFinder.checkIfSelectedAreaIsNotCut(square)) {
        square.element.classList.remove('active');
        square.element.classList.add('noHoverEffect');
        square.element.classList.add('proposed');
        delete thisFinder.selectedSquares[square.name];
        const index = thisFinder.activeSquares.indexOf(square.element);
        thisFinder.activeSquares = thisFinder.activeSquares.slice(0, index).concat(thisFinder.activeSquares.slice(index + 1));
        let allActiveSquaresNeighbours = thisFinder.getAllActiveSquaresNeighboursIntoArray(square);
        for (let neighbour of square.neighbours) {
          if (allActiveSquaresNeighbours.indexOf(neighbour) == -1 && neighbour !== null) {
            const data = neighbour.split(':');
            const row = data[0];
            const col = data[1];
            const rowDOM = thisFinder.dom.matrix.querySelector('.row[data-id = "' + row + '"]');
            const neighbourDOM = rowDOM.querySelector('.square[data-id = "' + col + '"]');
            neighbourDOM.classList.remove('proposed');
          }
        }
        return false;
      } else {
        return false;
      }
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

  getAllActiveSquaresNeighboursIntoArray(square) {
    const thisFinder = this;

    const allActiveSqauresNeighbours = [];

    for (let activeSquare in thisFinder.selectedSquares) {
      if (thisFinder.selectedSquares[activeSquare].name !== square.name) {
        for (let neighbour of thisFinder.selectedSquares[activeSquare].neighbours) {
          allActiveSqauresNeighbours.push(neighbour);
        }
      }
    }

    return allActiveSqauresNeighbours;
  }

  checkIfSelectedAreaIsNotCut(square) {
    const thisFinder = this;

    const activeNeighbours = [];

    for (let neighbour of square.neighbours) {
      if (thisFinder.selectedSquares.hasOwnProperty(neighbour)) {
        activeNeighbours.push(thisFinder.selectedSquares[neighbour]);
      }
    }

    if (activeNeighbours.length == 1) {
      return true;
    } else {
      const activeSquaresToDelete = [];
      let returnFlag = true;

      for (let activeSquare of thisFinder.activeSquares) {
        activeSquaresToDelete.push(activeSquare);
      }

      delete activeSquaresToDelete[activeSquaresToDelete.indexOf(square.element)];
      activeNeighbours[0].markVolume = 0;
      thisFinder.giveMarkToSquares(activeNeighbours[0], activeSquaresToDelete);

      for (let activeSquare in thisFinder.selectedSquares) {
        if (thisFinder.selectedSquares[activeSquare].markVolume == null && thisFinder.selectedSquares[activeSquare].name !== square.name) {
          returnFlag = false;
        }
        thisFinder.selectedSquares[activeSquare].markVolume = null;
      }
      console.log(' ');

      return returnFlag;
    }
  }

  giveMarkToSquares(square, activeSquaresToDelete) {
    const thisFinder = this;

    delete activeSquaresToDelete[activeSquaresToDelete.indexOf(square.element)];
    console.log(activeSquaresToDelete);

    for (let neighbour of square.neighbours) {
      if (thisFinder.selectedSquares.hasOwnProperty(neighbour) && activeSquaresToDelete.indexOf(thisFinder.selectedSquares[neighbour].element) !== -1) {
        thisFinder.selectedSquares[neighbour].markVolume = square.markVolume;
        thisFinder.giveMarkToSquares(thisFinder.selectedSquares[neighbour], activeSquaresToDelete);
      }
    }
  }

  setSelectStartAndEndMode() {
    const thisFinder = this;

    thisFinder.dom.bottomButton.innerHTML = 'COMPUTE';
    thisFinder.dom.header.innerHTML = 'PICK START AND FINISH';

    for (let square of thisFinder.dom.allSquares) {
      square.classList.add('noHoverEffect');
      square.classList.remove('proposed');
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
    const thisFinder = this;
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
    thisFinder.dom.header.innerHTML = 'THE BEST ROUTE IS...';

    thisFinder.dom.bottomButton.removeEventListener('click', thisFinder.setComputeShortestPathModeFunc);
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

  addSetResetAppFunc(event) {
    const thisFinder = this;

    event.preventDefault();

    thisFinder.render(thisFinder.wrapper);
    thisFinder.getElements();
    thisFinder.initActions();
  }
}



export default Finder;