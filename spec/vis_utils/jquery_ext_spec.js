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
 * JQuery prototype tests:
 */


/**
 * addExpiringClass test
 * Adds an input class_name (default: 'disabled') to the target
 * object which expires in an input expiration (default: 1000ms)
 */

asyncTest('JQuery.addExpiringClass', 3, function() {
  var testObj = $("<div/>");
  var testExpireyTime = 100;
  ok(!testObj.hasClass('test'), "Initially the object does not have the test class.");
  testObj.addExpiringClass('test', testExpireyTime);
  ok(testObj.hasClass('test'), "After adding the expiring class, it can be detected on the object.");
  setTimeout((function() {
    ok(!testObj.hasClass('test'), "After expiration is up, the class is removed.");
    start();
  }), testExpireyTime + 25);
});
