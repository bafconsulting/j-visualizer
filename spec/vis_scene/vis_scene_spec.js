var _vis,
    _defaultScene,
    _specDrawWait,
    _specWait
    addSpecViews = function(){
      for(var i = 0; i < 3; i++){
        _vis.get('modules.'+i).addView('specView');
      }
    };
module("Visualizer.Scene Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {
    _vis = getSpecVisualizer();
    _defaultScene = _vis.get('currentScene');
    addSpecViews();
    _specDrawWait = 30;
    _specWait = (_specDrawWait + _defaultScene.get('fullRefreshWait'))*1.1;
  },

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});

test('Scene spec setup', function() {
  ok(_vis.get('scenes'), "The test Visualizer.scenes exists");
  ok(_vis.get('scenes.1'), "Test scene 1 is present");
  ok(_vis.get('scenes.2'), "Test scene 2 is present");
  equal(_vis.get('currentScene'), _vis.get('scenes.1'), "Test scene 1 set as the default currentScene");
  equal(_defaultScene, _vis.get('scenes.1'), "_defaultScene variable is also set to test scene 1");
});

// widgets
test('widgets', function() {
  ok(Visualizer.Utils.isArray(_defaultScene.get('widgets')), "Widgets is an Array");
  equal(_defaultScene.get('widgets.length'), 2, "Scene 1 (default) has 2 widgets");
  equal(_vis.get('scenes.2.widgets.length'), 1, "Scene 2 has 1 widget");
});

// requestedModuleViews
test('requestedModuleViews', function() {
  //scene 1:
  ok(_defaultScene.get('requestedModuleViews.0.specView'), "specView for module 0 is in requestedModuleViews of scene 1");
  ok(!_defaultScene.get('requestedModuleViews.1.specView'), "specView for module 1 is NOT in requestedModuleViews of scene 1");
  ok(_defaultScene.get('requestedModuleViews.2.specView'), "specView for module 2 is in requestedModuleViews of scene 1");
  //scene 2 (has different property values):
  ok(!_vis.get('scenes.2.requestedModuleViews.0.specView'), "specView for module 0 is NOT in requestedModuleViews of scene 1");
  ok(_vis.get('scenes.2.requestedModuleViews.1.specView'), "specView for module 1 is in requestedModuleViews of scene 1");
  ok(!_vis.get('scenes.2.requestedModuleViews.2.specView'), "specView for module 2 is NOT in requestedModuleViews of scene 1");
});



// drawWait
// default value:
test('drawWait default', function() {
  var _defaultWaitTime = 100;
  equal(_defaultScene.get('drawWait'), _defaultWaitTime, "default drawWait time is 100");
});

// drawWait is used:
asyncTest('drawWait is used', 2, function() {
  Ember.run.later(this, function () { // Allow the initial run (when adding the module) to occur first...

    var initialValue = _vis.get('modules.0.moduleViews.specView.val');
    // Let's tone down the drawWait value to make the tests run more quickly...
    _defaultScene.set('drawWait', _specDrawWait)

    _defaultScene.reload();
    _defaultScene.reload(); // Repeated call!
    _defaultScene.reload(); // Repeated call!
    _defaultScene.reload(); // Repeated call!

    Ember.run.later(this, function () {
      var newValue = _vis.get('modules.0.moduleViews.specView.val');
      equal(newValue, initialValue+1, "Although reload was called four times in succession, \
                                       only one triggered because drawWait time hadn't passed");

      _defaultScene.reload(); // Try reloading again again...
      Ember.run.later(this, function () {
        var finalValue = _vis.get('modules.0.moduleViews.specView.val');
        equal(finalValue, newValue+1, "However, it can be reloaded again after the drawWait time passes.");

        start();
      }, _specWait);

    }, _specWait);
  }, _specWait);
});

/*
// Tested reload/clear using following rules:
// scene 1 has two widgets: 0 and 2; 0 increments by 1 when it's run, 2 increases by 2.
// scene 2 has one widget, 1, which increments by 1 when it's run.
// Any widget that gets cleared (leaves a scene) results in a value of 0.
*/
asyncTest('reload (runWidgets and clear)', 6, function() {
  Ember.run.later(this, function () { // Allow the initial run (when adding the module) to occur first...
    var getViewValues = function(){
      return {
        0: _vis.get('modules.0.moduleViews.specView.val'),
        1: _vis.get('modules.1.moduleViews.specView.val'),
        2: _vis.get('modules.2.moduleViews.specView.val'),
      };
    };
    var initialValues = getViewValues();
    // Let's tone down the drawWait value to make the tests run more quickly...
    _defaultScene.set('drawWait', _specDrawWait)
    _defaultScene.reload();
    Ember.run.later(this, function () {
      var newValues = getViewValues();
      equal(newValues[0], initialValues[0]+1, "View 0 incremented");
      equal(newValues[2], initialValues[2]+2, "View 2 increased by 2 (using the params)"); // Tests that params work, too!
      equal(newValues[1], 0, "View 1 value was cleared!");

      // Switch scenes, wait for the automatic reload:
      _vis.setScene('2');
      Ember.run.later(this, function () {
        var finalValues = getViewValues();
        equal(finalValues[1], newValues[1]+1, "View 1 value was incremented");
        equal(finalValues[0], 0, "View 0 was cleared!");
        equal(finalValues[2], 0, "View 2 was cleared!");

        start();
      }, _specWait);

    }, _specWait);
  }, _specWait);
});
