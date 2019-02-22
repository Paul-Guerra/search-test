require('babel-register');
const allTheWords = require('an-array-of-english-words');
const PartialMatcher = require('../partial-match').default;

let pm = new PartialMatcher();

console.log('Building dictionary of words');
allTheWords.forEach((word) => {
  pm.add(word);
});
allTheWords.forEach((word) => {
  pm.add(word);
});
allTheWords.forEach((word) => {
  pm.add(word);
});
console.log(
  'Finished building dictionary of',
  pm._allTheWords.split(/\n/).length - 1,
  'words'
); // -1 because split leaves a trailing empty string in the array

let query = 'e';
// common bigrams TH, ER, ON, and AN
let start = Date.now();
console.log('searching for words with', query);

let syncMatches = pm.findSync(query);
console.log('[findSync] found', syncMatches.length, 'matches in', Date.now() - start, 'ms');
