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
// Function to show an error toast
export function showErrorToast(toastRef: React.RefObject<any>, title: string, content: string) {
    if (toastRef.current) {
        toastRef.current.show({
            severity: "error",
            summary: title,
            detail: content,
            life: 3000, // Duration in milliseconds
        });
    }
}

// Function to show a success toast
export function showSuccessToast(toastRef: React.RefObject<any>, title: string, content: string) {
    if (toastRef.current) {
        toastRef.current.show({
            severity: "success",
            summary: title,
            detail: content,
            life: 3000,
        });
    }
}
