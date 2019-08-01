import moment from 'moment';

export function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function convertStringToUnix(datetimeString) {
  return (new Date(datetimeString).valueOf() / 1000);
}

export function getTimestampForXDaysInFuture(numDays) {
  const currentTimestamp = getCurrentTimestamp();
  const dateOffset = numDays * 24 * 60 * 60;

  return currentTimestamp + dateOffset;
}

export function prettifyDatetime(timestamp) {
  return moment.unix(timestamp).format('MMMM D, YYYY h:mm a');
}
