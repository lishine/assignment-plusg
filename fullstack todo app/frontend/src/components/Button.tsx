import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
    // Add any other specific styling or behavior props here
}

const Button = ({ children, onClick, ...props }: ButtonProps) => {
    return (
        <>
            <button onClick={onClick} {...props}>
                {children}
            </button>
            <style jsx>{`
                button {
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    background-color: #f0f0f0;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.2s ease;
                }
                button:hover {
                    background-color: #e0e0e0;
                }
                button:disabled {
                    background-color: #f9f9f9;
                    color: #aaa;
                    cursor: not-allowed;
                    border-color: #eee;
                }
            `}</style>
        </>
    )
}

export default Button
