var _vis, _visWorld;
var worldParam = $("body");
module("Visualizer.World Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {
    _vis = new Visualizer(worldParam);
    _visWorld = _vis.get('world')
  },

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});

test('Visualizer World exists, is a Visualizer World', function() {
  ok(_visWorld, "The test Visualizer.World exists");
  equal(_visWorld.constructor, Visualizer.World, "The test Visualizer.World is a Visualizer.World");
});

test('loaded', function() {
  notEqual(_visWorld.get('worldObj')[0], undefined, "The test world has a valid worldObj");
  ok(_visWorld.get('loaded'), "The test world is 'loaded' (true)");
  _visWorld.set('worldObj', $());
  equal(_visWorld.get('worldObj')[0], undefined, "The test world has an empty worldObj");
  ok(!_visWorld.get('loaded'), "The test world is not 'loaded' ('loaded' value is false)");
});

test('$ method', function() {
  equal(_visWorld.$()[0], _visWorld.get('worldObj')[0], "$ function with no arguments returns the worldObj's DOM element");

  var foundDivs = _visWorld.$().find('div');
  var $DivResults = _visWorld.$('div');
  for(var i = 0; i < foundDivs.length; i++){
    equal($DivResults[i], foundDivs[i], "$ function with a selector argument returns the same elements as performaing a find on the worldObj ... testing DOM Element Number "+i);
  }
});


asyncTest('resize method', 11, function() {
  _$worldObj = _visWorld.get('worldObj');

  equal(_visWorld.get('width'), _$worldObj.innerWidth(), "Width was sized by default");
  equal(_visWorld.get('height'), _$worldObj.innerHeight(), "Height was sized by default");
  equal(_visWorld.get('top'), _$worldObj.offset().top, "Top offset was set by default");
  equal(_visWorld.get('left'), _$worldObj.offset().left, "Left offset was set by default");

  _newWorld = _$worldObj.find('div').eq(1); // "brave"
  notEqual(_$worldObj[0], _newWorld[0], "New world isn't the same as the old world");
  notEqual(_$worldObj.height(), _newWorld.height(), "New world has a different height than the old world");

  _visWorld.set('worldObj', _newWorld);
  _$worldObj = _visWorld.get('worldObj');
  equal(_$worldObj[0], _newWorld[0], "The new world element is set as the world's worldObj");

  Ember.run.next(this, function(){
    equal(_visWorld.get('width'), _$worldObj.innerWidth(), "Width was sized by default");
    equal(_visWorld.get('height'), _$worldObj.innerHeight(), "Height was sized by default");
    equal(_visWorld.get('top'), _$worldObj.offset().top, "Top offset was set by default");
    equal(_visWorld.get('left'), _$worldObj.offset().left, "Left offset was set by default");
    start()
  });
});
