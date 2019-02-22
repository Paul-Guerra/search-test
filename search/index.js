export function newNextWordData(next) {
  return { next: next || false };
}

export function newWordDocData(order, next) {
  return {
    [order]: newNextWordData(next)
  };
}

export default class Index {
  constructor() {
    this._index = {}; // The inverted index of doc content
  }

  /**
   * @description Returns true if word is indexed, false if it is absent
   * @param {string} word - Word to test
   */
  has(word) {
    return !!this._index[word];
  }

  /**
   * @description Returns index data for a word. If word is not indexed it returns false
   * @param {string} word - Word to query
   */
  get(word) {
    return this.has(word) ? this._index[word] : false;
  }

  /**
   * @description Creates an index for a word with associated data
   * @param {string} word - Word to be indexed
   * @param {string} docId - Id of the document
   * @param {number} order - The words relative order in the document
   * @param {string} next - The next word in the document
   * @returns {object} The indexed data for the word
   */
  add(word, docId, order, next) {
    this._index[word] = {};
    this.update(word, docId, order, next);
    return this._index[word];
  }

  /**
   * @description For an existing word in the index, inserts new postion data and adds document if needed
   * @param {string} word  - Word to be updated in the index
   * @param {string} docId -  Id of the document
   * @param {number} order The words relative order in the document
   * @param {string} next - The next word in the document
   * @returns {object} The indexed data for the word
   */
  update(word, docId, order, next) {
    let docData;
    if (this._index[word][docId]) {
      docData = this._index[word][docId];
      if (typeof docData[order] === 'object') {
        console.warn('[Index.update] updating a word position in a document when position alreadey exists. Returning existing data');
        return this._index[word];
      }
      docData[order] = newNextWordData(next);
    } else {
      this._index[word][docId] = newWordDocData(order, next);
    }

    return this._index[word];
  }

  /**
   * @description Removes the document data assciated with a word
   * @param {string} word - Word that is associated with the document
   * @param {string} docId - Document to be removed
   * @returns {number} The updated document count for the word
   */
  removeDocument(word, docId) {
    let docCount;
    if (!this._index[word][docId]) {
      return Object.keys(this._index[word]).length;
    }
    delete this._index[word][docId];
    docCount = Object.keys(this._index[word]).length;
    if (docCount === 0) this.remove(word);
    return docCount;
  }

  /**
   * @description Removes a word from the index
   * @param {string} word - Word to be removed
   */
  remove(word) {
    delete this._index[word];
  }
}
