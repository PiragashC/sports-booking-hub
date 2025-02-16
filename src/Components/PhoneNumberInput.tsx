import React, { useState, useEffect } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { CountryCode } from "libphonenumber-js/types";

interface PhoneInputProps {
    id?: string;
    name?: string;
    label?: string;
    labelHtmlFor?: string;
    required?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    formGroupClassName?: string;
    setIsValidNumber?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PhoneNumberInput: React.FC<PhoneInputProps> = ({
    id,
    name,
    label,
    labelHtmlFor,
    required,
    value,
    onChange,
    error,
    formGroupClassName,
    setIsValidNumber
}) => {
    const [countryCode, setCountryCode] = useState<CountryCode | undefined>();

    // Handle phone number change
    const handleChange = (phone: string, country: CountryData) => {
        // Lock the country code to the selected country
        // setCountryCode(country.countryCode as CountryCode);
        if (onChange) {
            onChange(phone);
        }
    };

    // Validate phone number format
    useEffect(() => {
        if (setIsValidNumber) {
            const isValid = isValidPhoneNumber(value, countryCode);
            setIsValidNumber(isValid);
        }
    }, [value, countryCode, setIsValidNumber]);

    const isValidPhoneNumber = (phoneValue: string | undefined, code: CountryCode | undefined) => {
        if (!phoneValue ) return false;

        // Ensure value starts with '+' for proper parsing
        const formattedValue = phoneValue.startsWith("+") ? phoneValue : `+${phoneValue}`;

        const parsed = parsePhoneNumberFromString(formattedValue, code);
        return parsed?.isValid() || false;
    };

    return (
        <div className={`page_form_group ${formGroupClassName || ""}`}>
            {label && (
                <label
                    htmlFor={labelHtmlFor}
                    className={`custom_form_label ${required ? "is_required" : ""}`}
                >
                    {label}
                </label>
            )}

            <PhoneInput
                // country={countryCode} // Lock the country to the selected one
                value={value}
                onChange={handleChange}
                disableDropdown={false}
                enableSearch={true}
                inputProps={{
                    id,
                    name,
                    required,
                    autoComplete: "off",
                }}
                containerClass="custom_phone_input"
                dropdownClass="custom_phone_input_dropdown"
                searchPlaceholder="Search"
                inputClass={`phone_input ${error ? "invalid" : ""}`}
                preferredCountries={["ca", "us"]} // Optional: Prioritize Canada and US in the dropdown
            />

            {error && <small className="form_error_msg">{error}</small>}
            {!isValidPhoneNumber(value, countryCode) && value && (
                <small className="form_error_msg">Invalid phone number</small>
            )}
        </div>
    );
};

export default PhoneNumberInput;