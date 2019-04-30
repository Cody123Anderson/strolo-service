module.exports.cleanObj = function(obj) {
  for (let propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    } else if (obj[propName] === '') {
      obj[propName] = null;
    }
  }
};