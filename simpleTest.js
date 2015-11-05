var array = require('./simpl.js');

var assert = require('assert');
describe('String', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the character is not present', function () {
      assert.equal(-1, array.indexOf(0));
    });
  });
});
