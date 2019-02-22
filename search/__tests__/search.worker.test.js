/* global describe, it, expect, beforeEach, jest */
/* eslint no-underscore-dangle: "off" */

import PartialMatcher from '../partial-match';
import Index from '../index';
import Search, { getWords } from '../search.worker';

jest.mock('../partial-match');
jest.mock('../index');

describe('getWords', () => {
  it('normalizes all words to lowercase', () => {
    let words = getWords('AAA BBB');
    expect(words[0]).toEqual('aaa');
    expect(words[1]).toEqual('bbb');
  });

  it('splits on spaces', () => {
    let words = getWords('AAA BBB  CCC');
    expect(words[0]).toEqual('aaa');
    expect(words[1]).toEqual('bbb');
    expect(words[2]).toEqual('ccc');
  });

  it('ignores multiple consecutive white spaces', () => {
    let words = getWords('AAA\t\n\tBBB\n\t\n  CCC');
    expect(words[0]).toEqual('aaa');
    expect(words[1]).toEqual('bbb');
    expect(words[2]).toEqual('ccc');
  });

  it('returns an empty array for non-string inputs', () => {
    let words = getWords(3);
    expect(words.length).toEqual(0);
  });
});

describe('new Search()', () => {
  let search = new Search();
  it('returns an object', () => {
    expect(typeof search).toEqual('object');
  });
});

describe('Search.add', () => {

  beforeEach(() => {
    Index.mockClear();
    PartialMatcher.mockClear();
  });

  it('adds new words to the partial matcher and the index', () => {

    Index.mockImplementationOnce(() => {
      return {
        has: jest.fn(() => false),
        add: jest.fn(),
        update: jest.fn()
      };
    });

    let search = new Search();
    return search.add('foo bar baz', 'id').then(() => {
      expect(search._partial.add).toHaveBeenCalledTimes(3);
      expect(search._partial.add).toHaveBeenCalledWith('foo');
      expect(search._partial.add).toHaveBeenCalledWith('bar');
      expect(search._partial.add).toHaveBeenCalledWith('baz');

      expect(search._index.add).toHaveBeenCalledWith('foo', 'id', 0, 'bar');
      expect(search._index.add).toHaveBeenCalledWith('bar', 'id', 1, 'baz');
      expect(search._index.add).toHaveBeenCalledWith('baz', 'id', 2, undefined);
    });
  });

  it('updates the index with existing words', () => {
    let search = new Search();
    return search.add('foo bar baz', 'id').then(() => {
      expect(search._partial.add).toHaveBeenCalledTimes(0);
      expect(search._index.update).toHaveBeenCalledWith('foo', 'id', 0, 'bar');
      expect(search._index.update).toHaveBeenCalledWith('bar', 'id', 1, 'baz');
      expect(search._index.update).toHaveBeenCalledWith('baz', 'id', 2, undefined);
    });
  });

  it('handles errors', () => {
    Index.mockImplementationOnce(() => {
      return {
        has: jest.fn(() => { throw new Error('oops'); }),
        add: jest.fn(),
        update: jest.fn()
      };
    });

    let search = new Search();
    return search.add('foo bar baz', 'id').catch((err) => {
      expect(err instanceof Error).toEqual(true);
    });
  });
});


describe('Search.remove', () => {

  beforeEach(() => {
    Index.mockClear();
    PartialMatcher.mockClear();
  });

  it('removes the words from the index if present', () => {

    let search = new Search();
    return search.remove('foo bar baz', 'id').then(() => {
      expect(search._partial.remove).toHaveBeenCalledTimes(3);
      expect(search._index.removeDocument).toHaveBeenCalledTimes(3);
      expect(search._index.removeDocument).toHaveBeenCalledWith('foo', 'id');
      expect(search._index.removeDocument).toHaveBeenCalledWith('bar', 'id');
      expect(search._index.removeDocument).toHaveBeenCalledWith('baz', 'id');
    });
  });

  it('does not remove the word for partial matches if a document is associated with the word', () => {
    Index.mockImplementationOnce(() => {
      return {
        has: jest.fn(() => true),
        removeDocument: jest.fn(() => 1)
      };
    });

    let search = new Search();
    return search.remove('foo bar baz', 'id').then(() => {
      expect(search._partial.remove).toHaveBeenCalledTimes(0);
      expect(search._index.removeDocument).toHaveBeenCalledTimes(3);
      expect(search._index.removeDocument).toHaveBeenCalledWith('foo', 'id');
      expect(search._index.removeDocument).toHaveBeenCalledWith('bar', 'id');
      expect(search._index.removeDocument).toHaveBeenCalledWith('baz', 'id');
    });
  });

  it('does nothing if the word is not found', () => {
    Index.mockImplementationOnce(() => {
      return {
        has: jest.fn(() => false),
        removeDocument: jest.fn(() => 1)
      };
    });

    let search = new Search();
    return search.remove('foo bar baz', 'id').then(() => {
      expect(search._partial.remove).toHaveBeenCalledTimes(0);
      expect(search._index.removeDocument).toHaveBeenCalledTimes(0);
    });
  });

  it('handles errors', () => {
    Index.mockImplementationOnce(() => {
      return {
        has: jest.fn(() => { throw new Error('oops'); }),
        add: jest.fn(),
        update: jest.fn()
      };
    });

    let search = new Search();
    return search.remove('foo bar baz', 'id').catch((err) => {
      expect(err instanceof Error).toEqual(true);
    });
  });
});
