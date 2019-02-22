/* global describe, it, expect */
const elasticlunr = require('elasticlunr');


describe.skip('elasticlunr', () => {

  var idx = elasticlunr(function () {
    this.setRef('id');
    this.addField('text');
  });
  [
    { id: 0,
      text: 'sint enim culpa ex enim incididunt esse deserunt ad consequat'
    }
  
  ].forEach(doc => idx.addDoc(doc))

  // messages.forEach(doc => idx.addDoc(doc))

  it('finds phrases', () => {
    // let action = { id: 'foo', name: 'foo bar' };
    let results = idx.search("im inc");
    console.log(results);
    expect(results.length).toBe(1);
  });
});
