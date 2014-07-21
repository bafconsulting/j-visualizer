var _vis,
    _testModule,
    _specWait,
    _specDrawWait = 10,
    reduceFunc = function(prev, cur){return prev+cur.val;},
    testContent = [{val: 1, type: 'A'}, {val: 3, type: 'A'}, {val: 2, type: 'B'}];
module("Visualizer.Modules Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {
    _vis = getSpecVisualizer();
    _testModule = _vis.get('modules.1');

    // Let's tone down the drawWait value to make the tests run more quickly...
    _vis.set('currentScene.drawWait', _specDrawWait);
    _vis.set('currentScene.fullRefreshWait', _specDrawWait);
    _specWait = (_vis.get('currentScene.drawWait') + _vis.get('currentScene.fullRefreshWait')) + 10;
  },

  /**
   * Teardown is run after every test.
   */
  teardown: function() {
    _vis.get('currentScene.widgets').clear();
    _vis = null;
  }
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


// requestedViews:
test('requestedViews', function() {
  var requestedViews = _testModule.get('requestedViews');
  equal(requestedViews.length, 0, "There are no requestedViews for the test module");

  // Okay, try with a module that's actually requested (Module "0" will do):
  var requestedViewsFor0 = _vis.get('modules.0.requestedViews');
  equal(requestedViewsFor0.length, 1, "There is one requested view for the test module");
  equal(requestedViewsFor0[0], 'specView', "The contents of the requestedView element is the view's key");
});

// addView
asyncTest('addView', 9, function() {
  var _viewVal = 'moduleViews.specView.val';

  Ember.run.later(this, function () {
    var module0 = _vis.get('modules.0');
    module0.set('redrawWasRequested', false);
    _testModule.set('redrawWasRequested', false);

    equal(Object.keys(_testModule.get('moduleViews')).length, 0, 'Test module has no ModuleViews');
    equal(Object.keys(module0.get('moduleViews')).length, 1, 'requestedModule has the requested view');
    var prevViewForModule0 = module0.get('moduleViews.specView');

    var testModuleView = _testModule.addView('specView');
    ok(testModuleView, 'A ModuleView was returned for testModuleView');
    equal(Object.keys(_testModule.get('moduleViews')).length, 1, '_testModule has stored the new view');
    equal(_testModule.get('moduleViews.specView'), testModuleView, 'The view returned is the \
                                                                    view stored (_testModule');

    var newViewFor0 = module0.addView('specView');
    equal(newViewFor0, prevViewForModule0, 'The previously existing view is returned for Module 0');
    equal(Object.keys(module0.get('moduleViews')).length, 1, 'There is still only one view');

    // Test that test module requested a redraw to celebrate the new ModuleView
    Ember.run.later(this, function () {
      equal(module0.get('redrawWasRequested'), false, 'Module 0 did not redraw (no new view, no need)');
      equal(_testModule.get('redrawWasRequested'), true, '_testModule is redrawn to reflect new views');
      start();
    }, _specWait);
  }, _specWait);
});

// setDefaultViews
asyncTest('setDefaultViews', 11, function() {
  var module0 = _vis.get('modules.0');
  module0.reopen({
    addViewCalled: 0,
    addView: function(){
      this.incrementProperty('addViewCalled')
      this._super.apply(this, arguments);
    }
  });
  Ember.run.later(this, function () {
    ok(module0.get('moduleViews.specView'), 'On initialization, specView exists.');
    ok(!module0.get('moduleViews.hiddenSpecView'), 'On initialization, hiddenSpecView does NOT exist.');
    equal(module0.get('addViewCalled'), 1, 'setDefaultViews called addView once on initialization.')

    module0.setDefaultViews();
    module0.setDefaultViews();
    module0.setDefaultViews();
    module0.setDefaultViews();
    module0.setDefaultViews();
    Ember.run.later(this, function () {
      equal(module0.get('addViewCalled'), 2, 'Though setDefaultViews was spammed, \
                                              addView was only called one more time.')
      ok(module0.get('moduleViews.specView'), 'On initialization, specView exists.');
      ok(!module0.get('moduleViews.hiddenSpecView'), 'On initialization, hiddenSpecView does NOT exist.');

      // Redraw tests:
      ok(module0.get('redrawWasRequested'), 'Module requested a redraw with new View');
      module0.set('redrawWasRequested', false);

      // Request a new view, see that it gets added!
      _vis.get('currentScene.widgets').addObject({
        module: '0',
        view: 'hiddenSpecView',
        operation: 'who cares'
      });
      Ember.run.later(this, function () {
        equal(module0.get('addViewCalled'), 4, 'addView was called twice more (two requested views).')
        ok(module0.get('moduleViews.specView'), 'specView still exists.');
        ok(module0.get('moduleViews.hiddenSpecView'), 'hiddenSpecView now exists!');

        ok(module0.get('redrawWasRequested'), 'Module requested a redraw with new View');
        start();
      }, _specWait);
    }, _specWait);
  }, _specWait);
});

// requestRedraw
asyncTest('requestRedraw', 2, function() {
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
