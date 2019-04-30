import moment from 'moment';

export function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function getTimestampForXDaysInFuture(numDays) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const dateOffset = numDays * 24 * 60 * 60;

  return currentTimestamp + dateOffset;
}

export function prettifyDatetime(timestamp) {
  return moment.unix(timestamp).format('MMMM D, YYYY h:mm a');
}
