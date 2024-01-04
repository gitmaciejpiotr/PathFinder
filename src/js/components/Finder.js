import { templates } from '../settings.js';
import { utils } from '../utils.js';

class Finder {
  constructor(element) {
    const thisFinder = this;

    thisFinder.render(element);
    // AOS.init();
  }

  render(element) {
    const thisFinder = this;

    const generatedHTML = templates.finderPage();

    thisFinder.dom = {};

    thisFinder.dom.wrapper = element;

    /* Create element using utils.createElementFromHTML */
    thisFinder.element = utils.createDOMFromHTML(generatedHTML);

    /* Add element to #menu */
    thisFinder.dom.wrapper.innerHTML = generatedHTML;
  }
}

export default Finder;