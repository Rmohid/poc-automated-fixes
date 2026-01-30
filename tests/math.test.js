const { add, multiply } = require("../src/math");

describe("math", () => {
  describe("add", () => {
    test("adds two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    test("adds negative numbers", () => {
      expect(add(-1, -2)).toBe(-3);
    });

    test("adds zero", () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe("multiply", () => {
    test("multiplies two positive numbers", () => {
      expect(multiply(3, 4)).toBe(12);
    });

    test("multiplies by zero", () => {
      expect(multiply(5, 0)).toBe(0);
    });

    test("multiplies negative numbers", () => {
      expect(multiply(-2, 3)).toBe(-6);
    });
  });

  // ============================================================
  // INTENTIONAL BUG: Uncomment the test below to trigger a Jest
  // test failure. This asserts that add(2, 2) === 5, which is
  // intentionally wrong.
  //
  // To exercise the automated bug detection loop:
  //   1. Uncomment the test below
  //   2. Commit and push to a non-main branch
  //   3. Watch the GitHub Actions workflow create an issue
  // ============================================================
  // test("INTENTIONAL FAILURE: add(2, 2) should equal 5", () => {
  //   expect(add(2, 2)).toBe(5);
  // });
});
