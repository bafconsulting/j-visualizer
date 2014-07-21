visSpecFixtures = {};

visSpecFixtures.worldParam = $("body");

// MODULE VIEW:
visSpecFixtures.specView = Visualizer.ModuleView.extend(Visualizer.ModuleView.ResizableMixin,
  {
    container: '',
    val: 0,
    increment: function(params){
      var incVal = (params.incVal == null) ? 1 : params.incVal;
      this.set('val', this.get('val') + incVal);
    },
    clear: function(){
      this.set('val', 0);
    }
  }
);

// MODULE:
visSpecFixtures.specModule = Visualizer.Module.extend({
  defaultViews: Ember.computed(function(){
    return {
      specView: visSpecFixtures.specView,
      hiddenSpecView: visSpecFixtures.specView
    };
  }),

  // For test purposes:
  redrawWasRequested: false,
  requestRedraw: function(){
    this.set('redrawWasRequested', true);
    this._super();
  }
});

// SCENES JSON:
var getSpecScenes = function(){
  return [
    {
      identifier: "1",
      fullRefreshWait: 10,
      widgets: [{
        module: "0",
        view: "specView",
        operation: "increment",
        params: {}
      },{
        module: "2",
        view: "specView",
        operation: "increment",
        params: {incVal: 2}
      }]
    },
    {
      identifier: "2",
      drawWait: 10,
      fullRefreshWait: 10,
      widgets: [{
        module: "1",
        view: "specView",
        operation: "increment"
      }]
    },
  ];
};

// VISUALIZERS:

var getSpecVisualizer = function(){
  var _vis = new Visualizer(visSpecFixtures.worldParam);
  _vis.useScenes(getSpecScenes());
  _vis.setScene("1");

  for(var i = 0; i < 3; i++){
    _vis.addModule(visSpecFixtures.specModule, ""+i);
  }
  return _vis;
}

visSpecFixtures.emptyVisualizer =  new Visualizer(visSpecFixtures.worldParam);
visSpecFixtures.specVisualizer = getSpecVisualizer();
