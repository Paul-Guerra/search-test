
const lunr = require('lunr');
const buildCorpus = require('./messages');

const messages = buildCorpus(5);
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
indexBuilder.add(newMessage);
idx = indexBuilder.build();

console.log(idx.search("KEYWORD").map(r => {
  return r.ref;
}));
// console.log(idx);