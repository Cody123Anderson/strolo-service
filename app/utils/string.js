/**
 * Creates a random all caps letter string
 * @param {number} stringLength
 */
export function getRandomString(stringLength){
  const chars = "0123456789ABCDEFGHJKLMNOPQRSTVWXTZ";
  let randomstring = '';

  for (let i=0; i< stringLength; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  
  return randomstring;
}