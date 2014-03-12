###*
 # removeInstancesOf removes traces of a provided value from an Array
 #
 # @method removeInstancesOf
 # @param value The item to find-and-remove
 # @return {Array} The modified Array (with value removed)
 # @for Array
 # @namespace NativeClass
###
Array::removeInstancesOf = (value) ->
  loop
    if (val_location = @indexOf(value)) is -1
      break
    else
      @splice val_location, 1
  this

###*
 # shuffleVals - Fisher-Yates algorithm for shuffling arrays
 # in-place. (Essentially goes through each slot in array and
 # switches its value with one from a random slot...)
 #
 # @method shuffleVals
 # @return {Array} The shuffled Array
 # @for Array
 # @namespace NativeClass
###
Array::shuffleVals = () ->
  for item, i in @
    randLocation = Math.floor(Math.random() * (i + 1))
    temp = item
    @[i] = @[randLocation]
    @[randLocation] = temp
  this
