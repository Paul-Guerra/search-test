require('babel-register');
const lipsum = require('lorem-ipsum');


function makeMessageText(prefix = '') {
  return lipsum({
    count: 1,
    units: 'sentences',
    sentenceLowerBound: 5,
    sentenceUpperBound: 50,
    paragraphLowerBound: 3,
    paragraphUpperBound: 7,
    random: Math.random,
    format: 'plain',
  });
}

function makeNewMessage(id) {
  return {
    id,
    body: makeMessageText(id),
  };
}

const size = 1000000;
const pattern = /um/gi;
let messages = [];
let allTheMessages = '';
function buildMessages() {
  for (let i = 0; i < size; i++) {
    let msg = makeNewMessage(i);
    messages.push(msg);
    allTheMessages += `${msg.body}\n\n`;
  }
}

buildMessages();
// console.log(allTheMessages);
let start = Date.now();
let results = messages.filter((msg) => {
  // console.log(msg.body.match(pattern));
  return !!msg.body.match(pattern);
});
console.log('filtering messages by pattern time', Date.now() - start, 'ms', results.length);
start = Date.now();
results = allTheMessages.match(pattern);
console.log('Regex on giant message string', Date.now() - start, 'ms', results ? results.length : results);
