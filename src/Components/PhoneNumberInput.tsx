import React, { useState } from "react";
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
    setIsValidNumber?: React.Dispatch<React.SetStateAction<boolean>>
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
        setCountryCode(country.countryCode as CountryCode);
        if (onChange) {
            onChange(phone);
            !phone && setIsValidNumber && setIsValidNumber(true);
        }
    };

    // Validate phone number format
    const isValidPhoneNumber = () => {
        if (!value || !countryCode) return false;

        // Ensure value starts with '+' for proper parsing
        const formattedValue = value.startsWith("+") ? value : `+${value}`;

        const parsed = parsePhoneNumberFromString(formattedValue, countryCode as CountryCode);
        setIsValidNumber && setIsValidNumber(parsed?.isValid() || false);
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
                country={countryCode || ""}
                value={value}
                onChange={handleChange}
                disableDropdown={false}
                enableSearch={true}
                inputProps={{
                    id,
                    name,
                    required,
                    autoComplete: "off",
                    disabled: !countryCode, // Disable input if no country is selected
                }}
                containerClass="custom_phone_input"
                dropdownClass="custom_phone_input_dropdown"
                searchPlaceholder="Search"
                inputClass={`phone_input ${error ? "invalid" : ""}`}
            />

            {error && <small className="form_error_msg">{error}</small>}
            {!isValidPhoneNumber() && value && (
                <small className="form_error_msg">Invalid phone number</small>
            )}
        </div>
    );
};

export default PhoneNumberInput;
