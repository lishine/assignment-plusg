import React, { useState } from 'react'
import { useAccessTodoStore } from '../features/todo/todoStore'
import Button from './Button'
import Input from './Input'

const AddTodoForm = () => {
    const [text, setText] = useState('')
    const { useTodosStore } = useAccessTodoStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) {
            return
        }
        useTodosStore.getState().addTodo(text)
        setText('')
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    value={text}
                    onChange={(e) => {
                        return setText(e.target.value)
                    }}
                    placeholder="What needs to be done?"
                />
                <Button type="submit">Add Todo</Button>
            </form>
            <style jsx>{`
                form {
                    display: flex;
                    gap: 8px; /* Spacing between input and button */
                    margin-bottom: 16px;
                }
                /* Input component already has width: 100%, adjust if needed or rely on flex behavior */
                /* Button will take its natural width */
            `}</style>
        </>
    )
}

export default AddTodoForm
