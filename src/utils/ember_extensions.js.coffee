Ember.Object.reopen
  ###*
   # values takes an Object and returns its values
   # (similar to `.keys()`)
   #
   # @method values
   # @return {Array} The values
  ###
  values: ->
    for key in Object.keys(@)
      @[key]
