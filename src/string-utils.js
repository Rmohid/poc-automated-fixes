/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverses a string.
 * @param {string} str
 * @returns {string}
 */
function reverse(str) {
  return str.split("").reverse().join("");
}

// ============================================================
// INTENTIONAL BUG: Uncomment the function below to trigger an
// ESLint eqeqeq error. This uses == instead of ===, which
// violates the eqeqeq lint rule configured in eslint.config.mjs.
//
// To exercise the automated bug detection loop:
//   1. Uncomment the function below
//   2. Commit and push to a non-main branch
//   3. Watch the GitHub Actions workflow create an issue
// ============================================================
// function looseEquals(a, b) {
//   return a == b;
// }

module.exports = { capitalize, reverse };
