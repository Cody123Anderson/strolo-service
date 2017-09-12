import { getText } from './textHelpers';
import bankvalid from './isBankNumber';
import ajax from './ajax';
import apiPath from './apiPaths';

const text = getText();
const validators = {
  isRequired: value => {
    return new Promise((resolve, reject) => {
      if (value) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_required });
      }
    });
  },

  isEmail: value => {
    return new Promise((resolve, reject) => {
      const re = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (re.test(value)) {
        resolve({ isValid: true });
      }
      else {
        resolve({ isValid: false, message: text.validators.is_email });
      }
    });
  },

  isEmailTaken: value => {
    return new Promise((resolve, reject) => {
      if (value) {
        const url = apiPath.checkEmailAddressExists + encodeURIComponent(value);
        const data = {};
        const method = 'GET';

        ajax(url, data, (data) => {
          if (data.user_exists === true) {
            resolve({
              isValid: false,
              message: text.validators.is_email_taken
            });
          } else {
            resolve({ isValid: true });
          }
        }, (err) => {
          // todo - handle this error.
          resolve({ isValid: true });
        }, method);
      } else {
        resolve({ isValid: true });
      }
    });
  },

  isPassword: value => {
    return new Promise((resolve, reject) => {
      const re = /^.*(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d]).*$/;

      if (re.test(value)) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_password });
      }
    });
  },

  isPhoneNumber: value => {
    return new Promise((resolve, reject) => {
      const re = /\[\d{2}\]\d{4}\-\d{4}/;
      const re2 = /\d{10}/;

      if (re.test(value) || re2.test(value)) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_phone_number });
      }
    });
  },

  startWithZero: value => {
    return new Promise((resolve, reject) => {
      if (value[1] != 0) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.start_with_zero });
      }
    });
  },

  isNumeric: value => {
    return new Promise((resolve, reject) => {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_numeric });
      }
    });
  },

  isName: value => {
    return new Promise((resolve, reject) => {
      if (value.length <= 35) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_name });
      }
    });
  },

  isNameTooShort: value => {
    return new Promise((resolve, reject) => {
      if (value.length >= 3) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_name_too_short });
      }
    });
  },

  isValidName: value => {
    return new Promise((resolve, reject) => {
      const numbersAndLetters = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/;

      if (numbersAndLetters.test(value) || value === '') {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_valid_name });
      }
    });
  },

  isValidMerchantName: value => {
    return new Promise((resolve, reject) => {
      const numbersAndLetters = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/;

      if (numbersAndLetters.test(value)) {
        resolve({ isValid: true });
      } else {
        resolve({
          isValid: false,
          message: text.validators.is_valid_merchant_name
        });
      }
    });
  },

  isPostalCode: value => {
    return new Promise((resolve, reject) => {
      if (value.length === 5) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_postal_code });
      }
    });
  },

  isInstallmentThreshold: value => {
    return new Promise((resolve, reject) => {
      if (value >= 500) {
        resolve({ isValid: true });
      } else {
        resolve({
          isValid: false,
          message: text.validators.is_installment_threshold
        });
      }
    });
  },

  isBankCode: value => {
    return new Promise((resolve, reject) => {
      if (value.length === 18) {
        resolve({
          isValid: true
        });
      } else {
        resolve({
          isValid: false,
          message: text.validators.is_bank_code
        });
      }
    });
  },

  isBankNumberValid: value => {
    return new Promise((resolve, reject) => {
      if (bankvalid(value)) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_bank_code });
      }
    });
  },

  isURL: value => {
    return new Promise((resolve, reject) => {
      const re = /^https?:\/\/\S+/;

      if (re.test(value) || value === '') {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_url });
      }
    });
  },

  isPromoCode: value => {
    return new Promise((resolve, reject) => {
      if(value === '') { // valid
        resolve({ isValid: true });
      } else if (value.length === 5) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_promo_code });
      }
    });
  },

  isPromoValid: value => {
    return new Promise((resolve, reject) => {
      if (value) {
        const url = apiPath.isPromoCode + value;
        const data = {};
        const method = 'GET';

        ajax(url, data, (data) => {
          if (data.is_valid === false) {
            resolve({
              isValid: false,
              message: text.validators.is_email_taken
            });
          } else {
            resolve({ isValid: true });
          }
        }, (err) => {
          // todo - handle this error.
          resolve({ isValid: false, message: text.validators.is_email_taken });
        }, method);
      } else {
        resolve({ isValid: false, message: text.validators.is_email_taken });
      }
    });
  },

  matchesField: (value, match) => {
    return new Promise((resolve, reject) => {
      if (value === match) {
        resolve({ isValid: true });
      } else {
        resolve({ isValid: false, message: text.validators.is_email_matching });
      }
    });
  }
};

module.exports = validators;
