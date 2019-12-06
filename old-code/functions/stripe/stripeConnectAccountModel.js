import _ from 'lodash';

const stripeConnectAccount = {
  stripeConnectAccountId: '',
  createdAt: '',
  updatedAt: ''
};

function getObjectKeys() {
  return Object.keys(stripeConnectAccount);
}

export function getStripeConnectAccount(data) {
  const objectKeys = getObjectKeys();
  const prunedData = _.cloneDeep(data);

  _.forIn(data, (value, key) => {
    // check if key exists on tempDatecard object
    const index = _.indexOf(objectKeys, key);

    if (index < 0) {
      // It doesn't exist, don't allow it to be added to db
      delete prunedData[key];
    } else if (!value) {
      // No value, delete it
      delete prunedData[key];
    }
  });

  return prunedData;
}
