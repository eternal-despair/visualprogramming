export function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

interface HasId {
  id: number;
}

export function findById<T extends HasId>(
  items: T[],
  id: number
): T | undefined {
  return items.find(item => item.id === id);
}
