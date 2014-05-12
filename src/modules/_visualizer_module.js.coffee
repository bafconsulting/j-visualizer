###*
 # Visualizer Module
 # A Visualizer Module is a collection of data used for Visualization.
 # It keeps access slightly standardized and offers several helpers to
 # simplify data management.
 #
 # Each Module also has a collection of relevant ModuleViews - Objects that
 # define and take care of how a given Module's data can be displayed.
 #
 # @class Module
 # @namespace Visualizer
 # @extends Ember.ArrayController
###
@Visualizer.Module = Ember.ArrayController.extend
  ###*
   # visualizer is a reference to the parent Visualizer instance.
   #
   # @property visualizer
   # @type Visualizer
   # @required
  ###
  visualizer: null

  ###*
   # maxLength is an integer size of how much data should be displayed.
   # Sometimes a project will collect more data than is practical to display
   # to the user (either because it will be confusing, or otherwise too slow);
   # this property represents that limit.
   #
   # @property maxLength
   # @type Integer
   # @required
  ###
  maxLength: 100

  ###*
   # content is the full set of data (in Array , Ember.Array) form that is
   # available to this Module.
   #
   # Note: this attribute should only be accessed from the
   # data-management side of your app; it's where you dump data, and it's
   # what you generally access for front-end filtering. This Module's
   # ModuleViews should not access the content, however - they should access
   # the dataset (which is a subset of content).
   #
   # @property content
   # @type Ember.Array
   # @required
  ###
  content: (Ember.computed ()-> Ember.A() ).property()

  ###*
   # dataset is the subset of content used for current visualization.
   # It can potentially be the exact same data as content, in full,
   # but it can also be a limited/truncated version (often using the
   # maxLength property). It may also filtered down by properties, etc.
   #
   # ModuleViews should only look here for their Module data.
   #
   #
   # @property dataset
   # @type Ember.Array
   # @required
  ###
  dataset: Ember.computed.alias('arrangedContent')

  ###*
   # moduleViews an object dictionary/map of Visualizer ModuleView objects,
   # each of which must be relevant to this particular Module's data structuring.
   #
   # For example, if this Module is a set of words with frequencies, a WordCloud
   # may be an applicable ModuleView.
   #
   # @property moduleViews
   # @type Ember.Object
   # @required
  ###
  moduleViews: (Ember.computed ()-> Ember.Object.create()).property()

  ###*
   # init is called upon creation of a Visualizer Module Object.
   # It is responsible for the initial processing and setup of the Object.
   #
   # Any preprocessing that is required to make the Module valid should be
   # done, at latest, on init.
   #
   # If the Module defines a setDefaultViews function (to prepopulate its
   # ModuleViews), that function will be called automatically.
   #
   # @constructor
  ###
  init: ->
    @setDefaultViews?()

  ###*
   # requestRedraw sends a request to the current scene
   # to redraw the widgets relevant to this module (and no others).
   #
   # @method requestRedraw
   # @return {void}
  ###
  requestRedraw: ()->
    scene = @get('visualizer.currentScene')
    key = @get('key')
    if scene? and key?
      scene.runWidgets scene.get('widgets')?.filterBy('module', key)

  ###*
   # forceLimit sorts the current data by a provided key, and selects only the
   # first maxLength (property) items for this Module's dataset, ensuring that
   # the limit to the viewed-data's size is enforced.
   #
   # @TODO consider implementing a n-item max-heap data structure instead of sorting
   #
   # @method forceLimit
   # @param {String} [key='timestamp'] Property to use for sorting the data.
   # @return {void}
  ###
  forceLimit: (key = 'timestamp') ->
    items = @get('dataset').sort (_a, _b) -> _b[key] - _a[key]
    @set 'dataset', items.slice(0, @get('maxLength'))

  ###*
   # groupedBy creates a cached property on the Module to retrieve its data
   # in the form of a two-dimensional Array, where the sub arrays contain
   # this Module's dataset split into sets that share a common (passed) property.
   #
   # The outside Array is sorted by length, so the largest groups are at the start.
   #
   # Since the result is cached, it will only be recomputed when the dataset changes,
   # keeping this efficient. The first time you use groupBy for any given property
   # after the data changes (or is created) runs O(nlogn), but each subsequent access
   # is simply O(1) as it simply grabs the previous data. Say what??? :P
   #
   # @method groupedBy
   # @param {String} property Property to use for grouping the data.
   # @return {Array} The Module's dataset grouped by the property
  ###
  groupedBy: (property) ->
    cachableProperty = property.replace('.', '__')
    cache = "__groupedBy_#{cachableProperty}"
    unless (val = @get(cache))?
      newProp = {}
      newProp[cache] = (() ->
        @_groupedBy(property).sort (_a, _b) -> _b.length - _a.length
      ).property("dataset.@each.#{property}") # This property observer is sadly quite slow the first time it's called :(
      @reopen(newProp)
    val or @get(cache)

  ###*
   # _groupedBy groups the Module's dataset by a given property, returning
   # an unsorted, two-dimensional array.
   #
   # This method should not be called explicitly, instead developers should
   # go through the `groupedBy` method (no leading underscore), which
   # caches the groups (making redraws far more efficient)
   #
   # @method _groupedBy
   # @param {String} property Property to use for grouping the data.
   # @return {Array} The Module's dataset grouped by the property
  ###
  _groupedBy: (property) ->
    grouped = Ember.Object.create()
    for item in @get('dataset')
      key = Ember.get(item, property)
      (grouped[key] ?= []).push item
    grouped.values()
