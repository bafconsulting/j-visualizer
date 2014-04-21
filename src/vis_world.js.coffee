###*
 # Visualizer World
 # Represents an Object used to manage an overview viewport for visualizations.
 #
 # @class World
 # @namespace Visualizer
 # @extends Ember.Object
###
@Visualizer.World = Ember.Object.extend
  ###*
   # loaded is a boolean variable indicating whether or the world is
   # prepared to hold a visualization.
   #
   # Currently it simply check's whether the world JQuery object exists
   #
   # @property loaded
   # @type Boolean
  ###
  loaded: Ember.computed.gt('worldObj.length', 0)

  ###*
   # $ is a method which returns the world's JQuery Object, worldObj.
   # If a parameter is passed, $ will attempt to find that parameter
   # withing the structure of the worldObj.
   #
   # @method $
   # @param [selector] A CSS selector to use to find nodes within this World
   # @return {JQuery Object}
  ###
  $: (selector) ->
    if selector? then @get('worldObj').find(selector) else @get('worldObj')

  ###*
   # resize recalculates the width, height, top, and left properties of the
   # worldObj DOM Element
   #
   # This method is automatically called when a World is created.
   #
   # @method resize
   # @return {void}
  ###
  resize: (()->
    $worldObj = @get('worldObj')
    if $worldObj.length
      offset = @get('worldObj').offset()
      @setProperties
        width: $worldObj.innerWidth()
        height: (_height = $worldObj.innerHeight())
        top: offset.top
        left: offset.left
  ).observes('worldObj').on('init')

  ###*
   # _bindGlobalEvents binds this World's resize event to the window's resize,
   # such that every time the window's size changes this World attempts to
   # update its properties to reflect the new window.
   #
   # Private, since this method is automatically called when a World is created.
   #
   # @method _bindGlobalEvents
   # @return {void}
   # @private
  ###
  _bindGlobalEvents: (() ->
    $(window).on "resize", => @resize()
  ).on('init')

  ###*
   # _bindWorldEvents binds and generic event listeners that
   # occur within the World's domain
   #
   # Private, since this method is automatically called when a World is created
   # as well as when the worldObj changes to reference a new area.
   #
   # @method _bindWorldEvents
   # @return {void}
   # @private
  ###
  _bindWorldEvents: (() ->
    if($world = @$()).length
      $world.off("click", ".phasedButton").on("click", ".phasedButton", _handlePhasedButtonClick)
  ).observes('worldObj').on('init')

  ###*
   # injectDefaultWorld clears out the Visualizer World's contents, injects the basic
   # visualizer skeleton
   #
   # @deprecated @todo Deprecate this. ModuleViews should take care of this on a per-App basis...
   #
   # @method injectDefaultWorld
   # @return {void}
  ###
  injectDefaultWorld: ()->
    @$().empty().append $(defaultWorldTemplate)

###*
 # _handlePhasedButtonClick is called when an element with class phasedButton
 # is clicked. Adds a class 'disabledItem' to the element for 2 seconds;
 # if the element is clicked again before the class 'disabledItem' class expires,
 # the click will be ignored.
 #
 # @method _handlePhasedButtonClick
 # @return {void}
 # @private
###
_handlePhasedButtonClick = (e) ->
  if $(this).hasClass("disabledItem")
    e.stopImmediatePropagation()
    return false
  Ember.run.next @, ->
    $(this).addExpiringClass "disabledItem", 2000

# Private:
# TODO: Emberize, make this a real template/view.
#       Alternatively: REMOVE, allow each moduleView to ensure it's own parts exist
defaultWorldTemplate = "
  <div id='static-area' class='static-area'>
    <div id='visualizer-loading-indicator'> </div>
  </div>
  <div id='shared-area'> </div>
"
