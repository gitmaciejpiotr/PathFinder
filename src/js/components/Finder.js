import { templates } from '../settings.js';
import { utils } from '../utils.js';
import Square from './Square.js';

class Finder {
  constructor(element) {
    const thisFinder = this;

    thisFinder.selectedSquares = {};
    thisFinder.wrapper = element;

    thisFinder.getElements(element);
    thisFinder.render();
    thisFinder.initActions();
    AOS.init();
  }

  getElements(element) {
    const thisFinder = this;

    thisFinder.dom = {};

    thisFinder.dom.wrapper = element;

    thisFinder.dom.matrixContainer = document.querySelector('.finder-wrapper');

    // thisFinder.dom.booksList = document.querySelector('.books-list');
    // thisFinder.dom.filtersContainer = document.querySelector('.filters div');
  }

  render() {
    const thisFinder = this;

    let generatedHTML = templates.finderPage();

    // thisFinder.dom = {};

    // thisFinder.dom.wrapper = element;

    /* Create element using utils.createElementFromHTML */
    thisFinder.element = utils.createDOMFromHTML(generatedHTML);

    let generalInnerHTML = '';

    for (let i = 0; i < thisFinder.element.children.length; i++) {

      let child = thisFinder.element.children[i];

      if (child.classList.contains('matrix')){
        const button = thisFinder.element.querySelector('.square');
        const row = thisFinder.element.querySelector('.row');
        const matrix = thisFinder.element.querySelector('.matrix');
        let buttons = '';
        let rows = '';
    
        for(let i = 0; i < 10; i++){
    
          row.setAttribute('data-id', 1 + i);
    
          for(let j = 0; j < 10; j++){
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

    thisFinder.dom.matrixContainer.addEventListener('click', function (event) {
      event.preventDefault();
      console.log(event.target.offsetParent.classList);
      if (event.target.offsetParent.classList.contains('finder-parag')) {
        // console.log('heja');
        thisFinder.addClassActive(event);
      }
    });

    // thisFinder.dom.filtersContainer.addEventListener('click', function (event) {
    //   thisFinder.addFilterCategory(event);
    // });
  }

  addClassActive(event){
    const thisFinder = this;

    const square = new Square(event.target);
    const squareName = square.row + ':' + square.col;
    console.log(squareName);

    if (thisFinder.checkIfFitsToPattern(square, squareName)){
      console.log('heja');
      console.log(square);
      thisFinder.selectedSquares[squareName] = square;
      event.target.classList.add('active');
    }
  }

  checkIfFitsToPattern(square, squareName){
    const thisFinder = this;
    const neighnours = [];

    for(let i = 0; i < 4; i++){
      let row = 0;
      let col = 0;
      if (i == 0){
        row = parseInt(square.row) - 1;
        col = parseInt(square.col);
      } else if (i == 1){
        row = parseInt(square.row) + 1;
        col = parseInt(square.col);
      } else if (i == 2){
        row = parseInt(square.row);
        col = parseInt(square.col) - 1;
      } else if (i == 3){
        row = parseInt(square.row);
        col = parseInt(square.col) + 1;
      }

      let neighbourName = row.toString() + ':' + col.toString();
      neighnours.push(neighbourName);
    }

    if(thisFinder.selectedSquares.hasOwnProperty(squareName)){
      return false;
    } else if(utils.isEmpty(thisFinder.selectedSquares)) {
      return true;
    } else {
      for (let neighbour of neighnours){
        console.log(neighbour);
        if(thisFinder.selectedSquares.hasOwnProperty(neighbour)){
          return true;
        }
      }
    }

    return false;
  }
}

export default Finder;