// import until from '../../utils/async/until';

class PartialMatcher {
  constructor() {
    /*
    allheWords is a big string that contains a unique word per line
    it's used in conjunction with regex to detect partial match suffixs
    Ideally I;d like to use something like a suffix tree for this job
    but the regex performance seems good enough and this implementation is
    much simpler. So I'm going with this for a first draft.
    Also, this makes editing, and removing docs easier to implement and
    building the list in runtime is also cheaper
    */
    this._allTheWords = '';
    this._wordDelim = '\n';
  }

  /**
   * @description Adds a word to the word corpus
   * @param {string} word - Word to be added
   */
  add(word) {
    this._allTheWords = `${this._allTheWords}${word}${this._wordDelim}`;
  }

  /**
   * @description Removes a word from the list of words.
   * @param {string} word - Word to be removed
   */
  remove(word) {
    const pattern = new RegExp(`^${word}$`, 'igm');
    this._allTheWords = this._allTheWords.replace(pattern, '');
  }

  /**
   * @description Searches for words that contain a substring pattern
   * @param {string} pattern - Substring to find
   */
  // find(pattern) {
  //   let matches = [];
  //   const p = new RegExp(`^.*${pattern}.*$`, 'igm');
  //   let result;

  //   const getNextResult = () => {
  //     result = p.exec(this._allTheWords);
  //     if (result) matches.push(result[0]);
  //   };

  //   const noMoreResults = () => {
  //     if (typeof result === 'undefined') return false;
  //     return result === null;
  //   };

  //   return until(noMoreResults, getNextResult, () => matches);
  // }

  /**
   * @description Searches for words that contain a substring pattern
   * @param {string} pattern - Substring to find
   */
  findSync(pattern) {
    const p = new RegExp(`^.*${pattern}.*$`, 'igm');
    return this._allTheWords.match(p);
  }
}

module.exports = PartialMatcher;