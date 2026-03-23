// 1. Тип Transform<T> (для where и sort: принимает T[] и возвращает T[])
export type Transform<In, Out = In> = (data: In[]) => Out[];

// 2. Тип Where<T>
export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

// 3. Тип Sort<T>
export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

// 4. Тип Group<T, K>
export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

// 5. Тип GroupBy<T
export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<T, Group<T, K>>;

// 6. Тип GroupTransform<T, K>
export type GroupTransform<T, K extends keyof T> = Transform<Group<T, K>>;

// 7. Тип Having<T>
export type Having<T> = <K extends keyof T>(
    predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;



export const where = <T>(key: keyof T, value: T[keyof T]) => 
    (data: T[]) => data.filter((item) => item[key] === value);

export const sort = <T>(key: keyof T) => 
    (data: T[]) => {
        return [...data].sort((a, b) => {
            const av = a[key];
            const bv = b[key];
            if (av < bv) return -1;
            if (av > bv) return 1;
            return 0;
        });
    };

export const groupBy = <T>(key: keyof T) => 
    (data: T[]): any[] => {
        return Object.values(
            data.reduce((acc: any, item: any) => {
                const k = item[key] as unknown as string;
                (acc[k] ??= { key: item[key], items: [] }).items.push(item);
                return acc;
            }, {})
        );
    };

export const having = <T, K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => 
    (groups: Group<T, K>[]) => groups.filter(predicate);

export function query<T>(...steps: any[]) {
    return (data: T[]) => {
        return steps.reduce((currentData, step) => step(currentData), data);
    };
}