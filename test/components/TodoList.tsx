import React from 'react'
import TodoItem from './TodoItem'
import { TodoListProps } from '@types'

// TodoItem

function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  // const styles = useStyles()

  return pug`
    ul
      each todo in todos
        TodoItem(
          todo=todo
          key=todo.id
          onToggle=onToggle
          onRemove=onRemove
          )
  `
}

export default TodoList
