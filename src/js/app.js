import AboutPage from './components/AboutPage.js';
import Finder from './components/Finder.js';

const app = {

  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector('#pages').children;
    thisApp.navLinks = document.querySelectorAll('.main-nav a');

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;

      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    for(let page of thisApp.pages){
      page.classList.toggle('active', page.id == pageId);
    }

    for(let link of thisApp.navLinks){
      link.classList.toggle(
        'active', 
        link.getAttribute('href') == '#' + pageId
      );
    }
    
  },

  initAboutPage: function () {
    const thisApp = this;

    thisApp.aboutPage = document.querySelector('.about-wrapper');

    new AboutPage(thisApp.aboutPage);
  },

  initFinder: function () {
    const thisApp = this;

    thisApp.finderPage = document.querySelector('.finder-wrapper');

    new Finder(thisApp.finderPage);
  },

  init: function () {
    const thisApp = this;


    thisApp.initPages();

    thisApp.initAboutPage();
    thisApp.initFinder();
  },
};

app.init();
