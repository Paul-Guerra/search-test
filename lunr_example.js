
const lunr = require('lunr');
const buildCorpus = require('./messages');
const messages = buildCorpus();
let indexBuilder;
let idx = lunr(function(builder) {
  // keep a reference to the builder in scope so you can add documents later
  indexBuilder = builder;
  this.ref('id')
  this.field('text')
  console.log('indexing...');
  messages.forEach(function (doc) {
    this.add(doc)
  }, this)
});

let newMessage = {
  id: 11,
  to: { first: 'Eager', last: 'Pare' },
  from: { first: 'Friendly', last: 'Mclean' },
  text: 'KEYWORD KEYWORD KEYWORD !!!!'
};

// this is how you can add a new message to the index
let start = Date.now();
console.log('adding and reindexing')
indexBuilder.add(newMessage);

idx = indexBuilder.build();
console.log('adding and reindexing - total time', Date.now() - start)

idx.search("KEYWORD").map(r => {
  return r.ref;
});
// console.log(idx);