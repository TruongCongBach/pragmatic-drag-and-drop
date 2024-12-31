import { Entry } from '@/todos-example/list-context'

export type TodosType = {
	id: number
	task: string
	isCompleted: boolean
	dueDate: string
}
export const TODO_LIST: TodosType[] = [
	{
		id: 1,
		task: 'Read a book',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
	{
		id: 2,
		task: 'Clean the room',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
	{
		id: 3,
		task: 'Exercise',
		isCompleted: true,
		dueDate: '2024-12-31',
	},
	{
		id: 4,
		task: 'Call a friend',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
	{
		id: 5,
		task: 'Cook a new recipe',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
	{
		id: 6,
		task: 'Plan next week',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
	{
		id: 7,
		task: 'Take care of plants',
		isCompleted: true,
		dueDate: '2024-12-31',
	},
	{
		id: 8,
		task: 'Finish homework/project',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
	{
		id: 9,
		task: 'Listen to a podcast/music',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
	{
		id: 10,
		task: 'Turn off phone for 30 minutes',
		isCompleted: false,
		dueDate: '2024-12-31',
	},
]

export function getItemRegistry() {
	const registry = new Map<string, HTMLElement>()

	function register({ itemId, element }: Entry) {
		registry.set(itemId, element)

		return function unregister() {
			registry.delete(itemId)
		}
	}
	return { register }
}

export const reorder = (list:any[], sourceIndex: number, targetIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(sourceIndex, 1);
	result.splice(targetIndex, 0, removed);

	return result;
};

