/* global describe, it, expect */
/* eslint no-underscore-dangle: "off" */
const PartialMatcher = require('../partial-match');

describe('new PartialMatcher()', () => {
  let pm = new PartialMatcher();
  it('returns an object', () => {
    expect(typeof pm).toEqual('object');
  });

  it('has an _allTheWords property', () => {
    expect(pm).toHaveProperty('_allTheWords');
  });

  it('word delimeter is a new line', () => {
    expect(pm._wordDelim).toEqual('\n');
  });
});


describe('PartialMatcher.add', () => {
  let pm = new PartialMatcher();

  it('adds a word followed by the word delimiter', () => {
    pm.add('foo');
    pm.add('bar');
    expect(pm._allTheWords).toEqual('foo\nbar\n');
  });
});


describe('PartialMatcher.remove', () => {
  let pm = new PartialMatcher();

  it('removes a word from the list', () => {
    pm.add('foobar');
    pm.add('sbar');
    pm.add('bar');
    pm.add('barbar');
    pm.remove('bar');
    expect(pm._allTheWords).toEqual('foobar\nsbar\n\nbarbar\n');
  });
});

describe('PartialMatcher.find', () => {
  let pm = new PartialMatcher();

  it('finds all words that contain a pattern', () => {
    pm.add('abcNEEDLEdef');
    pm.add('ghi');
    pm.add('NEEDLEjkl');
    pm.add('mnopNEEDLE');
    pm.add('bar');
    return pm.find('NEEDLE').then((matches) => {
      expect(matches.length).toEqual(3);
    });
  });
});

describe('PartialMatcher.findSync', () => {
  let pm = new PartialMatcher();

  it('finds all words that contain a pattern', () => {
    pm.add('abcNEEDLEdef');
    pm.add('ghi');
    pm.add('NEEDLEjkl');
    pm.add('mnopNEEDLE');
    pm.add('bar');
    let matches = pm.findSync('NEEDLE')
    expect(matches.length).toEqual(3);
  });
});

// describe('PartialMatcher.TEST', () => {
//   // let pm = new PartialMatcher();
//   it('a test', () => {
//     expect(true).toBe(true);
//   });
// });
