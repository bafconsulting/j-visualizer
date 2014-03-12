var _vis,
    _visColor,
    colorScheme = ["red", "green", "blue"],
    defaultAssignedColor = "pink",
    defaultUnassignedColor = "white",
    fixedColors = {ruby: "red"};

module("Visualizer.Colorer Unit Test", {
  /**
   * Setup is run before every test.
   */
  setup: function() {
    _vis = getSpecVisualizer();
    _visColor = _vis.get('color');

    // Use some special colors for testing:
    _visColor.setProperties({
      _colorScheme: colorScheme,
      _defaultAssigned: defaultAssignedColor,
      _defaultUnassigned: defaultUnassignedColor,
      _fixedVals: fixedColors
    });
  },

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});

test('Color spec setup', function() {
  equal(_visColor.get('_colorScheme'), colorScheme, "Color scheme is set");
  equal(_visColor.get('_defaultAssigned'), defaultAssignedColor, "default assigned color is set");
  equal(_visColor.get('_defaultUnassigned'), defaultUnassignedColor, "default unassigned color is set");
  equal(_visColor.get('_fixedVals'), fixedColors, "Fixed colors are set");
  equal(_visColor.get('visualizer'), _vis, "Colorer's visualizer is set");
});

// freshColorPalette
test('freshColorPalette', function() {
  _freshPalette = _visColor.freshColorPalette();
  notEqual(_freshPalette, _visColor.get('_colorScheme'), "The new palette does not reference same \
                                                          Array Object as the colorScheme");

  // To test that the contents are exactly equal, we'll create two ordered Strings to compare:
  var squishedColors = function(colorScheme){
    return colorScheme.copy().sort().join('');
  };
  equal(squishedColors(_freshPalette), squishedColors(_visColor.get('_colorScheme')), "The new palette contains exactly the same colors (no duplicates, none missing) as the color scheme");
});


// fixed colors
test('fixed', 4, function() {
  equal(_visColor.fixed('ruby'), fixedColors['ruby'], "If a color is predefined, its value is used");
  equal(_visColor.fixed('Ruby'), fixedColors['ruby'], "Case-insensitive for predefined values as well.");

  var _testKey = "SPEC";
  _visColor._rotating_color = function(key){
    ok(true, "_rotating_color is used to determine the color if it isn't predefined");
    equal(key, _testKey.toLowerCase(), "Use the lowercase form of the first parameter to determine the color");
  }
  _visColor.fixed(_testKey);
});

// Required for 'fixed'
test('_rotating_color', function() {
  // Test 'rotating' assignment
  var rotating_a = _visColor._rotating_color('a');
  ok(colorScheme.indexOf(rotating_a) !== -1, "A color from the scheme is assigned if the rotating Value isn't already set");
  var rotatingA = _visColor._rotating_color('A');
  notEqual(rotatingA, rotating_a, "_rotating_color is not naturally case-insensitive (if color for \
                                'a' should be same as for 'A', use toLowerCase when retrieving...)");

  var rotatingB = _visColor._rotating_color('B');
  notEqual(rotatingA, rotatingB, "Fixed uses a rotating scheme (won't reuse the same color until the others have been used)");

  // At this poitn we've assigned all three of our scheme colors! What happens next?
  // Test that it rotates:
  var rotatingR = _visColor._rotating_color('R');
  ok(colorScheme.indexOf(rotatingR) !== -1, "After using the whole scheme, we reuse the same scheme colors from a new palette");
  equal(_visColor._rotating_color('a'), rotating_a, "The old values are still (correctly) unchanged.");
});

/*
  .unique
*/
test('unique', function() {
  // next()
  var firstColor = _visColor.unique.next();
  ok(colorScheme.indexOf(firstColor) !== -1, "Colorer's unique.next is a color from the scheme");

  // Assignment (and how it should use same value as next())
  equal(_visColor.unique("A"), undefined, "Initially String 'A' does not have a unique color");
  _visColor.unique.assign("A");
  equal(_visColor.unique("A"), firstColor, "The previous 'next' value is assigned to 'A'");
  notEqual(_visColor.unique.next(), firstColor, "The new value of next() is different from the old value");

  // Different keys get their own colors
  _visColor.unique.assign("B");
  var secondColor = _visColor.unique("B");
  _visColor.unique.assign("C");
  notEqual(secondColor, firstColor, "'B' gets a different color from 'A'");
  notEqual(_visColor.unique("C"), firstColor, "'C' gets a different color from 'A'");

  // default Assigned value
  equal(_visColor.get('uniquePalette.main.length'), 0, "There are no colors left in the set's palette!");
  equal(_visColor.unique.next(), undefined, "There are no colors left that match the scheme!");
  _visColor.unique.assign("D");
  equal(_visColor.unique("D"), defaultAssignedColor, "Since there are no more remaining unique \
                                                      colors, the next will be the default value");
  _visColor.unique.assign("E");
  equal(_visColor.unique("E"), defaultAssignedColor, "In fact, all subsequent assignments will \
                                                      be default (until a color is freed)");

  // Let's get that color back:
  _visColor.unique.unassign("A");
  equal(_visColor.unique.next(), firstColor, "After unassigning 'A', the first color is freed! It will be used next.");

  // But did it affect other keys?
  equal(secondColor, _visColor.unique("B"), "'B' still has its assigned color (correctly)");

  // Full reset:
  _visColor.unique.resetSet('main');
  equal(_visColor.unique("B"), undefined, "'B' is no longer assigned");
  equal(_visColor.get('uniquePalette.main.length'), 3, "All 3 colors are restored");
});
