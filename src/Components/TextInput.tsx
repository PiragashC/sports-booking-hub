import React from "react";
import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import { InputType } from "../Utils/Common";

interface TextInputProps {
    id?: string;
    name?: string;
    label?: string;
    labelHtmlFor?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    keyFilter?: KeyFilterType;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    formGroupClassName?: string;
    inputDisabled?: boolean;
    inputReadOnly?: boolean;
    inputAutoFocus?: boolean;
    inputType?: InputType;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, labelHtmlFor, placeholder, required, value, keyFilter, onChange, error, formGroupClassName, inputDisabled, inputReadOnly, inputAutoFocus, inputType }) => {

    return (
        <div className={`page_form_group ${formGroupClassName}`}>
            {label && (
                <label htmlFor={labelHtmlFor} className={`custom_form_label ${required ? 'is_required' : ''}`}>{label}</label>
            )}

            <InputText
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="custom_form_input"
                placeholder={placeholder}
                keyfilter={keyFilter}
                disabled={inputDisabled}
                readOnly={inputReadOnly}
                autoComplete="off"
                autoFocus={inputAutoFocus}
                type={inputType}

            // invalid={error ? true : false}
            />

            {error && <small className="form_error_msg">{error}</small>}
        </div>
    )

}

export default TextInput;