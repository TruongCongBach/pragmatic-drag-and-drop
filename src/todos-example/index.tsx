import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { ListContext, ListContextValue } from '@/todos-example/list-context'
import TodoItem from '@/todos-example/todo-item'
import { getItemRegistry, reorder, TODO_LIST, TodosType } from '@/todos-example/data'

const TodosExample = () => {
	const [todos, setTodos] = useState<TodosType[]>(TODO_LIST)
	const [registry] = useState(getItemRegistry)
	const [instanceId] = useState(() => Symbol('todo-id'))


	const getListLength = useCallback(() => todos.length, [todos.length])

	const contextValue: ListContextValue = useMemo(() => {
		return {
			registerItem: registry.register,
			instanceId,
			getListLength,
		}
	}, [registry.register, instanceId, getListLength])


	useEffect(() => {
		return monitorForElements({
			canMonitor({ source }) {
				return source.data.instanceId === instanceId
			},
			onDrop({location, source}) {
				const target = location.current.dropTargets[0];
				if (!target) {
					return;
				}

				const sourceData = source.data;
				const targetData = target.data;
				const targetIndexData = todos.findIndex(todoItem => todoItem.id === targetData.id)
				const sourceIndexData = todos.findIndex(todoItem => todoItem.id === sourceData.id)
				if(targetIndexData < 0 || sourceIndexData < 0) {
					return;
				}
				setTodos(prevState => {
					return reorder(prevState, sourceIndexData, targetIndexData)
				})
			}

		})
	}, [instanceId, todos])

	return <div>
		<ListContext.Provider value={contextValue}>
			<div className="my-auto flex gap-2">
				<div className="bg-white">
					{todos.map((todo, index) => {
						return <TodoItem
							todo={todo}
							key={todo.id}
							index={index}
						/>
					})}
				</div>
			</div>
		</ListContext.Provider>
	</div>
}
export default TodosExample