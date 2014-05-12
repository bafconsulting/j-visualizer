###*
 # Visualizer ModuleView
 # Module Views encapsulate the functionality for drawing,
 # coloring, and handling events on visualizations of the data
 # provided by a Module. These are the "visual" side of
 # data visualizations.
 #
 # @class ModuleView
 # @namespace Visualizer
 # @extends Ember.Object
###
@Visualizer.ModuleView = Ember.Object.extend
  ###*
   # module is a reference to the parent Module for this ModuleView instance.
   #
   # @property module
   # @type Visualizer.Module
   # @required
  ###
  module: null #Set to the parent module... MUST BE SET

  ###*
   # containerSelector is a string CSS selector used for finding
   # this ModuleView's window in a Visualization.
   #
   # Often unique, but occasionally multiple ModuleViews will be
   # written to share a container.
   #
   # Often this property will be specified in a widget's parameters,
   # otherwise child classes to ModuleView should specify defaults.
   # If a widget does specify a `container` param, it will be set and used
   # running any operation.
   #
   # @property containerSelector
   # @type String
   # @required
  ###
  containerSelector: null # MUST be set by child class or params...

  ###*
   # previousSelectors is a list history of selectors that were
   # previously set as this instance of a ModuleView's containerSelector.
   #
   # This may be useful for navigation, or for cleaning up after a visualization.
   #
   # @property previousSelectors
   # @type Array
  ###
  previousSelectors: Ember.computed -> []

  ###*
   # visualizer is a reference to the parent Visualizer instance.
   #
   # @property visualizer
   # @type Visualizer
   # @required
  ###
  visualizer: Ember.computed.alias('module.visualizer')

  ###*
   # data is a reference to the visible data for visualization.
   #
   # @property data
   # @type Ember.Array
   # @required
  ###
  data: Ember.computed.alias('module.dataset')

  ###*
   # arrangedContent is a reference to all Module data (sorted/arranged).
   # This property should only seldom be accessed because it includes
   # data which is deemed irrelevant by the Module (filtered, etc.)
   #
   # It may, however, be useful if a View decides to animate old data away
   # upon filtering / limiting its viewable data.
   #
   # @property arrangedContent
   # @type Ember.Array
   # @optional
  ###
  arrangedContent: Ember.computed.alias('module.arrangedContent')


  ###*
   # dimensionsDidChange is a flag used by ModuleViews to decide how much
   # processing is required when they run an operation.
   #
   # If all dimensions, including visible data, width, and height, are
   # unchanged, often times the old Visualization can simply be shown.
   #
   # Set to true by default, so that ModuleViews can have a proper first-draw.
   #
   # @property dimensionsDidChange
   # @type Boolean
  ###
  dimensionsDidChange: true

  ###*
   # init is called upon creation of a Visualizer ModuleView Object.
   # It is responsible for the initial processing and setup of the Object.
   #
   # Any preprocessing that is required to make the Module valid should be
   # done, at latest, on init. By default it sets the parent Module reference.
   #
   # @constructor
  ###
  init: (module) ->
    @set 'module', module

  ###*
   # clear cleanses/hides the current ModuleView from the visualization.
   #
   # This method is often called when a widget representing the ModuleView
   # leaves a visualization (either being removed from a scene,
   # or not being part of a new scene.)
   #
   # Each ModuleView should implement/override this, and should
   # provide (at least) the following functionality:
   #     - hide the container/elements (to prevent overlap/event-disruption),
   #     - unset isDrawn so that next time we know to fully redraw, etc.
   #
   # Optionally, it should also empty the DOM Node/SVG to save memory
   #
   # @method clear
   # @return {void}
  ###
  clear: ->
    # Override in extending moduleView...

  ###*
   # destroy totally removes the current ModuleView from the visualization.
   # This should entirely empty and remove any DOM-or-SVG Elements from the
   # document.
   #
   # This method is rarely called unless the Visualizer is being removed entirely.
   #
   # Each ModuleView should implement/override this function.
   #
   # @method destroy
   # @return {void}
  ###
  destroy: ->
    @clear()

  ###*
   # run is used used to execute a widget's operation on a ModuleView.
   # Many times additional parameters are passed, these assist in updating a
   # ModuleView by providing the widget's specifications (container, width,
   # any data limitations, etc.)
   #
   # If params includes a `container` key, its value will be used to define
   # this particular ModuleView's container viewport.
   #
   # @method run
   # @param {String} operation The method on this ModuleView to run.
   # @param {Object} [params] Any additional specifications for the operation.
   # @return {void}
  ###
  run: (operation, params={})->
    @updateSelector(params.container) if params.container
    @_presetContainerAttrs(params)
    @[operation]?(params)

  ###*
   # updateSelector takes a new containerSelector parameter, and uses it to
   # change this ModuleView's viewport. It also updates the `previousSelectors`
   # history to contain the selector that was used before this method was called.
   #
   # @method updateSelector
   # @param {String} containerSelector The new selector to use as a viewport
   # @return {void}
  ###
  updateSelector: (containerSelector)->
    if containerSelector isnt (_oldSel = @get('containerSelector'))
      @clear() # We clearly need to clear the old selector, right?
      @get('previousSelectors').push _oldSel # Book keeping
      @set 'containerSelector', containerSelector

  ###*
   # $container is a method which returns the ModuleView's container/viewport
   # JQuery Object.
   #
   # If a parameter is passed, $container will attempt to find that parameter
   # withing the structure of its container object.
   #
   # @method $container
   # @param {String} [selector] A CSS selector to use to find nodes within this World
   # @return {JQuery Object}
  ###
  $container: (selector) ->
    spacedSelector = if selector then " #{selector}" else ""
    @get('visualizer.world').$("#{@get('containerSelector')}#{spacedSelector}")

  ###*
   # hardReset clears out the ModuleView and tells it that dimensionsDidChange,
   # so the next redraw/execution is a fresh one (fully recalculated).
   #
   # This is automatically called when the ModuleView's data changes.
   #
   # @method hardReset
   # @return {void}
  ###
  hardReset: (()->
    @set('dimensionsDidChange', true) # Because the data itself is sort of a dimension, too...
    @get('module').requestRedraw()
  ).observes('data')

  ###*
   # widgetParamedOutlineCSS provides an Object where keys/values map to CSS attributes
   # relevant to the container ONLY for manually specified dimensions/positions.
   #
   # The point of this method is to provide access to data that can be used to set the
   # style of the DOM element containing this ModuleView to the manually-set specifications.
   #
   # If a developer opts to simply use a container's size/position, this will return an
   # empty object.
   #
   # @method widgetParamedOutlineCSS
   # @param {Object} [params] Any additional specifications for the operation
   # @return {Object} A collection of manually-specified size/position values
  ###
  widgetParamedOutlineCSS: (params={})->
    cssRules = {}
    for styleType in ['width', 'height', 'left', 'top']
      (cssRules[styleType] = "#{@get(styleType)}px") if params[styleType]?
    cssRules

  ###*
   # width getter/setter. Uses _updateDimension to coerce the set value
   # to an expected format (as well as to determine whether a dimension changed).
   #
   # @method width
   # @param {String} key ALWAYS set to "width"
   # @param [value] A value for setting (undefined for getting)
   # @return {Integer} A collection of manually-specified size/position values
   # @private ( ONLY access via `.get('width')` or `.set('width', value)` !!!)
  ###
  width: ((key, value)->
    @_updateDimension(key, value)
  ).property()

  ###*
   # height getter/setter. Uses _updateDimension to coerce the set value
   # to an expected format (as well as to determine whether a dimension changed).
   #
   # @method height
   # @param {String} key ALWAYS set to "height"
   # @param [value] A value for setting (undefined for getting)
   # @return {Integer} The updated value
   # @private ( ONLY access via `.get('height')` or `.set('height', value)` !!!)
  ###
  height: ((key, value)->
    @_updateDimension(key, value)
  ).property()

  ###*
   # _updateDimension is used when setting width or height.
   # It accepts a key (which should be set to "width" or "height"),
   # and a value.
   #
   # The value is rounded down to the nearest integer to keep the DOM clean,
   # and to keep determining changes simple.
   #
   # If the value isn't the same as this ModuleView's previous value for the
   # same key property, dimensionsDidChange flag will be set true so that the
   # ModuleView knows to perform its next operation with full calculations.
   #
   # @method _updateDimension
   # @param {String} key Either "width" or "height"
   # @param [value] A value for setting (undefined if just getting)
   # @return {Integer} The updated value
   # @private ( used by width/height setters )
  ###
  _updateDimension: (key, value)->
    if (value?)
      value = Math.floor(value)
      if value isnt (previousValue = @get(key)) # Check whether it actually changed...
        @set('dimensionsDidChange', true)
    value

  ###*
   # _presetContainerAttrs is used when running an operation to ensure that
   # required attributes based on the viewport (such as available width/height)
   # for visualization are set.
   #
   # If width or height are manually specified, this will not update that attribute -
   # in these cases, the ModuleView should know how to handle explicit dimensions.
   # The "resizable mixin" can help with this (more details in _resizable_mixin file)
   #
   # @method _presetContainerAttrs
   # @param {Object} [params] Any additional specifications for the operation.
   # @return {void}
  ###
  _presetContainerAttrs: (params={}) ->
    unless params.width? and params.height?
      container = @$container()
      (@set 'width', container.width()) unless params.width?
      (@set 'height', container.height()) unless params.height?
