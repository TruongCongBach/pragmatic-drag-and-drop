import React, { Fragment, useEffect, useRef, useState } from 'react'
import { attachClosestEdge, Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import invariant from 'tiny-invariant'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import ReactDOM from 'react-dom'
import { useListContext } from '@/todos-example/list-context'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { TodosType } from '@/todos-example/data'

type DraggableState =
	| {type: 'idle'}
	| {type: 'preview'; container: HTMLElement}
	| {type: 'dragging'};
const idleState: DraggableState = { type: 'idle' }
const draggingState: DraggableState = { type: 'dragging' }

const TodoItem: React.FC<{todo: TodosType, index: number}> = ({ todo, index }) => {

	const { registerItem, instanceId } = useListContext()

	const ref = useRef<HTMLDivElement>(null)

	const dragHandleRef = useRef<HTMLDivElement>(null)

	const [draggableState, setDraggableState] = useState<DraggableState>(idleState)
	const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

	useEffect(() => {
		const element = ref.current
		const dragHandle = dragHandleRef.current
		invariant(element)
		invariant(dragHandle)

		return combine(
			registerItem({
				item: todo,
				element,
				itemId: todo.id,
				index,
			}),
			draggable({
				element: dragHandle,
				onDragStart: () => {
					setDraggableState(draggingState)
				},
				onDrop: () => {
					setDraggableState(idleState)
				},
				getInitialData: () => {
					return {
						...todo,
						instanceId,
						index,
					}
				},
				// onGenerateDragPreview({nativeSetDragImage}) {
				// 	setCustomNativeDragPreview({
				// 		nativeSetDragImage,
				// 		getOffset: pointerOutsideOfPreview({
				// 			x: token('space.400', '16px'),
				// 			y: token('space.100', '8px'),
				// 		}),
				// 		render({ container }) {
				// 			setDraggableState({ type: 'preview', container });
				// 			return () => setDraggableState(draggingState);
				// 		},
				// 	});
				// }
			}),
			dropTargetForElements({
				element: element,
				onDrag({ self, source }) {
					const isSource = source.element === element
					if (isSource) {
						setClosestEdge(null)
						return
					}
					const closestEdge = extractClosestEdge(self.data)
					const sourceIndex = source.data.index
					invariant(typeof sourceIndex === 'number')

					const isItemBeforeSource = index === sourceIndex - 1
					const isItemAfterSource = index === sourceIndex + 1

					const isDropIndicatorHidden =
						(isItemBeforeSource && closestEdge === 'bottom') ||
						(isItemAfterSource && closestEdge === 'top')

					if (isDropIndicatorHidden) {
						setClosestEdge(null)
						return
					}

					setClosestEdge(closestEdge)
				},
				onDragLeave() {
					setClosestEdge(null)
				},
				onDrop() {
					setClosestEdge(null)
				},
				canDrop({ source }) {
					return source.data.instanceId === instanceId
				},
				getData({ input }) {
					return attachClosestEdge({
						...todo,
						index,
					}, {
						element,
						input,
						allowedEdges: ['top', 'bottom'],
					})
				},
			}),
		)
	}, [instanceId, todo, index])

	return <Fragment>
		<div>

			<div className={`bg-gray-400 m-2 w-[300px] ${draggableState.type === 'dragging' ? '' : 'opacity-80'}`}
					 ref={ref}
			>
				{closestEdge && <div className="border-2 border-[#0055ff] mb-2"/>}
				<div ref={dragHandleRef} className="text-black p-2">
					{todo.id} - {todo.task}
				</div>
			</div>
			{draggableState.type === 'preview' &&
				ReactDOM.createPortal(
					<div className="text-black p-2">
						{todo.id} - {todo.task} preview
					</div>,
					draggableState.container,
				)}
		</div>

	</Fragment>
}
export default TodoItem