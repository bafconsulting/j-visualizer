###*
 # truncateTo ensures a string is no longer than a given size limit.
 # (In the case that it is longer, a suffix can be given for truncation)
 #
 # @method truncateTo
 # @param {Integer} maxLength The maximum length of the String
 # @param {String} [suffix="…"] A String to use append in case of truncation
 # @return {String} The String cut to maxLength or fewer characters
 # @for String
 # @namespace NativeClass
###
String::truncateTo = (maxLength, suffix="…") ->
  suffixLength = suffix.length
  (maxLength = suffix.length + 1) if isNaN(maxLength) or maxLength <= suffixLength
  if @length > maxLength
    return (@substr(0, maxLength - suffixLength) + suffix)
  this

###*
 # advancedIndexOf searches the object String for a parameter
 # substring, allows additional options (such as case-insensitivity).
 #
 # @method advancedIndexOf
 # @param {String} subString The substring to search for
 # @param {Object} [options] Additional options for searching
 # @return {Integer} Similar to indexOf: -1 if not found,
 #                   otherwise the first start position of the substring.
 # @for String
 # @namespace NativeClass
###
String::advancedIndexOf = (subString, options={}) ->
  thisString = this # cloned
  if options.isCaseInsensitive
    thisString = thisString.toLowerCase()
    subString = subString.toLowerCase()
  thisString.indexOf subString

###*
 # includes searches the object String for a parameter
 # substring, returns boolean, accepts optional parameter
 # to specify whether the search should be case-insensitive.
 #
 # @method includes
 # @param {String} subString The substring to search for
 # @param {Boolean} [isCaseInsensitive=false] Specify whether search is case-sensitive
 # @return {Boolean} True if substring was found, otherwise false
 # @for String
 # @namespace NativeClass
###
String::includes = (subString, isCaseInsensitive) ->
  @advancedIndexOf(subString, {isCaseInsensitive: isCaseInsensitive}) >= 0

###*
 # beginsWith searches the start of the object String for a parameter
 # substring, returns boolean, accepts optional parameter
 # to specify whether the search should be case-insensitive.
 #
 # @method beginsWith
 # @param {String} subString The substring to search for
 # @param {Boolean} [isCaseInsensitive=false] Specify whether search is case-sensitive
 # @return {Boolean} True if substring was found at the beginning, otherwise false
 # @for String
 # @namespace NativeClass
###
String::beginsWith = (subString, isCaseInsensitive) ->
  @advancedIndexOf(subString, {isCaseInsensitive: isCaseInsensitive}) is 0

###*
 # capitalizeLetter is a String capitalize function adapted from
 # http://stackoverflow.com/a/3291856/624590 .
 # Capitalizes the letter at position n of the object String.
 #
 # @method capitalizeLetter
 # @param {Integer} [n=0] The index of the character to capitalize
 # @return {String} The modified String with capitalized letter
 # @for String
 # @namespace NativeClass
###
String::capitalizeLetter = (n = 0) ->
  start = if n is 0 then "" else @slice(0, n)
  start + @charAt(n).toUpperCase() + @slice(n + 1)

###*
 # titleize creates a title-formatted copy of a String
 #
 # @method titleize
 # @return {String} The modified String with updated casing
 # @for String
 # @namespace NativeClass
###
String::titleize = ->
  @toLowerCase().replace /\b\w/g, (match) -> match.toUpperCase()

###*
 # removeInitialUnderscore removes the first leading underscore from a String
 #
 # @method removeInitialUnderscore
 # @return {String} The modified String with leading underscore removed
 # @for String
 # @namespace NativeClass
###
String::removeInitialUnderscore = ->
  @replace /^_/, ""
