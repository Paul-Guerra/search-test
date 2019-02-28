// import until from '../../utils/async/until';

class PartialMatcher {
  constructor() {
    /*
    allheWords is a big string that contains a unique word per line
    it's used in conjunction with regex to detect partial match suffixs
    Ideally I'd like to use something like a suffix tree for this job
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
   * @param {string} query - Substring to find
   */
  find(query, pattern) {
    let p = pattern;
    if (!pattern) p = new RegExp(`^.*${query}.*$`, 'igm');
    return this._allTheWords.match(p);
  }
  
  // /**
  //  * @description Searches for words that match the words in a phrase
  //  * @param {[]string} words - strings that make up the phrase we are searching for
  //  */
  // findPhrase(words){
  //   const results = [];
  //   let pattern;
  //   if (words.length === 0) return [];
  //   if (words.length === 1) return this.find(words[0]);
  //   let i = 0;
  //   while(i < words.length) {
  //     if (i === 0) {
  //       pattern = new RegExp(`^.*${words[i]}$`, 'igm');
  //       results.push({
  //         word: words[i],
  //         results: this.find(words[i], pattern)
  //       });
  //     } else {
  //       pattern = new RegExp(`^${words[i]}.*$`, 'igm');
  //       results.push({
  //         word: words[i],
  //         results: this.find(words[i], pattern)
  //       });
  //     }
  //     i++;
  //   }
  //   return results;
  // }
}

module.exports = PartialMatcher;