export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) =>
                !(value === "" ||
                    (Array.isArray(value) && value.length === 0) ||
                    (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0))
        )
    ) as Partial<T>;
}