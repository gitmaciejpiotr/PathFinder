export const utils = {}; // eslint-disable-line no-unused-vars

utils.createDOMFromHTML = function(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

utils.hasValue = (obj, value) => Object.values(obj).includes(value);

utils.isEmpty = (obj) => {
  return JSON.stringify(obj) === '{}';
}