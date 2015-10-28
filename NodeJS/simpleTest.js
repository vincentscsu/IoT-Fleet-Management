var array = require('./simple.js');

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, array.indexOf(5));
      assert.equal(-1, array.indexOf(0));
    });
  });
});
