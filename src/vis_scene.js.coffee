###*
 # Visualizer Scene
 # Represents the Object used to manage data (Modules), and the way the data's viewed.
 #
 # The visualization of data is a combined effort of all components contained in this project,
 # accessed through this Object.
 #
 # @class Scene
 # @namespace Visualizer
 # @extends Ember.Object
###
@Visualizer.Scene = Ember.Object.extend
  ###*
   # visualizer is a reference to the parent Visualizer instance.
   #
   # @property visualizer
   # @type Visualizer
   # @required
  ###
  visualizer: null

  ###*
   # identifier is a string identifier uniquie to this instance of a Scene
   #
   # @property identifier
   # @type String
   # @required
  ###
  identifier: null

  ###*
   # title is simply a title for the scene, which some
   # Visualizer applications may find useful for guiding users.
   #
   # @property title
   # @type String
   # @optional
  ###
  title: null

  ###*
   # description is simply a description of the scene, which some
   # Visualizer applications may find useful for describing a scene to users.
   #
   # @property description
   # @type String
   # @optional
  ###
  description: null

  ###*
   # drawWait is the debounce time waited before running a single widget's update.
   # If a widget's reload is requested many times in rapid succession it will wait
   # until drawWait milliseconds after the last call before executing the reload.
   #
   # @property drawWait
   # @type Integer (milliseconds)
   # @default 100
   # @required
  ###
  drawWait: 100

  ###*
   # fullRefreshWait is an additional debounce time waited before
   # totally updating the scene. This adds some
   #
   # @property fullRefreshWait
   # @type Integer (milliseconds)
   # @default 20
   # @required
  ###
  fullRefreshWait: 20

  ###*
   # widgets references a collection of "widget" Objects, each of which
   # should reference a Module, a ModuleView, an operation to call upon the ModuleView,
   # and any additional parameters required (specifications for the ModuleView to follow).
   #
   # @property widgets
   # @type Array
   # @required
  ###
  widgets: Ember.computed -> []

  ###*
   # requestedModuleViews is a computed property that returns
   # a dictionary of Modules -> ModuleViews , used to determine which views will be
   # used by the scene. This is particularly useful when changing scenes to determine
   # which Views need to be cleared out, and which will be used in the next scene.
   #
   # Used as a searchable dictionary: `requestedModuleViews[moduleA][moduleViewA] => true`
   #
   # @property requestedModuleViews
   # @type Object
  ###
  requestedModuleViews: (->
    moduleList = {}
    for widget in @get('widgets')
      moduleKey = (moduleList[widget.module] ?= {})
      moduleKey[widget.view] = true
    moduleList
  ).property('widgets.[]')

  ###*
   # clearUnusedViews sends a "clear" request to each ModuleView used by the current
   # instance of Visualizer, which isn't used in any of this scene's widgets.
   # In essence it ensures that any Views that are not currently in use are cleansed.
   #
   # @method clearUnusedViews
   # @chainable
  ###
  clearUnusedViews: ->
    for own moduleName, module of @get("visualizer.modules")
      for own viewName, view of module?.get('moduleViews')
        view?.clear?() unless @get("requestedModuleViews.#{moduleName}.#{viewName}")
    @

  ###*
   # runWidgets iterated this scene's widgets, and requests that the ModuleView specified
   # for each widget executes the operation specified for each widget.
   #
   # For example, it may tell one ModuleView, a word cloud, to draw itself, and
   # another ModuleView, a set of icons, to group themselves by common-words.
   #
   # @method runWidgets
   # @chainable
  ###
  runWidgets: (widgets = @get('widgets')) ->
    @_runWidget(widget) for widget in widgets
    @

  ###*
   # _runWidget runs the current scene's operation for a single widget.
   # Waits for repeating events to prevent multiple refreshes on the
   # same dimensions/parameters.
   #
   # @method _runWidget
   # @return {void}
   # @private
  ###
  _runWidget: (widget={})->
    viewIdentifier = "visualizer.modules.#{widget.module}.moduleViews.#{widget.view}"
    Visualizer.Utils.waitForRepeatingEvents (=>
      @get(viewIdentifier)?.run(widget.operation, widget.params)
    ), @get("drawWait"), "Scene Redraw for #{viewIdentifier}", @get('visualizer.timers')

  ###*
   # reload initiates the process of updating the visualization by cleaning out old Views
   # and updating all current widgets.
   #
   # Prevents rapid-exectuion by delaying each request by an amount of time specified
   #  by property drawWait, and afterward only using the most recent request (as a debounce).
   #
   # @method reload
   # @return {void}
  ###
  reload: ->
    Visualizer.Utils.waitForRepeatingEvents (=>
      @clearUnusedViews()
      @runWidgets()
    ), @get('fullRefreshWait'), "Full Scene Reload", @get('visualizer.timers')
