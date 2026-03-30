import {describe, it, expectTypeOf } from 'vitest';

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type PickedByType<T, U> = {
    [P in keyof T as T[P] extends U ? P : never]: T[P];
};

export type EventHandlers<T> = {
    [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void;
};


type ComplexObject = {
    id: number;
    user: {
        name: string;
        roles: string[];
    };
};

type MixedObject = {
    id: number;
    name: string;
    isActive: boolean;
    age: number;
};

type Events = {
    click: MouseEvent;
    hover: MouseEvent;
    focus: FocusEvent;
};

describe('Lab 6: Utility Types', () => {

    it('1. DeepReadonly должен делать все вложенные поля неизменяемыми', () => {
        expectTypeOf<DeepReadonly<ComplexObject>>().toEqualTypeOf<{
            readonly id: number;
            readonly user: {
                readonly name: string;
                readonly roles: readonly string[];
            };
        }>();
    });

    it('2. PickedByType должен оставлять только поля нужного типа', () => {
        expectTypeOf<PickedByType<MixedObject, number>>().toEqualTypeOf<{
            id: number;
            age: number;
        }>();

        // Оставляем только булевы значения
        expectTypeOf<PickedByType<MixedObject, boolean>>().toEqualTypeOf<{
            isActive: boolean;
        }>();
    });

    it('3. EventHandlers должен генерировать правильные имена функций', () => {
        expectTypeOf<EventHandlers<Events>>().toEqualTypeOf<{
            onClick: (event: MouseEvent) => void;
            onHover: (event: MouseEvent) => void;
            onFocus: (event: FocusEvent) => void;
        }>();
    });
});