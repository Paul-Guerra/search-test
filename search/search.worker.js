// import forEach from '../../utils/async/foreach';
// import Index from './index';
// import PartialMatcher from './partial-match';
const Index = require('./index');
const PartialMatcher = require('./partial-match');

function getWords(doc) {
  if (typeof doc !== 'string') return [];
  // todo: revisit this because the mark up logic in view may be space sensitive
  //    or we make make it not space sensitive
  return doc.toLowerCase().split(/\s+/);
}


class Search {
  constructor() {
    this._partial = new PartialMatcher();
    this._index = new Index();
    this.testIndex = {};
  }

  onWord (word, i, words, id) {
    let nextWord;
    if (i + 1 < words.length) nextWord = words[i + 1];
    if (!this._index.has(word)) {
      this._partial.add(word);
      this._index.add(word, id, i, nextWord);
    } else {
      this._index.update(word, id, i, nextWord);
    }
  }

  add(doc, id) {
    const words = getWords(doc);
    // words.forEach((word, i, words) => this.onWord(word, i, words));
    for(let i = 0; i < words.length; i++) {
      this.onWord(words[i], i, words, id);
    }
  }

  remove(doc, id) {
    const words = getWords(doc);
    const removeWord = (word) => {
      if (this._index.has(word)) {
        if (this._index.removeDocument(word, id) === 0) {
          this._partial.remove(word);
        }
      }
    };
    words.forEach(removeWord);
  }


  /**
   * @description Searches for a case insentivie match for a string in a set of documents
   * @param {string} query A string to find an exact match in the documents
   * @returns An set of documents that contain an exact match for the query string
   */
  search(query) {
    const words = getWords(query);
    let results;
    if (words.length === 0) return [];
    let allTheWords = Object.keys(this._index._index).join('\n')
    for (let i = 0; i < words.length; i += 1) {
      const wordPerLinePattern = new RegExp(`^${words[i]}$`, 'igm');
      const wordsWithMatch = this._partial.find(words[i], wordPerLinePattern, allTheWords) || [];
      let documentIds = [];
      wordsWithMatch.forEach(word => 
        documentIds = documentIds.concat(
          Array.from(this._index.get(word))
        )
      );
      const documents = new Set(documentIds);
      if (i === 0) {
        results = documents;
      } else {
        results = getIntersection(results, documents)
      }
      if (results.size === 0) break; // all intersections after this would return empty so bail
    }
    return results;
  }
}

/**
 * @description Returns the intersection of two Sets
 * @param {Set} A 
 * @param {Set} B 
 */
function getIntersection(A, B) {
  let smaller;
  let larger;
  // always loop through the smaller set
  if (A.size <= B.size) {
    smaller = A;
    larger = B;
  } else {
    smaller = B;
    larger = A;
  }

  return new Set(
    Array.from(smaller.values()).filter(x => larger.has(x))
  );

}

module.exports = { Search, getWords, getIntersection };