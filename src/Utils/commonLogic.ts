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

export const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const getMonthDateRange = (selectedDate: Date) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // Get today's date
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    // Get first and last date of the selected month
    let fromDate = new Date(year, month, 1);
    let toDate = new Date(year, month + 1, 0); // Last day of the selected month

    // If the selected month is the current month, set fromDate to today
    if (year === todayYear && month === todayMonth) {
        fromDate = today;
    }


    return {
        from: formatDate(fromDate),
        to: formatDate(toDate),
    };
};

export const formatDateToISO = (date: Date | null): string => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
};

export type InputType = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';

export const formatTime = (time?: string) => {
    if (!time) return "Invalid Time";
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


