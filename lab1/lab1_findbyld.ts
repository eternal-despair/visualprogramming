interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Пример
const users = [
  { id: 1, name: "Ivan" },
  { id: 2, name: "Anna" }
];

const user = findById(users, 2);
