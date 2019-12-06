export function prettifyCurrency(amount, locale = 'en-US') {
  return (+amount).toLocaleString(locale, { style: 'currency', currency: 'USD' });
}