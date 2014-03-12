module("String Utils Unit Test", {

  /**
   * Setup is run before every test.
   */
  setup: function() {},

  /**
   * Teardown is run after every test.
   */
  teardown: function() {}
});

/**
 * String prototype tests:
 */


/**
 * truncateTo test
 * Returns a truncated String of (input) max_length, using (input) suffix (defaults to ellipsis)
 */

test('String.truncateTo', 5, function() {
  var blankWDefaultSuffix, key, longBlankString, longString, maxStringLength, shortString, string, testStrings, truncationSuffix;
  testStrings = {
    short: {
      text: "a"
    },
    long: {
      text: "1234567890"
    },
    long_blank: {
      text: "          "
    }
  };
  maxStringLength = 5;
  truncationSuffix = "---";
  for (key in testStrings) {
    string = testStrings[key];
    string.truncated = string.text.truncateTo(maxStringLength, truncationSuffix);
  }
  shortString = testStrings.short;
  equal(shortString.text, shortString.truncated, "Short strings stay the same.");
  longString = testStrings.long;
  notEqual(longString.text, longString.truncated, "Long strings are modified.");
  equal(longString.truncated.length, maxStringLength, "Truncated Strings have a length of truncation max_length parameter.");
  longBlankString = testStrings.long_blank;
  equal(longBlankString.truncated.replace(/^\s*/, ''), truncationSuffix, "Truncated strings end in the passed suffix");
  blankWDefaultSuffix = longBlankString.text.truncateTo(maxStringLength).replace(/^\s*/, '');
  equal(blankWDefaultSuffix, "…", "Truncated strings without a passed suffix end in an ellipsis");
});


/**
 * String.advancedIndexOf test
 * Search string for a substring, optional param (Object) (which can have option isCaseInsensitive)
 */

test('String.advancedIndexOf', 4, function() {
  var testString;
  testString = "ABC123";
  equal(testString.advancedIndexOf('a'), testString.indexOf('a'), "Defaults to standard indexOf");
  notEqual(testString.advancedIndexOf('ab', {isCaseInsensitive: true}), testString.indexOf('a'), "Adding isCaseInsensitive option causes a different result compared to indexOf");

  equal(testString.indexOf('ab'), -1, "Standard indexOf is not case sensitive, returns -1");
  ok(testString.advancedIndexOf('ab', {isCaseInsensitive: true}) > -1, "Adding isCaseInsensitive option results in an index greater than -1 (meaning the substring was found found)");
});


/**
 * String.includes test
 * Search string for a substring, optional param (Boolean) case_insensitive (default: false)
 */

test('String.includes', 4, function() {
  var testString;
  testString = "ABC123";
  ok(!testString.includes('a', false), "Case-sensitive matching doesn't find off-case values");
  ok(!testString.includes('a'), "Defaults to case-sensitive matching");
  ok(testString.includes('ABC', false), "Case-sensitive matching can find matching values");
  ok(testString.includes('aBc', true), "Case-insensitive matching does find off-case values");
});


/**
 * String.beginsWith test
 * Search string for a substring, optional param (Boolean) case_insensitive (default: false)
 */

test('String.beginsWith', 8, function() {
  var beginsWith1, has1, testString;
  testString = "ABC123";
  has1 = testString.includes('1');
  beginsWith1 = testString.beginsWith('1');
  ok(has1 && !beginsWith1, "Value found cannot be any except the start of the string.");
  ok(testString.beginsWith('AB'), "Returns true if string begins with input substring.");
  ok(!testString.beginsWith('ab'), "Defaults to case-sensitive search.");
  ok(testString.beginsWith('ab', true), "Finds beginning substring of off-case in case-insensitive mode.");
  ok(!testString.beginsWith('c', true), "In case-insensitive mode the Substring matched must still be at the start.");
  ok(!testString.beginsWith('78ryqueh', true), "False for strings entirely unfound");
  ok(testString.beginsWith('', false), "true for blank (case-sensitive)");
  ok(testString.beginsWith('', true), "true for blank (case-insensitive)");
});

test('String.removeInitialUnderscore', 2, function() {
  var leading_, no_leading_;
  no_leading_ = "NoUnderscore";
  equal(no_leading_.removeInitialUnderscore(), no_leading_, "Does not affect strings without a leading underscore.");
  leading_ = "_Something";
  equal(leading_.removeInitialUnderscore(), leading_.substring(1), "Deletes first char if it's an underscore");
});


/**
 * String.capitalizeLetter test
 * Search string for a substring, optional param (Boolean) case_insensitive (default: false)
 */

test('String.capitalizeLetter', 5, function() {
  var allOtherCharsNew, allOtherCharsOriginal, capitalizedMiddle, endOfNew, endOfOriginal, lowercaseString, middlePos, startOfNew, startOfOriginal;
  lowercaseString = "onetwothreefour";
  middlePos = Math.floor(lowercaseString.length / 2);
  capitalizedMiddle = lowercaseString.capitalizeLetter(middlePos);
  equal(capitalizedMiddle[middlePos], lowercaseString[middlePos].toUpperCase(), "Sets character at position to uppercase");
  equal(capitalizedMiddle.length, lowercaseString.length, "Results in same length string");
  equal(lowercaseString, lowercaseString.toLowerCase(), "Does not modify the input String object (returns a new object)");
  startOfOriginal = lowercaseString.slice(0, middlePos);
  startOfNew = capitalizedMiddle.slice(0, middlePos);
  endOfOriginal = lowercaseString.slice(middlePos + 1);
  endOfNew = capitalizedMiddle.slice(middlePos + 1);
  allOtherCharsOriginal = startOfOriginal + endOfOriginal;
  allOtherCharsNew = startOfNew + endOfNew;
  equal(allOtherCharsOriginal, allOtherCharsNew, "Does not modify the other characters in the String");
  equal(lowercaseString.capitalizeLetter(), lowercaseString.capitalizeLetter(0), "Uppercases first character by default");
});


/**
 * String.titleize test
 * Search string for a substring, optional param (Boolean) case_insensitive (default: false)
 */

test('String.titleize', 2, function() {
  var testString;
  testString = "ABC123%another-few words. tada!";
  equal(testString.titleize(), "Abc123%Another-Few Words. Tada!", "Titleize makes word characters that follow non-word-characters (as well as the first character) capitalized, makes other letters lowercase.");
  notEqual(testString.titleize(), testString, "Titleize does not modify the input String object (returns a new object)");
});
