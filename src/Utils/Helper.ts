export const parseStringToDate = (dateString: string): Date | null => {
    if (!dateString)
        return null;
    const [year, month, day] = dateString.
        split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const parseStringToTime = (timeString: string): Date | null => {
    if (!timeString) return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatTime = (date: Date | null): string => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};
