###*
 # ResizableMixin
 # A helper mixin for ModuleViews which can have their size set manually.
 # This simplifies specifying size, padding, and position of a ModuleView
 # viewport container, and allows values to be set either relatively
 # (as a percentage of the Visualizer's World), or explicitly (e.g. "50px" or 50)
 #
 # @class ResizableMixin
 # @extends Ember.Mixin
 # @extensionfor Visualizer.ModuleView
 # @namespace Visualizer.ModuleView
###
Visualizer.ModuleView.ResizableMixin = Ember.Mixin.create

  ###*
   # run hijacks the ModuleView's run method to first attempt to update
   # the viewport's size based on the parameter specifications.
   # After attempting to update the size/position of the viewport,
   # the ModuleView's run function is allowed to proceed.
   #
   # @method run
   # @param {String} operation The method on this ModuleView to run.
   # @param {Object} [params] Any additional specifications for the operation.
   # @return {void}
  ###
  run: (operation, params={}) ->
    @_updateSize(params)
    @_super(operation, params)

  ###*
   # _updateSize scans the widget-sent params for manually-set
   # size/position values, uses these to set up the ModuleView's
   # relevant attributes.
   #
   # @method _updateSize
   # @param {Object} [params] Any additional specifications for the operation.
   # @return {void}
   # @private (called when `run` attempts to execute an operation)
  ###
  _updateSize: (params={}) ->
    @get("visualizer.world").resize()
    for dimension in [{key: 'width'}, {key: 'height'}, {key: "left", req: "width"}, {key: "top", req: "height"}]
      @_tryUpdateValue(dimension.key, params[dimension.key], params, dimension.req)

  ###*
   # _tryUpdateValue given a sizing/position-defining key and value,
   # this method attempts to parse the value and, if it's a relative
   # percentage or String, coerce it to an integer.
   #
   # Allows values to be explicit (e.g. 50, or "50px"), or relative
   # to the Visualizer's World (e.g. "50%"). Parameter relativeReq is
   # used to specify which of the World's parameters should be used to
   # determine a relative size (e.g. "left" uses the World's "width").
   #
   # params may also specify an amount of padding.
   #
   # @method _tryUpdateValue
   # @param {String} key The CSS property being set (width, height, left, top)
   # @param {String} val The value to use for setting the ModuleView property
   # @param {Object} [params] Any additional specifications for the operation.
   # @param {String} [relativeReq=key] The relevant property (to the key) on the World
   # @return {Boolean} True if the dimension changed, false otherwise.
   # @private (called when `_updateSize` attempts to execute)
  ###
  _tryUpdateValue: (key, val, params={}, relativeReq=key)->
    if val? # Code below is only for manually specified vals.
      if params.padding?
        padding = Visualizer.Utils.relativeSizeString(params.padding, @get("visualizer.world.#{relativeReq}"))
      padding = if padding? then padding else 15 # 'cuz (0 == false)

      newSize = Math.floor(Visualizer.Utils.relativeSizeString(val, @get("visualizer.world.#{relativeReq}")) - padding)
      if isFinite(newSize) and (@get(key) isnt newSize)
        @set(key, newSize)
        return true
    false
