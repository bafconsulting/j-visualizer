###*
 # Visualizer Utils
 # A collection of common utility functions used in the Visualizer.
 #
 # @class Utils
 # @namespace Visualizer
###
@Visualizer.Utils =
  ###*
   # existsWithValue checks if a values isn't null/undefined
   #
   # @method existsWithValue
   # @param {Object} item An item to check existence of
   # @return {Boolean} false if param is null or undefined, otherwise true
  ###
  existsWithValue: (item) ->  #Tested
    typeof item isnt "undefined" and item isnt null

  ###*
   # waitForRepeatingEvents is a debounce-like function for preventing
   # multiple execution. It should be called with a function and an
   # amount of time to wait. It can also be provided a timer name so as
   # to namespace the blocked items. It can also be called with an Object
   # timer set to allow different objects to not prevent the execution of
   # functions in others.
   #
   # @method waitForRepeatingEvents
   # @param {Function} callback The function to be called at end of waiting time
   # @param {Integer} timeout Number of milliseconds to wait before exectuing function
   # @param [String] timerName A namespace for the debounce @default "default timer"
   # @param [Object] timerSet A collection of timers to use in blocking functions @default {}
   # @return {Integer} The Timeout id assigned by the browser for the created timeout.
  ###
  waitForRepeatingEvents: (()-> #Tested
    _timers = {}
    return func = (callback, timeout, timerName = "default timer", timerSet = _timers) ->
      clearTimeout(timerSet[timerName])  if timerSet[timerName]
      timerSet[timerName] = setTimeout(callback, timeout)
  )()

  ###*
   # minVal takes two parameters, returns the smaller
   #
   # @method minVal
   # @param {Untyped} a An item to compare
   # @param {Untyped} b An item to compare
   # @return {Untyped} The smaller item
  ###
  minVal: (a, b) -> #Tested
    if a <= b then a else b

  ###*
   # maxVal takes two parameters, returns the larger
   #
   # @method maxVal
   # @param {Untyped} a An item to compare
   # @param {Untyped} b An item to compare
   # @return {Untyped} The larger item
  ###
  maxVal: (a, b) -> #Tested
    if a >= b then a else b

  ###*
   # boundedVal takes three parameters: an item, the lower bound,
   # and the upper bound. If the item is between the bounds,
   # the item is returned, otherwise the failed bound is returned.
   #
   # @method boundedVal
   # @param {Untyped} tried_value An item to compare
   # @param {Untyped} minimum_value The lower bound
   # @param {Untyped} maximum_value The upper bound
   # @return {Untyped} An object that's within the boundaries.
  ###
  boundedVal: (tried_value, minimum_value, maximum_value) -> #Tested
    if minimum_value > tried_value then minimum_value
    else if maximum_value < tried_value then maximum_value
    else
      tried_value

  ###*
   # randBetween provides a random number between two values.
   #
   # @method randBetween
   # @param {Number} [min=0] The lower bound
   # @param {Number} [max=10] The upper bound
   # @return {Number} A random number between min and max
  ###
  randBetween: (min=0, max=10) -> #Tested
    (Math.random() * (max - min)) + min

  ###*
   # randIntBetween provides a random (rounded) Integer between two values.
   #
   # @method randIntBetween
   # @param {Number} min The lower bound
   # @param {Number} max The upper bound
   # @return {Integer} A random Integer between min and max
  ###
  randIntBetween: (min, max) -> #Tested
    Math.floor Visualizer.Utils.randBetween(min, max) or 4

  ###*
   # isArray returns a flag of whether the parameter is of type Array
   #
   # @method isArray
   # @param {Untyped} input The object to check
   # @return {Boolean} Whether the input is an Array or not.
  ###
  isArray: (input) -> #Tested
    Object::toString.call(input) is "[object Array]"

  ###*
   # relativeSizeString parses an input size for either an explicit
   # value, or a value in relationship to some parent value.
   # E.g. "50%" of 900 = 450, "50" = 50, "50px" = 50
   #
   # @method relativeSizeString
   # @param {String} val The input value to parse
   # @param {Number} parentVal A number to use for relative parsing
   # @return {Number} The parsed numeric value
  ###
  relativeSizeString: (val, parentVal) ->
    parsedVal = parseInt(val)
    if typeof val is "string" and val.indexOf("%") >= 0
      (parsedVal / 100) * parentVal
    else if isFinite(parsedVal)
      parsedVal

  ###*
   # intersectionSafe is simple intersection code, iterates along two
   # sorted arrays incrementing the index of the smaller value
   # (if values are equal, it is part of intersection, and so store position and iterate both).
   # Returns array of indices of intersecting values with respect to the first array passed.
   #
   # intersectionSafe is modified from code found on StackOverflow at:
   # http://stackoverflow.com/a/1885660/624590
   #
   # @method intersectionSafe
   # @param {Array} a A sorted Array for comparison
   # @param {Array} b A sorted Array for comparison
   # @return {Array} The intersection of the two Arrays
  ###
  intersectionSafe: (a, b) ->
    a_index = 0
    b_index = 0
    results = []
    while (a_index < a.length) and (b_index < b.length)
      if a[a_index] < b[b_index]
        a_index++
      else if a[a_index] > b[b_index]
        b_index++
      else
        results.push a_index
        a_index++
        b_index++
    results

  ###*
   # intersectionCount is a modified form of intersectionSafe that simply
   # increments a counter instead of building an intersection Array.
   # (Faster because increments rather than pushing values to array,
   # also more memory efficient; JSPerf suggests 100% performance increase
   # - beneficial for large datasets...)
   #
   # @method intersectionCount
   # @param {Array} a A sorted Array for comparison
   # @param {Array} b A sorted Array for comparison
   # @return {Integer} The size of the intersection of the two Arrays
  ###
  intersectionCount: (a, b) ->
    a_index = 0
    b_index = 0
    count = 0
    while (a_index < a.length) and (b_index < b.length)
      if a[a_index] < b[b_index]
        a_index++
      else if a[a_index] > b[b_index]
        b_index++
      else
        count++
        a_index++
        b_index++
    count


  ###*
   # cloneArray creates a copy of an Array.
   #
   # @deprecated use Array.copy instead.
   #
   # @method cloneArray
   # @param {Array} inputArray An Array to copy
   # @return {Array} A copy of the input Array
  ###
  cloneArray: (inputArray) ->
    console?.log? "cloneArray function is deprecated, please use Array.copy()"
    inputArray.slice 0

###
# Previously Globally defined functions...
###

# This seems to be failing for the window[func] approach :(
# for func in ['existsWithValue']
#   window[func] = ->
#     console?.log? "Global Namespace for #{func} function is deprecated, please use Visualizer.Utils.#{func}"
#     Visualizer.Utils[func].apply window, arguments

window.waitForRepeatingEvents = () ->
  console?.log? "Global Namespace for waitForRepeatingEvents function is deprecated, please use Visualizer.Utils.waitForRepeatingEvents"
  Visualizer.Utils.waitForRepeatingEvents.apply window, arguments

window.existsWithValue = () ->
  console?.log? "Global Namespace for existsWithValue function is deprecated, please use Visualizer.Utils.existsWithValue"
  Visualizer.Utils.existsWithValue.apply window, arguments

###
# FUN!
###
Visualizer.Utils.updateKCodePosition = (key_pressed, position_tracker) ->
  if key_pressed is 38 # Up
    if position_tracker < 2
      position_tracker += 1  if position_tracker < 2
    else if position_tracker > 2
      position_tracker = 1
  else if key_pressed is 40 and (position_tracker is 2 or position_tracker is 3) # Down
    position_tracker += 1
  else if key_pressed is 37 and (position_tracker is 4 or position_tracker is 6) # Left
    position_tracker += 1
  else if key_pressed is 39 and (position_tracker is 5 or position_tracker is 7) # Right
    position_tracker += 1
  else if key_pressed is 66 and position_tracker is 8 # B
    position_tracker += 1
  else if key_pressed is 65 and position_tracker is 9 # A
    #Code executed!
    position_tracker = 10
  else
    position_tracker = 0
  position_tracker

getRandomKitten = (width, height) ->
  #Randomize slightly for variety
  width = Math.floor((Math.random() * 10) + width - 5)  if width > 8
  height = Math.floor((Math.random() * 10) + height - 5)  if height > 8
  "http://placekitten.com/" + width + "/" + height
