import { templates } from '../settings.js';
import { utils } from '../utils.js';

class AboutPage {
  constructor(element) {
    const thisAboutPage = this;

    thisAboutPage.render(element);
    AOS.init();
  }

  render(element) {
    const thisAboutPage = this;

    const generatedHTML = templates.aboutPage();

    thisAboutPage.dom = {};

    thisAboutPage.dom.wrapper = element;

    thisAboutPage.element = utils.createDOMFromHTML(generatedHTML);

    thisAboutPage.dom.wrapper.innerHTML = generatedHTML;
  }
}

export default AboutPage;