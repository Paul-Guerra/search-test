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
  }

  add(doc, id) {
    const words = getWords(doc);

    const onWord = (word, i) => {
      let nextWord;
      if (i + 1 < words.length) nextWord = words[i + 1];
      if (!this._index.has(word)) {
        this._partial.add(word);
        this._index.add(word, id, i, nextWord);
      } else {
        this._index.update(word, id, i, nextWord);
      }
    };

    words.forEach(onWord);
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
    for (let i = 0; i < words.length; i += 1) {
      const wordsWithMatch = this._partial.find(words[i]) || [];
      let documentIds = [];
      wordsWithMatch.forEach(word => 
        documentIds = documentIds.concat(
          Object.keys(this._index.get(word))
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

  /**
   * 
   * @param {string} query A string to find an exact match in the documents
   * @returns An array of documents that contain an exact match for the query string
   */
  _search(query) {
    const words = getWords(query);
    if (words.length === 0) return [];
    if (words.length === 1) {
      const wordsWithMatch = this._partial.find(query);
      const documents = wordsWithMatch.map(word => this._index.get(word));
      return documents;
    }
    return this.searchPhrase(words);

  }

  /**
   * @description Searches for docuement that contain an exact match for a phrase
   * @param {[]string} words - strings that make up the phrase we are searching for
   * @returns An array of documents
   */
  searchPhrase(words) {
    const results = [];
    let pattern;
    if (words.length === 0) return [];
    if (words.length === 1) return this.find(words[0]);
    let i = 0;
    while(i < words.length) {
      if (i === 0) {
        pattern = new RegExp(`^.*${words[i]}$`, 'igm');
        
      } else {
        pattern = new RegExp(`^${words[i]}.*$`, 'igm');
      }
      const wordsWithMatch = this._partial.find(words[i], pattern)
      const documents = wordsWithMatch.map(word => this._index.get(word));
      results.push({
        word: words[i],
        documents 
      });
      i++;
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