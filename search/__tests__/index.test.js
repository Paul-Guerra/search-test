/* global describe, it, expect */
/* eslint no-underscore-dangle: "off" */

import Index, { newNextWordData, newWordDocData } from '../index';

describe('new Index()', () => {
  let messages = new Index();
  it('returns an object', () => {
    expect(typeof messages).toEqual('object');
  });

  it('has an _index property', () => {
    expect(messages).toHaveProperty('_index');
    expect(typeof messages._index).toEqual('object');
  });
});


describe('Index.add()', () => {
  let index = new Index();
  let item = index.add('foo', 'abc', 5, 'bar');
  it('returns an object', () => {
    expect(typeof item).toEqual('object');
  });

  it('word association with doc id is indexed', () => {
    expect(typeof item.abc).toEqual('object');
  });

  it('word position in document is indexed', () => {
    expect(typeof item.abc[5]).toEqual('object');
  });

  it('next word in doc is indexed if provided', () => {
    expect(item.abc[5].next).toEqual('bar');
  });

  it('next word in doc is false if not provided', () => {
    let newItem = index.add('bar', 'abc', 6);
    expect(newItem.abc[6].next).toEqual(false);
  });
});

describe('Index.update()', () => {
  let index = new Index();
  let item = index.add('foo', 'abc', 5, 'bar');

  it('returns an object', () => {
    expect(typeof item).toEqual('object');
  });

  it('updates the existing document for the word', () => {
    let itemWithUpdatedDoc = index.update('foo', 'abc', 9, 'zzz');
    expect(itemWithUpdatedDoc).toEqual(item);
    expect(itemWithUpdatedDoc.abc).toEqual(item.abc);
    expect(itemWithUpdatedDoc).toHaveProperty(['abc', 9, 'next']);
    expect(itemWithUpdatedDoc.abc[9].next).toEqual('zzz');
  });

  it('document updates do not remove previously entered data', () => {
    let itemWithUpdatedDoc = index.update('foo', 'abc', 9, 'zzz');
    expect(itemWithUpdatedDoc).toHaveProperty(['abc', 5, 'next']);
  });

  it('creates a new document for the word if one does not exist', () => {
    let itemWithNewDoc = index.update('foo', 'def', 1, 'xxx');
    expect(typeof itemWithNewDoc.def).toEqual('object');
    expect(itemWithNewDoc).toHaveProperty(['def', 1, 'next']);
    expect(itemWithNewDoc.def[1].next).toEqual('xxx');
  });

  it('new documents do not remove previous documents', () => {
    let itemWithNewDoc = index.update('foo', 'def', 1, 'xxx');
    expect(itemWithNewDoc).toHaveProperty('abc');
  });
});


describe('Index.has()', () => {
  let index = new Index();
  index.add('foo', 'abc', 5, 'bar');

  it('returns true for indexed words', () => {
    expect(index.has('foo')).toEqual(true);
  });

  it('returns false for non-indexed words', () => {
    expect(index.has('baz')).toEqual(false);
  });
});

describe('Index.get()', () => {
  let index = new Index();
  index.add('foo', 'abc', 5, 'bar');

  it('returns data for indexed words', () => {
    let result = index.get('foo');
    expect(result).toHaveProperty(['abc', 5, 'next']);
  });

  it('returns false for non-indexed words', () => {
    let result = index.get('baz');
    expect(result).toEqual(false);
  });
});

describe('Index.removeDocument()', () => {
  it('removes the document association with the provided word', () => {
    let words = new Index();
    words.add('foo', 'abc', 5, 'bar');
    words.update('foo', 'abc', 6, 'baz');
    words.update('foo', 'def', 7, 'zzz');
    words.removeDocument('foo', 'abc');
    expect(words._index.foo.abc).toBeUndefined();
    expect(words._index.foo.def).not.toBeUndefined();
  });

  it('returns count of remaining documents', () => {
    let words = new Index();
    words.add('foo', 'abc', 5, 'bar');
    words.update('foo', 'def', 7, 'zzz');
    let count = words.removeDocument('foo', 'abc');
    expect(count).toBe(1);
  });

  it('does nothing if document is not associated with word', () => {
    let words = new Index();
    words.add('foo', 'abc', 5, 'bar');
    words.update('foo', 'def', 7, 'zzz');
    let count = words.removeDocument('foo', 'xyz');
    expect(count).toBe(2);
    expect(typeof words._index.foo.abc).toBe('object');
    expect(typeof words._index.foo.def).toBe('object');
  });

  it('removes the word if no other documents are associated with it', () => {
    let words = new Index();
    words.add('foo', 'abc', 5, 'bar');
    words.update('foo', 'abc', 6, 'baz');
    words.removeDocument('foo', 'abc');
    expect(words._index.foo).toBeUndefined();
  });
});

describe('Index.remove()', () => {
  it('removes the entire words from the index', () => {
    let words = new Index();
    words.add('foo', 'abc', 5, 'bar');
    words.update('foo', 'abc', 6, 'baz');
    words.update('foo', 'def', 7, 'zzz');
    words.remove('foo');
    expect(words._index.foo).toBeUndefined();
  });
});


describe('newNextWordData', () => {
  it('returns an object', () => {
    let result = newNextWordData('hi');
    expect(typeof result.next).toBe('string');
  });

  it('uses provided value for next', () => {
    let result = newNextWordData('hi');
    expect(result.next).toBe('hi');
  });

  it('next value is false if not provided', () => {
    let result = newNextWordData();
    expect(result.next).toBe(false);
  });
});

describe('newWordDocData', () => {
  it('returns an object', () => {
    let result = newWordDocData(1, 'hi');
    expect(typeof result[1]).toBe('object');
  });

  it('has order and next properties', () => {
    let result = newWordDocData(1, 'hi');
    expect(result).toHaveProperty([1, 'next']);
  });

  it('next value is false if not provided', () => {
    let result = newWordDocData(1);
    expect(result[1].next).toBe(false);
  });
});
