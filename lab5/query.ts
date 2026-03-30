export type StepTag = 'where' | 'groupBy' | 'having' | 'sort';

// Упрощенный тип шага. Мы сохраняем тег для проверки порядка и Out для финального типа.
export type QueryStep<Tag extends StepTag, Out> = {
    __typeTag?: Tag;
    (data: any[]): Out[];
};

export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

export const where = <T, K extends keyof T>(key: K, value: T[K]) =>
    ((data: T[]) => data.filter((item) => item[key] === value)) as QueryStep<'where', T>;

export const sort = <T, K extends keyof T>(key: K) =>
    ((data: T[]) => {
        return [...data].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
    }) as QueryStep<'sort', T>;

export const groupBy = <T, K extends keyof T>(key: K) =>
    ((data: T[]): Group<T, K>[] => {
        return Object.values(
            data.reduce((acc: any, item: any) => {
                const k = item[key] as unknown as string;
                (acc[k] ??= { key: item[key], items: [] }).items.push(item);
                return acc;
            }, {})
        );
    }) as QueryStep<'groupBy', Group<T, K>>;

export const having = <T, K extends keyof T>(predicate: (group: Group<T, K>) => boolean) =>
    ((groups: Group<T, K>[]) => groups.filter(predicate)) as QueryStep<'having', Group<T, K>>;


// --- МАГИЯ ПРОВЕРКИ ПОРЯДКА ---

// Что после чего может идти
type ValidTransitions = {
    'where': 'where' | 'groupBy' | 'having' | 'sort';
    'groupBy': 'groupBy' | 'having' | 'sort';
    'having': 'having' | 'sort';
    'sort': 'sort';
};

// Рекурсивный проход по массиву аргументов
type CheckPipeline<Steps extends any[], Current extends StepTag = 'where'> =
    Steps extends [infer First, ...infer Rest]
        ? First extends QueryStep<infer Tag, any>
            ? Tag extends ValidTransitions[Current]
                ? [First, ...CheckPipeline<Rest, Tag>]
                : [`Ошибка: Нельзя ставить '${Tag}' после '${Current}'`] // Подменит тип на строку с ошибкой
            : ['Ошибка: Неверный тип шага']
        : [];

// Достаем тип из самого последнего переданного шага
type ExtractOutput<Steps extends any[], Fallback> =
    Steps extends [...any[], QueryStep<any, infer Out>] ? Out : Fallback;

// Функция query. Если порядок верный - принимает шаги. Если нет - ломает типы и выдает ошибку.
export function query<Steps extends any[]>(
    ...steps: Steps extends CheckPipeline<Steps> ? Steps : CheckPipeline<Steps>
): (data: any[]) => ExtractOutput<Steps, any>[] {
    return (data: any[]) => (steps as any[]).reduce((current, step) => (step as any)(current), data) as any;
}