var _vis,
    _testModule,
    _testModuleView,
    testSel1 = "#qunit-testrunner-toolbar",
    testSel2 = "#qunit-header";

module("Visualizer.ModuleViews Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {
    _vis = getSpecVisualizer();
    _testModule = _vis.get('modules.1');
    _testModule.addView('specView');
    _testModuleView = _vis.get('modules.1.moduleViews.specView');

    _testModuleView.clear = function(){
      this.set('testCleared', true);
    };

    _testModuleView.testDimensions = function(){
      var actionType = this.get('dimensionsDidChange') ? "full" : "partial";
      this.set('previousActionType', actionType);
      this.set('dimensionsDidChange', false);
    };
  },

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});

test('ModuleView spec setup', function() {
  ok(_testModuleView, "The test ModuleView exists");
  equal(_testModuleView.get('module'), _testModule, "The test ModuleView has a reference to parent Module");
  equal(_testModuleView.get('visualizer'), _vis, "The test ModuleView has a reference to parent Visualizer");
});

// data
test('data', function() {
  equal(_testModuleView.get('data'), _testModule.get('dataset'), "Data property refers to parent Module's dataset");
  equal(_testModuleView.get('arrangedContent'), _testModule.get('arrangedContent'), "arrangedContent property refers \
                                                                                     to parent Module's arrangedContent");
});


//containerSelector and container history
test('containerSelector and history', function() {
  equal(_testModuleView.get('containerSelector'), null, "The default containerSelector is null");

  ok(!_testModuleView.get('testCleared'), "Clear function not yet triggered...");
  _testModuleView.updateSelector(testSel1);
  equal(_testModuleView.get('containerSelector'), testSel1, "A new container selector is set");
  ok(_testModuleView.get('testCleared'), "updateSelector triggered clear function");

  _testModuleView.updateSelector(testSel2);
  equal(_testModuleView.get('containerSelector'), testSel2, "Another new container selector is set");
  equal(_testModuleView.get('previousSelectors.lastObject'), testSel1, "Previous selector is pushed to back of history");
});

//$container
test('$container', function() {
  // Using the main "testSelector" to get a container
  _testModuleView.updateSelector(testSel1);

  var containerDOM = _testModuleView.$container();
  notEqual(containerDOM, undefined, "$container() returns an element");
  ok(containerDOM.is(_vis.get('world').$(testSel1)), "It's the element we'd get from searching the world.");

  var containerInput = _testModuleView.$container('input');
  ok(containerInput.is(containerDOM.find('input')), "Using a param with $container is the \
                                                     same as a .find() on the container");

  return;
});

// clear
test('clear', function() {
  ok(!_testModuleView.get('testCleared'), "Clear function not yet triggered.");
  _testModuleView.clear();
  ok(_testModuleView.get('testCleared'), "Clear function triggers correctly.");
});

// destroy
test('destroy', function() {
  ok(!_testModuleView.get('testCleared'), "Destroy calls 'clear' by default (not yet triggered)");
  _testModuleView.destroy();
  ok(_testModuleView.get('testCleared'), "Destroy calls 'clear' by default (destroy is a success)");
});

// dimensionsDidChange , hardReset
test('dimensionsDidChange , hardReset', function() {
  equal(_testModuleView.get('dimensionsDidChange'), true, "Default value for dimensionsDidChange is true");

  _testModuleView.set('dimensionsDidChange', false);
  equal(_testModuleView.get('dimensionsDidChange'), false, "dimensionsDidChange set to false");

  ok(!_testModuleView.get('testCleared'), "Clear function not yet triggered.");
  _testModuleView.hardReset();
  equal(_testModuleView.get('dimensionsDidChange'), true, "hardReset caused dimensionsDidChange to flip to true");
});


// width, height and affect on dimensionsDidChange
test('setting dimensions , hardReset', function() {

  var testDimVal = 10.5;
  var dimensions = ["width", "height"];

  for(var i = 0; i < dimensions.length; i++){
    var testDim = dimensions[i];

    // Setups: dimensionsDidChange should be false
    _testModuleView.set('dimensionsDidChange', false);
    equal(_testModuleView.get('dimensionsDidChange'), false, "dimensionsDidChange set to false");

    // Setting a dimension value (width/height)
    _testModuleView.set(testDim, testDimVal);
    // Should round down to an Integer:
    equal(_testModuleView.get(testDim), Math.floor(testDimVal), "Value for "+testDim+" was rounded down");
    // Test that changing a dimension causes dimensionsDidChange to turn true:
    ok(_testModuleView.get('dimensionsDidChange'), "Setting "+testDim+" caused dimensionsDidChange to flip true");

    // Test that setting to same value does not turn dimensionsDidChange true:
    _testModuleView.set('dimensionsDidChange', false);
    _testModuleView.set(testDim, testDimVal);
    ok(!_testModuleView.get('dimensionsDidChange'), "Setting to the same "+testDim+" value \
                                                     does not set dimensionsDidChange true");
    _testModuleView.set(testDim, testDimVal+0.1);
    ok(!_testModuleView.get('dimensionsDidChange'), "Setting to the slightly larger "+testDim+ " \
                                                     value does not set dimensionsDidChange true");
  }
});

// run can update selector (with the container param)
test('run with container param', function() {
  _testModuleView.updateSelector = function(){
    this.set('updateSelectorTriggered', true);
  }
  _testModuleView.run('testDimensions'); // No container param
  ok( !_testModuleView.get('updateSelectorTriggered') , "updateSelector was NOT triggered");

  _testModuleView.run('testDimensions', {container: '#qunit'}); // With container param
  ok( _testModuleView.get('updateSelectorTriggered') , "updateSelector was now triggered");
});

// run without explicit size dimensions
test('run (without explicit size dimensions)', function() {
  // Using the main "testSelector" to get a container
  _testModuleView.updateSelector(testSel1);
  equal(_testModuleView.get('height'), undefined, "Before running an operation, height is undefined");
  equal(_testModuleView.get('width'), undefined, "Before running an operation, width is undefined");

  // Perform full calculations on the first time running an action
  equal(_testModuleView.get('dimensionsDidChange'), true, "dimensionsDidChange is set true");
  _testModuleView.run('testDimensions');

  // Since dimensions changed, run the full operation (all calculations, etc.)
  equal(_testModuleView.get('previousActionType'), "full", "Since dimensionsDidChange, perform full action.")

  // _presetContainerAttrs
  // Updates width/height to the container's values if not explicitly passed
  var $container = _testModuleView.$container();
  var containerWidth = $container.width(),
      containerHeight = $container.height();
  notEqual(_testModuleView.get('width'), undefined, "After running the operation, width is no longer undefined!");
  equal(_testModuleView.get('width'), containerWidth, "Since it wasn't specified, width is now the container's width");
  equal(_testModuleView.get('height'), containerHeight, "Since it wasn't specified, height is now the container's height");

  // widgetParamedOutlineCSS (used for updating the container - empty if using the container's values)
  var cssAttrs = Object.keys(_testModuleView.widgetParamedOutlineCSS());
  equal(cssAttrs.length, 0, "No CSS attrs are provided by widgetParamedOutlineCSS since the container's values were used.")

  // If dimensions didn't change, sometimes we can do less to run the operation:
  equal(_testModuleView.get('dimensionsDidChange'), false, "dimensionsDidChange is now set false");
  _testModuleView.run('testDimensions');
  equal(_testModuleView.get('previousActionType'), "partial", "Since dimensionsDidChange is false, perform partial action.")
});

// run WITH explicit size dimensions
test('run (WITH explicit size dimensions)', function() {
  // Using the main "testSelector" to get a container
  _testModuleView.updateSelector(testSel1);
  equal(_testModuleView.get('height'), undefined, "Before running an operation, height is undefined");
  equal(_testModuleView.get('width'), undefined, "Before running an operation, width is undefined");

  var $container = _testModuleView.$container();
  var containerWidth = $container.width(),
      containerHeight = $container.height();

  // Test dimensions NOT the same as the container's values
  var testParams = {width: containerWidth-1, height: containerHeight-1};

  // Run the operation with explicit values:
  _testModuleView.run('testDimensions', testParams);
  notEqual(_testModuleView.get('width'), containerWidth, "Width was not set to container width");
  notEqual(_testModuleView.get('height'), containerHeight, "Height was not set to container height");

  // test that widgetParamedOutlineCSS provides adequate CSS values (can be used on container)
  var cssAttrs = _testModuleView.widgetParamedOutlineCSS(testParams);
  equal(cssAttrs.width, _testModuleView.get('width')+"px", "widgetParamedOutlineCSS has width with 'px' suffix");
  equal(cssAttrs.height, _testModuleView.get('height')+"px", "widgetParamedOutlineCSS has height with 'px' suffix");
});
