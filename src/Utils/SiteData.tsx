export interface TimeList {
    id?: number;
    label: string;
    value: string;
}

export const timeList: TimeList[] = [
    // { id: 1, label: '12:00 AM', value: '00:00:00' },
    // { id: 2, label: '12:30 AM', value: '00:30:00' },
    // { id: 3, label: '01:00 AM', value: '01:00:00' },
    // { id: 4, label: '01:30 AM', value: '01:30:00' },
    // { id: 5, label: '02:00 AM', value: '02:00:00' },
    // { id: 6, label: '02:30 AM', value: '02:30:00' },
    // { id: 7, label: '03:00 AM', value: '03:00:00' },
    // { id: 8, label: '03:30 AM', value: '03:30:00' },
    // { id: 9, label: '04:00 AM', value: '04:00:00' },
    // { id: 10, label: '04:30 AM', value: '04:30:00' },
    // { id: 11, label: '05:00 AM', value: '05:00:00' },
    // { id: 12, label: '05:30 AM', value: '05:30:00' },
    // { id: 13, label: '06:00 AM', value: '06:00:00' },
    // { id: 14, label: '06:30 AM', value: '06:30:00' },
    // { id: 15, label: '07:00 AM', value: '07:00:00' },
    // { id: 16, label: '07:30 AM', value: '07:30:00' },
    { id: 17, label: '08:00 AM', value: '08:00:00' },
    { id: 18, label: '08:30 AM', value: '08:30:00' },
    { id: 19, label: '09:00 AM', value: '09:00:00' },
    { id: 20, label: '09:30 AM', value: '09:30:00' },
    { id: 21, label: '10:00 AM', value: '10:00:00' },
    { id: 22, label: '10:30 AM', value: '10:30:00' },
    { id: 23, label: '11:00 AM', value: '11:00:00' },
    { id: 24, label: '11:30 AM', value: '11:30:00' },
    { id: 25, label: '12:00 PM', value: '12:00:00' },
    { id: 26, label: '12:30 PM', value: '12:30:00' },
    { id: 27, label: '01:00 PM', value: '13:00:00' },
    { id: 28, label: '01:30 PM', value: '13:30:00' },
    { id: 29, label: '02:00 PM', value: '14:00:00' },
    { id: 30, label: '02:30 PM', value: '14:30:00' },
    { id: 31, label: '03:00 PM', value: '15:00:00' },
    { id: 32, label: '03:30 PM', value: '15:30:00' },
    { id: 33, label: '04:00 PM', value: '16:00:00' },
    { id: 34, label: '04:30 PM', value: '16:30:00' },
    { id: 35, label: '05:00 PM', value: '17:00:00' },
    { id: 36, label: '05:30 PM', value: '17:30:00' },
    { id: 37, label: '06:00 PM', value: '18:00:00' },
    { id: 38, label: '06:30 PM', value: '18:30:00' },
    { id: 39, label: '07:00 PM', value: '19:00:00' },
    { id: 40, label: '07:30 PM', value: '19:30:00' },
    { id: 41, label: '08:00 PM', value: '20:00:00' },
    { id: 42, label: '08:30 PM', value: '20:30:00' },
    { id: 43, label: '09:00 PM', value: '21:00:00' },
    { id: 44, label: '09:30 PM', value: '21:30:00' },
    { id: 45, label: '10:00 PM', value: '22:00:00' },
    // { id: 46, label: '10:30 PM', value: '22:30:00' },
    // { id: 47, label: '11:00 PM', value: '23:00:00' },
    // { id: 48, label: '11:30 PM', value: '23:30:00' }
];

export interface CountryList {
    id?: number;
    name: string;
    shortForm?: string;
    logoUrl?: string;
    code?: string;
    examplePhoneNumber?: number;
}

export const countryList: CountryList[] = [
    { id: 1, name: 'Afghanistan', shortForm: 'AF', logoUrl: '/images/flags/AF.png', code: '93', examplePhoneNumber: 934567890 },
]