/* global jest */

export default jest.fn(() => {
  return {
    has: jest.fn(() => true),
    add: jest.fn(),
    update: jest.fn(),
    removeDocument: jest.fn(() => 0)
  };
});
