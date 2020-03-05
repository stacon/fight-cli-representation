/**
 * Converts a given string to another string based on the number of times given along with a delimitation.
 * Example 1: getStrTimes('#', 5) will return '#####'.
 * Example 2: getStrTimes('oWo', 3, '-') will return 'oWo-oWo-oWo'.
 * @param {string} the string that will be repeated.
 * @param {number} the number of times that it wil be repeated. Negative input will be converted to 0.
 * @param {string} delimitation the joining string between the strings.
 * @returns the created string
 */
 const getStrTimes= (str, times, delimitation = '') => {
  if (times < 0) times = 0;
  return new Array(times).fill(str).join(delimitation);
};

exports.default = getStrTimes;