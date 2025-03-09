import React from "react";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";

interface NumberInputProps {
    id?: string;
    name?: string;
    label?: string;
    labelHtmlFor?: string;
    placeholder?: string;
    required?: boolean;
    value?: number;
    onChange?: (e: number | null) => void; 
    error?: string;
    formGroupClassName?: string;
    inputDisabled?: boolean;
    inputReadOnly?: boolean;
    inputAutoFocus?: boolean;
    min?: number;
    max?: number;
    inputClassName?: string;
    prefix?: string;
    suffix?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
    id,
    label,
    labelHtmlFor,
    placeholder,
    required,
    value,
    onChange,
    error,
    formGroupClassName,
    inputDisabled,
    inputReadOnly,
    inputAutoFocus,
    min,
    max,
    name,
    inputClassName,
    prefix,
    suffix
}) => {
    return (
        <div className={`page_form_group ${formGroupClassName}`}>
            {label && (
                <label htmlFor={labelHtmlFor} className={`custom_form_label ${required ? 'is_required' : ''}`}>{label}</label>
            )}

            <InputNumber
                id={id}
                name={name}
                value={value}
                onChange={(event: InputNumberChangeEvent) => onChange?.(event.value ?? null)}
                className={`custom_form_input ${inputClassName}`}
                placeholder={placeholder}
                disabled={inputDisabled}
                readOnly={inputReadOnly}
                autoFocus={inputAutoFocus}
                min={min}
                max={max}
                mode="decimal"
                useGrouping={false}
                prefix={prefix}
                suffix={suffix}
            />

            {error && <small className="form_error_msg">{error}</small>}
        </div>
    );
}

export default NumberInput;
