module.exports.cleanObj = function(obj) {
  for (let propName in obj) {
    if (obj[propName] === undefined) {
      delete obj[propName];
    }
  }
};