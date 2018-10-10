
const Fuse = require('fuse.js');
const buildCorpus = require('./messages');

const messages = buildCorpus(5);
var options = { keys: ['text'] };
var fuse = new Fuse(messages, options)

let newMessage = {
  id: 11,
  to: { first: 'Eager', last: 'Pare' },
  from: { first: 'Friendly', last: 'Mclean' },
  text: 'KEYWORD KEYWORD KEYWORD !!!!'
};

fuse.list.push(newMessage);

let results = fuse.search('KEYWORD');
console.log(results);