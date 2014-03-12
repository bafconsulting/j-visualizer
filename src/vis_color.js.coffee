###*
 # Visualizer Colorer
 # An Object that manages the many colors of a visualization.
 #
 # @TODO refactor this file, simplify color sets, make generally less confusing.
 #
 # @class Colorer
 # @namespace Visualizer
 # @extends Ember.Object
###
@Visualizer.Colorer = Ember.Object.extend
  ###*
   # visualizer is a reference to the parent Visualizer instance.
   #
   # @property visualizer
   # @type Visualizer
   # @required
  ###
  visualizer: null

  ###*
   # init is called upon creation of a Visualizer Colorer Object.
   # It is responsible for the initial processing and setup of the Object.
   #
   # @constructor
  ###
  init: () ->
    @get("_assignedUniq") # Pre-set the property
    @get("uniquePalette") # Pre-set the property
    @_setUniqueProps()

  ###*
   # freshColorPalette creates a new copy of
   # the main color scheme and returns it.
   #
   #
   # @method freshColorPalette
   # @return {Array} A collection of colors
  ###
  freshColorPalette: ->
    @get("_colorScheme").copy()

  ###*
   # fixed accepts a keyword, and attempts to use the keyword
   # to find a relevant color (e.g. "positive" may be "green").
   #
   # If a valid keyword is passed and a relevant color isn't found,
   # a color is assigned from the rotating set.
   #
   # @method fixed
   # @param {String} key The key for which a color is to be found
   # @return {String} A color
  ###
  fixed: (key="") ->
    if key? and (key = ""+key.toLowerCase()).length
      @get("_fixedVals.#{key}") or @_rotating_color(key)
    else
      @get('_defaultVal')

  ###*
   # uniquePalette is a collection of sets of remaining
   # colors. Often it will only have a main set, but some
   # applications may have more complex coloring needs.
   #
   # @property uniquePalette
   # @type Object (of Objects)
   # @required
  ###
  uniquePalette: Ember.computed -> {}

  ###*
   # _assignedUniq is a collection of sets of used colors
   # (accessed by key).
   # Often it will only have a main set, but some
   # applications may have more complex coloring needs.
   #
   # @property uniquePalette
   # @type Object (of Objects)
   # @required
  ###
  _assignedUniq: Ember.computed -> {}

  ###*
   # unique is a function used to get a unique color for a
   # given key within a given set (set defaults to "main").
   #
   # This function has helper properties to handle assigning
   # and unassigning colors, determining what the next color
   # will be, and so on.
   #
   # @TODO consider refactoring / making an Object instead of Function
   # (Sorry for the currently complex code)
   #
   # @method unique
   # @param {String} key The key for which a color is to be found
   # @param {String} [set='main'] The color set used to search get a color
   # @return {String} A color or undefined...
  ###
  unique: (key="", set="main")->
    @get("_assignedUniq.#{set}.#{key}")

  ###*
   # _setUniqueProps sets up the helper sub-functions on the `unique` function.
   #
   # This is complex, but allows the following syntax style:
   #
   # ```javascript
   #  colorer.unique("Dylan") => undefined
   #  colorer.unique.next() => "green"
   #
   #  colorer.unique.assign("Dylan") => undefined
   #  colorer.unique("Dylan") => "green"
   #  colorer.unique.next() => "purple"
   #
   #  colorer.unique.unassign("Dylan") => undefined
   #  colorer.unique("Dylan") => undefined
   # ```
   #
   # @method _setUniqueProps
   # @return {void}
   # @private
  ###
  _setUniqueProps: ->
    ###*
     # unique.next returns the next available color which can be
     # assigned to a key.
     #
     # @method unique.next
     # @param {String} [set='main'] The color set used to search get a color
     # @return {String} A color
    ###
    @unique.next = (set="main")=>
      @unique._prepareSet(set)
      @get("uniquePalette.#{set}.0")

    ###*
     # unique.assign attempts to assign a color to a key within a color set.
     #
     # @method unique.assign
     # @param {String} key The key for which a color is to be assigned
     # @param {String} [set='main'] The color set used to search get a color
     # @return {void}
    ###
    @unique.assign = (key, set="main")=>
      @unique._prepareSet(set)
      if key? and not @unique(key, set)?
        _poppedColor = (@get("uniquePalette.#{set}").shift() or @get("_defaultAssigned"))
        @set "_assignedUniq.#{set}.#{key}", _poppedColor

    ###*
     # unique.unassign attempts to unassign a color to a key within a color set.
     # The color is returned to the palette so that it may be reused later.
     #
     # @method unique.unassign
     # @param {String} key The key for which a color is to be unassigned
     # @param {String} [set='main'] The color set used to search get a color
     # @return {void}
    ###
    @unique.unassign = (key, set="main")=>
      @unique._prepareSet(set)
      if key?
        _color = @unique(key, set)
        if _color? and (_color isnt @get("_defaultUnassigned"))
          (@get("uniquePalette.#{set}").push(_color)) unless _color is @get("_defaultAssigned")
          delete @get("_assignedUniq.#{set}")[key]
          @get("uniquePalette.#{set}.0")

    ###*
     # unique.resetSet removes colors from all keys within the given set,
     # and also replenishes the palette.
     #
     # @method unique.resetSet
     # @param {String} set The color set used to search get a color
     # @return {void}
    ###
    @unique.resetSet = (set)=>
      @get("_assignedUniq")[set] = {}
      @get("uniquePalette")[set] = @freshColorPalette().shuffleVals()

    ###*
     # unique._prepareSet creates and prepares a color set if it doesn't yet exist.
     #
     # @method unique._prepareSet
     # @param {String} set The color set used to search get a color
     # @return {void}
    ###
    @unique._prepareSet = (set)=>
      (@unique.resetSet(set)) unless @get("uniquePalette.#{set}")?

  ###*
   # _defaultAssigned is the default color to use for highlighting an item
   # (when no other colors in the scheme apply - such as when you
   # wish to have unique colors per-key but have no more colors available)
   #
   # @property _defaultAssigned
   # @type String (a color)
  ###
  _defaultAssigned: "#5895B2"

  ###*
   # _defaultUnassigned is the default color to use for
   # non-highlighted, but still colored, items.
   #
   # @property _defaultUnassigned
   # @type String (a color)
  ###
  _defaultUnassigned: "#8da3b0"

  ###*
   # _colorScheme is a collection of colors used in the visualization.
   #
   # @property _colorScheme
   # @type Array (of color Strings)
  ###
  _colorScheme: ["#3498DB", "#9B59B6", "#F2CA27", "#34495E", "#1ABC9C", "#E74C3C", "#95A5A6", "#ECF0F1", "#2ECC71", "#5895B2"]


  _rotating_color_val: Ember.computed -> {}
  _rotating_keys_used: 0
  ###*
   # _rotating_color returns an assigned color for a given key
   # if available, otherwise assigns a color from the _colorScheme
   # (unlike unique(), if all colors are used up, it
   # starts from the first color again.)
   #
   # @method _rotating_color
   # @param {String} key The key for which a color is to be found
   # @return {String} A color
  ###
  _rotating_color: (key) ->
    if key?
      unless color = @get("_rotating_color_val.#{key}")
        _scheme = @get('_colorScheme')
        color = _scheme[ (@_rotating_keys_used++) % _scheme.length ]
        @set("_rotating_color_val.#{key}", color)
      color

  _defaultVal: Ember.computed ->
    (window.colors?.defaultSingle) or @get('_defaultAssigned')

  ###*
   # _fixedVals is a collection of key => color pairs for
   # commonly used keys
   #
   # @property _fixedVals
   # @type Object (key => String (color) pairs)
   # @required
  ###
  _fixedVals:
    blog: "#28cfc5"
    board: "#FB913F"
    twitter: "#2AA9E0"
    facebook: "#4D69A2"
    google: "#DD4C39"
    youtube: "#E14D42"
    instagram: "#FFCB33"
    linkedin: "#1E87BD"
    male: "#29A0CE"
    unisex: "#d6dadb"
    female: "#FC4482"
    positive: "#74B81D"
    negative: "#E74C3C"
    neutral: "#A8CEE0"
    unknown: "#d6dadb"
