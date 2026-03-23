import { describe, it, expect } from 'vitest';
import { where, sort, groupBy, having, query, Group } from './pipeline';

// Тип из задания
type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

// Данные из задания
const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

describe('Lab 4: Pipeline Functions', () => {

    it('Должна работать фильтрация (where) и сортировка (sort)', () => {
        const search = query<User>(
            where("name", "John"),
            where("surname", "Doe"),
            sort("age")
        );

        const result = search(users);

        expect(result).toEqual([
            { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
            { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
            { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
        ]);
    });

    it('Должна работать группировка (groupBy) и фильтрация групп (having)', () => {
        const groupAndFilter = query<User>(
            groupBy("city"),
            having<User, "city">((group) => group.items.length > 1)
        );

        const grouped = groupAndFilter(users);

        expect(grouped).toHaveLength(2); // NY и LA
        expect(grouped[0].key).toBe("NY");
        expect(grouped[1].key).toBe("LA");
    });

    it('Должен работать комбинированный конвейер (все вместе)', () => {
        const pipeline = query<User>(
            where("surname", "Doe"),
            groupBy("city"),
            having<User, "city">((group) => group.items.some((u) => u.age > 34))
        );

        const res = pipeline(users);

        // Ожидаем только группу LA, так как в NY нет никого старше 34
        expect(res).toHaveLength(1);
        expect(res[0].key).toBe("LA");
        expect(res[0].items).toHaveLength(2); // id 3 и id 4
    });
});