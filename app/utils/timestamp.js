// Shim Date.now function
if (!Date.now) {
  Date.now = function() {
    return new Date().getTime();
  }
}

function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

module.exports = { getTimestamp };
