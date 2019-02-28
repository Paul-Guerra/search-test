const SearchIndex = require('./search/search.worker').Search;
const buildCorpus = require('./messages');
const messages = buildCorpus();
let start;

const search = new SearchIndex();

console.time('adding docs to index');
messages.forEach((doc, i) => search.add(doc.text, i));
console.timeEnd('adding docs to index');

console.time('searching for docs with "KEYWORD"');
results = search.search("KEYWORD");
console.timeEnd('searching for docs with "KEYWORD"');

console.log("results: ", results);
console.log("messages: ", messages
);
