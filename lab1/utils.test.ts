import { describe, it, expect } from "vitest";
import { getFirstElement, findById } from "./utils.ts";

describe("getFirstElement", () => {
  it("возвращает первый элемент", () => {
    expect(getFirstElement([1, 2, 3])).toBe(1);
  });

  it("возвращает undefined для пустого массива", () => {
    expect(getFirstElement([])).toBeUndefined();
  });
});

describe("findById", () => {
  const items = [
    { id: 1, name: "A" },
    { id: 2, name: "B" }
  ];

  it("находит элемент по id", () => {
    expect(findById(items, 2)).toEqual({ id: 2, name: "B" });
  });

  it("возвращает undefined, если не найден", () => {
    expect(findById(items, 3)).toBeUndefined();
  });
});
