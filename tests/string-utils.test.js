const { capitalize, reverse } = require("../src/string-utils");

describe("string-utils", () => {
  describe("capitalize", () => {
    test("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    test("handles already capitalized string", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });

    test("handles single character", () => {
      expect(capitalize("a")).toBe("A");
    });

    test("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });

    test("handles null/undefined", () => {
      expect(capitalize(null)).toBe(null);
      expect(capitalize(undefined)).toBe(undefined);
    });
  });

  describe("reverse", () => {
    test("reverses a string", () => {
      expect(reverse("hello")).toBe("olleh");
    });

    test("reverses a palindrome", () => {
      expect(reverse("racecar")).toBe("racecar");
    });

    test("reverses single character", () => {
      expect(reverse("a")).toBe("a");
    });

    test("reverses empty string", () => {
      expect(reverse("")).toBe("");
    });
  });
});
