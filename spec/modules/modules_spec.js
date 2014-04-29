var _vis,
    _testModule,
    reduceFunc = function(prev, cur){return prev+cur.val;},
    testContent = [{val: 1, type: 'A'}, {val: 3, type: 'A'}, {val: 2, type: 'B'}];
module("Visualizer.Modules Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {
    _vis = getSpecVisualizer();
    _testModule = _vis.get('modules.1');
  },

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});

test('Module spec setup', function() {
  ok(_testModule, "The test module exists");
  equal(_testModule.get('visualizer'), _vis, "The test module has a reference to its parent Visualizer");
});

// content and (sorted) arrangedContent
test('content, arrangedContent', function() {
  // Default value:
  ok(Visualizer.Utils.isArray(_testModule.get('content')), "Property 'content' is an Array by default");
  equal(_testModule.get('content.length'), 0, "Property 'content' is empty by default");

  // Setting value (via Ember):
  _testModule.set('content', testContent);
  equal(_testModule.get('content'), testContent, "Property 'content' is correctly set");

  // Sorting:
  equal(_testModule.get('arrangedContent'), _testModule.get('content'), "No sorting property is set, so the \
                                                                         content is equal to arrangedContent.");

  // Sorting, for real:
  _testModule.set('sortProperties', ["val"]);
  _testModule.set('sortAscending', true);
  notEqual(_testModule.get('arrangedContent'), _testModule.get('content'), "After setting sortProperties, \
                                                                            the arrangedContent changes.");

  var sortedReducedTestContent = testContent.sort(function(a,b){ return a.val - b.val }).reduce(reduceFunc, '');
  var reducedArrangedContent = _testModule.get('arrangedContent').reduce(reduceFunc, '');
  equal(reducedArrangedContent, sortedReducedTestContent, "The arrangedContent is the same \
                                                           as testContent sorted by val");
  equal(reducedArrangedContent, "123", "The arrangedContent's values are in order: 1,2,3");
});

// dataset and limits
test('dataset, limits', function() {
  // Dataset default
  _testModule.set('content', testContent);
  equal(_testModule.get('content'), _testModule.get('dataset'), "By default, dataset is equal to content");

  // Limit default, and setting its value:
  equal(_testModule.get('maxLength'), 100, "By default, max length of a dataset is 100 elements.");
  _testModule.set('maxLength', 2);
  equal(_testModule.get('maxLength'), 2, "Max length has been set to 2 using .set ");

  // (En)Forcing the Limit:
  _testModule.forceLimit('val');
  notEqual(_testModule.get('content'), _testModule.get('dataset'), "Forcing the limit causes the dataset to \
                                                                    no longer be the same as the content");

  equal(_testModule.get('content.length'), 3, "Content still has 3 elements");
  equal(_testModule.get('dataset.length'), 2, "Dataset now has 2 elements");

  // Validating the Limit results:
  var reducedDataset = _testModule.get('dataset').reduce(reduceFunc, '');
  equal(reducedDataset, '32', "Dataset lost the smallest value (1), kept the 3 and the 2");
});


// groupedBy:
test('groupedBy', function() {
  _testModule.set('content', testContent);
  var firstGroupedFetch = _testModule.groupedBy('type');
  equal(firstGroupedFetch.length, 2, "There are two groups (type 'A' and type 'B')");
  ok(firstGroupedFetch[0].length > firstGroupedFetch[1].length, "The groups are ordered (largest to smallest)");

  var firstGroupReduced = firstGroupedFetch[0].reduce(reduceFunc, '');
  ok(['13', '31'].indexOf(firstGroupReduced) > -1, "The first group contains the Type A elements");

  // As a property, the next fetch will just grab the property reference! O(1) , nice and fast.
  var secondGroupedFetch = _testModule.groupedBy('type');
  equal(firstGroupedFetch, secondGroupedFetch, "Fetching the group again returns \
                                                reference to same group Array Object.");

  // Changing a dependency property causes recalculation (as a proper Ember property):
  _testModule.notifyPropertyChange('dataset');
  var thirdGroupedFetch = _testModule.groupedBy('type');
  notEqual(firstGroupedFetch, thirdGroupedFetch, "After changing a dependency property, the group \
                                                  will be recomputed (new Array Object created).");

  var thirdGroupedReduced = thirdGroupedFetch[0].reduce(reduceFunc, '');
  ok(['13', '31'].indexOf(thirdGroupedReduced) > -1, "Since none of the first group's types \
                                                      really changed, the groups are the same.");
});

// requestRedraw
asyncTest('requestRedraw', 2, function() {
  var _specWait = (_vis.get('currentScene.drawWait') + _vis.get('currentScene.fullRefreshWait')) + 50;
  var redrawModule = _vis.get('modules.0');
  var ignoredModule = _vis.get('modules.2');
  var _viewVal = 'moduleViews.specView.val';

  Ember.run.later(this, function () {
    var prevRedrawModuleVal = redrawModule.get(_viewVal);
    var prevIgnoredModuleVal = ignoredModule.get(_viewVal);

    redrawModule.requestRedraw();
    Ember.run.later(this, function () {
      equal(redrawModule.get(_viewVal), prevRedrawModuleVal+1, "The test module view value has been incremented");
      equal(ignoredModule.get(_viewVal), prevIgnoredModuleVal, "The unrelated module's view value is unchanged.");
      start();
    }, _specWait);
  }, _specWait);
});
