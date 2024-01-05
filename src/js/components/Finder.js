import { templates } from '../settings.js';
import { utils } from '../utils.js';

class Finder {
  constructor(element) {
    const thisFinder = this;

    thisFinder.render(element);
    AOS.init();
  }

  render(element) {
    const thisFinder = this;

    let generatedHTML = templates.finderPage();

    thisFinder.dom = {};

    thisFinder.dom.wrapper = element;

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
        let letters = 'abcdefghij';
    
        for(let i = 0; i < letters.length; i++){
    
          row.setAttribute('data-id', letters[i]);
    
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
}

export default Finder;