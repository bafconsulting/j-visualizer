module("Visualizer.Utils Unit Test", {

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
 * waitForRepeatingEvents test
 * A (performance enhancing) helper function for preventing code from being called many times unnecessarily
 */

asyncTest('waitForRepeatingEvents', 2, function() {
  var i = 0,
  y = 0,
      significantWaitTime = 100,
      waitForRepeatingEvents = Visualizer.Utils.waitForRepeatingEvents;
  while (i < 5) {
    waitForRepeatingEvents((function() {
      y++;
    }), significantWaitTime, "test2");
    i++;
  }
  setTimeout((function() {
    equal(y, 0, "No change until the wait-time is up");
    start();
  }), significantWaitTime / 2);
  stop();
  setTimeout((function() {
    equal(y, 1, "With a large enough wait-time, we prevent the code from executing many times.");
    start();
  }), significantWaitTime + 77);
});


/**
 * isArray test
 * Should return true for arrays, false otherwise
 */

test('isArray', 5, function() {
  var isArray = Visualizer.Utils.isArray;
  ok(isArray([]), "[] is an array");
  ok(!isArray({}), "JS Object is not an array");
  ok(!isArray(1), "1 is not an array");
  ok(!isArray("String"), "A String is not an array");
  ok(!isArray(null), "null is not an array");
});


/**
 * existsWithValue test
 * Should return true for input with a value, false otherwise
 */

test('existsWithValue', 7, function() {
  var existsWithValue = Visualizer.Utils.existsWithValue;
  var anyObj = {
    defined_property: true,
    null_property: null
  };
  ok(existsWithValue(1), "Integers exists with a value");
  ok(existsWithValue("String"), "Strings exists with a value");
  ok(existsWithValue([]), "Empty arrays exists with a value");
  ok(existsWithValue(anyObj.defined_property), "defined property of obj exists with a value");
  ok(!existsWithValue(null), "null does not exist with a value");
  ok(!existsWithValue(anyObj.null_property), "null property of obj does not exist with a value");
  ok(!existsWithValue(anyObj.undefined_property), "undefined property of obj does not exist with a value");
});


/**
 * minVal test
 * Given two inputs, return the smaller
 */

test('minVal', 5, function() {
  var minVal = Visualizer.Utils.minVal;
  equal(minVal(1, 3), 1, "1 is less than 3 (before)");
  equal(minVal(3, 1), 1, "1 is less than 3 (after)");
  equal(minVal(1, 1), 1, "For same values, return either of them");
  equal(minVal(null, 1), null, "null is less than a number");
  equal(minVal("abcdefg", "z"), "abcdefg", "String mins are determined by first-different-character");
});


/**
 * maxVal test
 * Given two inputs, return the larger
 */

test('maxVal', 5, function() {
  var maxVal = Visualizer.Utils.maxVal;
  equal(maxVal(1, 3), 3, "3 is more than 1 (before)");
  equal(maxVal(3, 1), 3, "3 is more than 1 (after)");
  equal(maxVal(1, 1), 1, "For same values, return either of them");
  equal(maxVal(null, 1), 1, "A number is more than null value");
  equal(maxVal("abcdefg", "z"), "z", "String max are determined by first-different-character");
});

/**
 * boundedVal test
 * Given an input value, an input minimum, and an input maximum,
 * return the value if it falls between min and max, otherwise return the bound.
 */

test('boundedVal', 3, function() {
  var boundedVal = Visualizer.Utils.boundedVal;
  equal(boundedVal(0, 1, 3), 1, "Given a lower value, return the lower bound");
  equal(boundedVal(2, 1, 3), 2, "Given a value between the bounds, return that value");
  equal(boundedVal(4, 1, 3), 3, "Given a larger value, return the upper bound");
});


/**
 * Testing Random generators
 * TODO: consider better way to do this, and what a large-enoguh sample size is.
 * TODO: consider adding a histogram-like test to test distribution
 *       -> (would have to increase sample size, as it's very possible to have a couple hotspots in 100 tests...)
 */

var randomIterationsCount = 100;


/**
 * Visualizer.Utils.randBetween test
 * Returns a number between input min (default: ), and input max (default)
 */

test('Visualizer.Utils.randBetween', randomIterationsCount * 2, function() {
  var i, max, min, val, _results;
  i = 0;
  _results = [];
  while (i < randomIterationsCount) {
    i++;
    min = i % 17;
    max = min + 1 + (i % 7);
    val = Visualizer.Utils.randBetween(min, max);
    ok(val >= min, "Random value retrieved is in range (above the minimum value)");
    _results.push(ok(val <= max, "Random value retrieved is in range (below the maximum value)"));
  }
  _results;
});


/**
 * Visualizer.Utils.randIntBetween test
 * Returns a number between input min (default: ), and input max (default)
 */

test('Visualizer.Utils.randIntBetween', randomIterationsCount * 3, function() {
  var i, max, min, val, _results;
  i = 0;
  _results = [];
  while (i < randomIterationsCount) {
    i++;
    min = i % 17;
    max = min + 1 + (i % 7);
    val = Visualizer.Utils.randIntBetween(min, max);
    ok(val >= min, "Random value retrieved is in range (above the minimum value)");
    ok(val <= max, "Random value retrieved is in range (below the maximum value)");
    _results.push(equal(val, Math.floor(val), "The result in an integer"));
  }
  _results;
});


/**
 * relativeSizeString test
 * Parse a string for size
 */

test('relativeSizeString', 4, function() {
  var relativeSizeString = Visualizer.Utils.relativeSizeString;
  equal(relativeSizeString(50), 50, "Given an integer, return that integer");
  equal(relativeSizeString(50.5), 50, "Given an float, round down");
  equal(relativeSizeString("50.5"), 50, "Non-relative Strings are parsed as numbers");
  equal(relativeSizeString("50%", 300), 150, "Given a relative value, calculate percentage (50% of 300 is 150)");
});

