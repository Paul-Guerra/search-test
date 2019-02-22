// import eachOf from 'async/eachOf';
import forEach from '../../utils/async/foreach';
import Index from './index';
import PartialMatcher from './partial-match';

export function getWords(doc) {
  if (typeof doc !== 'string') return [];
  // todo: revisit this because the mark up logic in view may be space sensitive
  //    or we make make it not space sensitive
  return doc.toLowerCase().split(/\s+/);
}

export default class Search {
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

    return forEach(words, onWord);
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

    return forEach(words, removeWord);
  }

  search(query) {

  }
}
