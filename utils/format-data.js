module.exports.cleanObj = function(obj) {
  for (let propName in obj) {
    if (obj[propName] === undefined) {
      delete obj[propName];
    }
  }
};

module.exports.parseBody = function(body) {
  if (typeof body === 'string') {
    return { ...JSON.parse(body) };
  }

  return { ...body };
};