import React, { useState } from 'react'
import type { TodoItem as TodoItemType } from '../../types/todo.types'
import { useAccessTodoStore } from './todoStore'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import Input from '../../components/Input'

type TodoItemProps = {
    todo: TodoItemType
}

const TodoItem = ({ todo }: TodoItemProps) => {
    const { useTodosStore } = useAccessTodoStore()
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(todo.text)

    const handleToggle = () => {
        useTodosStore.getState().toggleTodo(todo.id)
    }

    const handleRemove = () => {
        useTodosStore.getState().removeTodo(todo.id)
    }

    const handleUpdateText = () => {
        if (!editText.trim()) {
            return
        }
        useTodosStore.getState().updateTodo(todo.id, { text: editText })
        setIsEditing(false)
    }

    return (
        <>
            <div className={`todo-item ${todo.isDone ? 'done' : ''}`}>
                {isEditing ? (
                    <div className="edit-mode">
                        <Input
                            type="text"
                            value={editText}
                            onChange={(e) => {
                                return setEditText(e.target.value)
                            }}
                            onBlur={handleUpdateText}
                            onKeyPress={(e) => {
                                return e.key === 'Enter' && handleUpdateText()
                            }}
                            autoFocus
                        />
                        <Button onClick={handleUpdateText}>Save</Button>
                        <Button
                            onClick={() => {
                                return setIsEditing(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div className="view-mode">
                        <Checkbox checked={todo.isDone} onChange={handleToggle} />
                        <span
                            onClick={() => {
                                return setIsEditing(true)
                            }}
                            className="todo-text"
                        >
                            {todo.text}
                        </span>
                        <div className="actions">
                            <Button
                                onClick={() => {
                                    return setIsEditing(true)
                                }}
                            >
                                Edit
                            </Button>
                            <Button onClick={handleRemove} className="delete">
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .todo-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                .todo-item.done .todo-text {
                    text-decoration: line-through;
                    color: #aaa;
                }
                .edit-mode {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                }
                .edit-mode .input-component {
                    /* Assuming Input component uses a wrapper or has a class */
                    flex-grow: 1;
                }
                .view-mode {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                .todo-text {
                    flex-grow: 1;
                    margin-left: 8px;
                    cursor: pointer;
                }
                .actions {
                    display: flex;
                    gap: 8px;
                }
                .actions .delete {
                    background-color: #ffdddd;
                    border-color: #ffaaaa;
                }
                .actions .delete:hover {
                    background-color: #ffcccc;
                }
            `}</style>
        </>
    )
}

export default TodoItem
