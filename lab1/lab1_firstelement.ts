function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = getFirstElement([1, 2, 3]);
const str = getFirstElement(["a", "b", "c"]);
