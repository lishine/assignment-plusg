import React from 'react'
import './App.css' // Keep global styles if any, or remove if not needed
import Todos from './features/todo/Todos'

const App = () => {
    return (
        <>
            {/* Global styles can be placed here or in index.css / App.css */}
            <style jsx global>{`
                body {
                    font-family:
                        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                * {
                    box-sizing: border-box;
                }
            `}</style>
            <Todos />
        </>
    )
}

export default App
