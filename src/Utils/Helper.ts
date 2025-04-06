export const parseStringToDate = (dateString: string): Date | null => {
    if (!dateString)
        return null;
    const [year, month, day] = dateString.
        split('-').map(Number);
    return new Date(year, month - 1, day);// Months are zero-based
};

export const parseStringToTime = (timeString: string): Date | null => {
    if (!timeString) return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds
    return date;
};

export const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};