const SearchIndex = require('./search/search.worker').Search;
const buildCorpus = require('./messages');
let messages = buildCorpus(1000000, "KEY WORD");

let start;

const search = new SearchIndex();

console.log('Begin indexing');
console.time('adding docs to index');
messages.forEach((doc, i) => search.add(doc.text, i));
console.timeEnd('adding docs to index');

console.time('searching for docs with "KEY WORD"');
let results = search.search("KEY WORD");
console.timeEnd('searching for docs with "KEY WORD"');

console.log("messages: ", messages.length);
console.log("results: ", results.size);
// console.log("messages: ", messages);
