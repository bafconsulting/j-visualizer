var test_visualizer;
var worldParam = $("body");
var testScenes = [{identifier: "main"}];
module("Visualizer Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {
    test_visualizer = new Visualizer(worldParam);
  },

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});


test('Visualizer exists, is a Visualizer', 2, function() {
  ok(test_visualizer, "The test Visualizer exists");
  equal(test_visualizer.constructor, Visualizer, "The test Visualizer is a Visualizer");
});

asyncTest('Visualizer uses its first parameter to create a World', 3, function() {
  Ember.run.next(this, function(){
    ok(test_visualizer.get('world'), "The test Visualizer has a world set");
    equal(test_visualizer.get('world').constructor, Visualizer.World, "The test Visualizer's world is an instance of Visualizer.World");

    equal(test_visualizer.get('world.worldObj')[0], worldParam[0], "The test Visualizer's world has a worldObj referencing the Visualizer constructor's first parameter");

    start()
  });
});

test('Visualizer includes a "colorer"', 2, function() {
  ok(test_visualizer.get('color'), "The test Visualizer has a colorer set at property .color");
  equal(test_visualizer.get('color').constructor, Visualizer.Colorer, "The colorer is an instance of Visualizer.Colorer");
});

test('Visualizer::addModule', 5, function() {
  // Test that property exists
  equal(typeof test_visualizer.get('modules'), "object", "The test Visualizer has a modules property referring to an Object");

  // Test initial values (no modules by default)
  startModuleCount = Object.keys(test_visualizer.get('modules')).length
  equal(startModuleCount, 0, "The visualizer's 'modules' Object is empty (no \"own\" properties)");

  var testModuleContent = {x: "OKAY"};
  var testModuleName = "testmod"
  test_visualizer.addModule(Visualizer.Module, testModuleName, testModuleContent)

  // Test that module was created, added to list
  newModuleCount = Object.keys(test_visualizer.get('modules')).length
  ok(newModuleCount > startModuleCount, "The visualizer's 'modules' Object has one new entry");
  equal(test_visualizer.get('modules.'+testModuleName).constructor, Visualizer.Module, "The added module is an instance of Visualizer.Module");

  // Test content argument
  equal(test_visualizer.get('modules.'+testModuleName+'.x'), "OKAY", "The content parameter is used for the Module's parameters");
});

test('Visualizer::useScenes , Visualizer::setScene', function() {
  var initialScenes = test_visualizer.get('scenes');
  // Test that property exists
  equal(typeof initialScenes, "object", "The test Visualizer has a scenes property referring to an Object");

  // Test initial values (no scenes, etc.)
  startSceneCount = Object.keys(initialScenes).length;
  equal(startSceneCount, 0, "The visualizer's 'scenes' Object is empty (no \"own\" properties)");
  equal(typeof test_visualizer.get('currentScene'), "undefined", "The currentScene is undefined by default");

  // Test useScenes, should add scenes
  test_visualizer.useScenes(testScenes);
  newSceneCount = Object.keys(test_visualizer.get('scenes')).length;
  ok(newSceneCount > startSceneCount, "The visualizer's 'scenes' Object has more entries than before");
  equal(test_visualizer.get('currentScene.identifier'), testScenes[0].identifier, "The first scene provided is used currentScene");

  // Test setScene for a present scene
  test_visualizer.setScene("main");
  equal(typeof test_visualizer.get('currentScene'), "object", "The currentScene is set using the identifier key");
  equal(test_visualizer.get('currentScene').constructor, Visualizer.Scene, "The currentScene is a Visualizer.Scene object");

  // Test setScene for a scene that does not exist:
  test_visualizer.setScene("scene two");
  equal(typeof test_visualizer.get('currentScene'), "undefined", "Attempting to setScene to a scene that does not exist results in an undefined currentScene");
});

test('Visualizer::refresh', function() {
  ok(!test_visualizer.refresh(), "Refresh fails if a scene isn't set (returns undefined)");
  test_visualizer.useScenes(testScenes);
  test_visualizer.setScene("main");
  ok(test_visualizer.refresh(), "Refresh works when a world.worldObj and currentScene both exist");
  test_visualizer.useWorld();
  ok(!test_visualizer.refresh(), "Refresh fails without a world.worldObj (returns undefined)");
});
