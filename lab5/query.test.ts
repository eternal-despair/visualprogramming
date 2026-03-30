import { describe, it, expect, expectTypeOf } from 'vitest';
import { where, sort, groupBy, having, query, Group } from './query';

type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
];

describe('Lab 5: Type-safe strict Query order', () => {

    it('Должна успешно компилироваться при верном порядке и проверять типы', () => {
        const pipeline = query(
            where<User, "surname">("surname", "Doe"),
            groupBy<User, "city">("city"),
            having<User, "city">((group) => group.items.length > 0)
        );

        const result = pipeline(users);
        
        expect(result).toHaveLength(2);

        // Компилятор автоматически понимает, что на выходе массив групп!
        expectTypeOf(result).toEqualTypeOf<Group<User, "city">[]>();
    });

    it('Должна выдавать ошибку компиляции при попытке поставить sort перед where', () => {
        // @ts-expect-error
        const badQuery = query(
            sort<User, "age">("age"),
            where<User, "name">("name", "John")
        );
    });

    it('Должна выдавать ошибку компиляции при попытке поставить groupBy после having', () => {
        // @ts-expect-error
        const badQuery2 = query(
            groupBy<User, "city">("city"),
            having<User, "city">((group) => true),
            groupBy<User, "surname">("surname")
        );
    });
});