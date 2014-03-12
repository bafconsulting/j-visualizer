Ember.Object.reopen
  ###*
   # values takes an Object and returns its values
   # (similar to `.keys()`)
   #
   # @method values
   # @return {Array} The values
  ###
  values: ->
    value for own key, value of @
