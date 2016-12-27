module.exports = function(title) {
  var words_arr = title.split(' ');
  words_arr = words_arr.map(function(word) {
    word = word.split('');
    if (typeof word[0] === 'string') {
      word[0] = word[0].toUpperCase();
    }
    word = word.join('');
    return word;
  });
  var newTitle = words_arr.join(' ');

  return newTitle;
}
