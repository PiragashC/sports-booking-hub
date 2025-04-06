import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

interface TextAreaProps {
    id?: string;
    name?: string;
    label?: string;
    labelHtmlFor?: string;
    placeholder?: string;
    rows?: number;
    cols?: number;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    formGroupClassName?: string;
    textAreaClassName?: string;
    inputAutoFocus?: boolean;
    inputDisabled?: boolean;

}

const TextArea: React.FC<TextAreaProps> = ({
    id,
    name,
    label,
    labelHtmlFor,
    placeholder,
    rows,
    cols,
    required,
    value,
    onChange,
    error,
    formGroupClassName,
    textAreaClassName,
    inputAutoFocus,
    inputDisabled
}) => {

    return (
        <div className={`page_form_group ${formGroupClassName}`}>
            {label && (
                <label htmlFor={labelHtmlFor} className={`custom_form_label ${required ? 'is_required' : ''}`}>{label}</label>
            )}

            <InputTextarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                cols={cols}
                className={`custom_form_input is_text_area ${textAreaClassName}`}
                placeholder={placeholder}
                autoComplete="off"
                autoFocus={inputAutoFocus}
                disabled={inputDisabled}

            />

            {error && <small className="form_error_msg">{error}</small>}
        </div>
    )

}

export default TextArea;