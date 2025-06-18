import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    // Add any other specific styling or behavior props here
}

const Input = ({ value, onChange, placeholder, ...props }: InputProps) => {
    return (
        <>
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} {...props} />
            <style jsx>{`
                input {
                    padding: 8px 12px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    font-size: 1rem;
                    width: 100%; /* Default to full width, can be overridden by parent */
                    box-sizing: border-box; /* Include padding and border in the element's total width and height */
                }
                input:focus {
                    border-color: #007bff;
                    outline: none;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
            `}</style>
        </>
    )
}

export default Input
