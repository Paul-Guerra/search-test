// import loremIpsum from 'lorem-ipsum';
const loremIpsum = require('lorem-ipsum');
const makeRandomName = require('./name-generator');

const DEFAULT_SIZE = 100000;

function buildCorpus(size = DEFAULT_SIZE) {
  let messages = [];
  let haystack = makeHaystack(size);
  messages = insertNeedles(haystack);
  console.log(messages);
}

function makeHaystack(size = DEFAULT_SIZE) {
  const haystack = [];
  for(let i = 0; i < size; i += 1) {
    

    let text = loremIpsum({
      count: 50,
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

function insertNeedles(haystack, needle = 'NEEDLE', count = 100) {
  let index = count;
  
  while(index) {
    const min = 0;
    const max = haystack.length;
    
    // pick a random message
    let msgIndex = Math.floor(Math.random() * (max - min)) + min;
    let msg = haystack[msgIndex].text;

    // replace random words with needle
    // let words = msg.split(' ');
    // const wordMax = words.length;
    // let wordIndex = Math.floor(Math.random() * (wordMax - min + 1) + min);
    // if(words[wordIndex] === needle) console.warn('overwriting needle with a needle. Your needlecount will now be off');
    // words[wordIndex] = needle;
    // yes I know I am mutating an arugment. this is just a POC, relax ;) 
    haystack[msgIndex].text = swapWordForNeedle(msg, needle)
    index -= 1; 
  }

  return haystack;
}

function swapWordForNeedle(sentence, needle){
  let words = sentence.split(' ');
  const min = 0;

  const max = words.length;
  let index = Math.floor(Math.random() * (max - min)) + min;
  // if(words[index] === needle) console.warn('overwriting needle with a needle. Your needlecount will now be off');
  while(words[index] === needle) {
    index = Math.floor(Math.random() * (max - min)) + min;
  }
  words[index] = needle;
  // yes I know I am mutating an arugment. this is just a POC, relax ;) 
  // haystack[msgIndex].text = words.join(' ');
  return words.join(' ');
}

buildCorpus(5);