module("JQuery Extensions Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {},

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});

/**
 * Array prototype tests:
 */


/**
 * addExpiringClass test
 * Adds an input class_name (default: 'disabled') to the target
 * object which expires in an input expiration (default: 1000ms)
 */

test('Array::removeInstancesOf', 3, function() {
  var testArray = [0,1,2,3,2,1,0];

  ok(testArray.indexOf(1) > -1, "The test Array includes 1");
  equal(testArray.removeInstancesOf(1) , testArray, "Calling removeInstancesOf on an Array returns a reference to that Array");
  equal(testArray.indexOf(1), -1, "The test Array no longer includes either instance of 1");
});
