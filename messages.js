// import loremIpsum from 'lorem-ipsum';
const loremIpsum = require('lorem-ipsum');
const makeRandomName = require('./name-generator');

const DEFAULT_SIZE = 10;

function buildCorpus(size = DEFAULT_SIZE, needle = 'KEYWORD') {
  let messages = [];
  let haystack = makeHaystack(size);
  messages = insertNeedles(haystack, needle, size/2);

  console.log('generated payload', messages.length);
  return messages;
}

function makeHaystack(size = DEFAULT_SIZE) {
  const haystack = [];
  for(let i = 0; i < size; i += 1) {
    

    let text = loremIpsum({
      count: 10,
      units: 'word',
      random: Math.random,
      format: 'plain',
    });
    let entry = {
      id: i,
      to: makeRandomName(),
      from: makeRandomName(),
      text,
    };
    haystack.push(entry);
  }
  return haystack;
}

function insertNeedles(haystack, needle = 'KEYWORD', count = DEFAULT_SIZE/2) {
  let index = count;
  let updatedMessages = new Set();
  while(index) {
    const min = 0;
    const max = haystack.length;
    
    // pick a random message
    let msgIndex = randomIndex(haystack);
    let msg = haystack[msgIndex].text;
    updatedMessages.add(msgIndex);
    // yes I know I am mutating an arugment. this is just a POC, relax ;) 
    haystack[msgIndex].text = swapWordForNeedle(msg, needle);
    index -= 1; 
  }
  console.log('Updated messages:', updatedMessages.size);
  return haystack;
}

function swapWordForNeedle(sentence, needle){
  let words = sentence.split(' ');
  let index = randomIndex(words);
  // if(words[index] === needle) console.warn('overwriting needle with a needle. Your needlecount will now be off');
  while(words[index] === needle) {
    index = randomIndex(words);
  }
  words[index] = needle;
  // yes I know I am mutating an arugment. this is just a POC, relax ;) 
  return words.join(' ');
}

function randomIndex(arr) {
  const min = 0;
  const max = arr.length;
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = buildCorpus;