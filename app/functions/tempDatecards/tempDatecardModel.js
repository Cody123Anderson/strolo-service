import _ from 'lodash';

const tempDatecard = {
  tempDatecardId: '',
  shopifyOrderId: '',
  shopifyOrderNumber: '',
  createdAt: '',
  updatedAt: '',
  cancelledAt: '',
  deletedAt: '',
  dealItems: [{
    redeemedAt: '',
    imageUrl: '',
    shopifyLineItemId: '',
    shopifyProductId: '',
    quantity: 0,
    name: '',
    title: '',
    variantTitle: '',
    retailPrice: '',
    price: '',
    businessName: ''
  }],
  defaultCleverPhrase: '',
  customCleverPhrase: '',
  status: '',
  expirationDate: '',
  userEmail: '',
  userFirstName: '',
  userLastName: '',
  otherUserEmail: '',
  otherUserFirstName: ''
};

export const tempDatecardStatuses = {
  active: 'Active',
  redeemed: 'Redeemed',
  cancelled: 'Cancelled',
  deleted: 'Deleted'
};

function getTempDatecardKeys() {
  return Object.keys(tempDatecard);
}

export function getTempDatecard(data) {
  const tempDatecardKeys = getTempDatecardKeys();
  const prunedData = _.cloneDeep(data);

  _.forIn(data, (value, key) => {
    // check if key exists on tempDatecard object
    const index = _.indexOf(tempDatecardKeys, key);

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
