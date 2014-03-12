###*
 # addExpiringClass adds a temporary class to a JQuery object.
 # The class has an expiry, after which it is removed.
 #
 # @method addExpiringClass
 # @param {String} [className="disabled"] Class name
 # @param {Integer} [timeout=1000] Number of milliseconds until class expires
 # @return {void}
 # @for fn
 # @namespace jQuery
###
jQuery.fn.extend
  addExpiringClass: (className = "disabled", timeout = 1000) ->
    @addClass className
    setTimeout ( => @removeClass className ), timeout
