
const elasticlunr = require('elasticlunr');
const buildCorpus = require('./messages');
const messages = buildCorpus();
let start;


var idx = elasticlunr(function () {
  this.setRef('id');
  this.addField('text');
});
console.log('adding docs to index');
start = Date.now();
messages.forEach(doc => idx.addDoc(doc));
console.log('done adding docs to index', Date.now() - start);


// // this is how you can add a new message to the index
// let start = Date.now();
// console.log('adding and reindexing')
// indexBuilder.add(newMessage);

// idx = indexBuilder.build();
console.time('Add message to index');
idx.addDoc({
  id: 300000,
  to: { first: 'Eager', last: 'Pare' },
  from: { first: 'Friendly', last: 'Mclean' },
  text: 'KEYWORD KEYWORD KEYWORD !!!!'
});
console.timeEnd('Add message to index');
start = Date.now();
let results = idx.search("YW", {
  fields: {
      text: {boost: 1}
  },
 expand: true
}).map(r => {
  return r.ref;
});
console.log('total search time', Date.now() - start)
console.log('# of results found', results.length);
// console.log(results);
// console.log(messages);