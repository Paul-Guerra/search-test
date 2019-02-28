const SearchIndex = require('./search/search.worker').Search;
const buildCorpus = require('./messages');
let messages = buildCorpus(600000, "KEY WORD");

let start;

const search = new SearchIndex();

console.time('adding docs to index');
messages.forEach((doc, i) => search.add(doc.text, i));
console.timeEnd('adding docs to index');

console.time('searching for docs with "KEY WORD"');
results = search.search("KEY WORD");
console.timeEnd('searching for docs with "KEY WORD"');

console.log("messages: ", messages.length);
// console.log("results: ", results);
// console.log("messages: ", messages);
