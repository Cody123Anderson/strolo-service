const _ = require('lodash');

exports.getUpdateExpression = (obj) => {
  let expressionString = 'set';
  let attributeNames = {};
  let attributeValues = {};
  let count = 0;

  _.forOwn(obj, (value, key) => {
    if (count > 0) {
      expressionString += ',';
    }

    expressionString += ` #${key}=:${key}`;
    attributeNames[`#${key}`] = key;
    attributeValues[`:${key}`] = value;
    count += 1;
  });

  return { expressionString, attributeNames, attributeValues };
}

exports.batchKeysFormat = (values, key) => {
  return values.map((val) => {
    return { [key]: val };
  });
}
