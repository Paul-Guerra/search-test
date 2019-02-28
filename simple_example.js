const buildCorpus = require('./messages');
let messages = buildCorpus(100000, "KEY WORD");
let start;

let results = [];
console.time('searching for docs with "KEY WORD"');
results = messages.filter(msg => msg.text.indexOf("KEY WORD") > -1).map(msg => msg.id);
console.timeEnd('searching for docs with "KEY WORD"');


console.log("messages: ", messages.length);
// console.log("results: ", results);
// console.log("messages: ", messages);
