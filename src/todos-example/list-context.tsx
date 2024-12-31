import { createContext, useContext } from 'react'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types'

export type Entry = {
	item: any;
	element: HTMLElement;
	itemId: string;
	index: number;
}
export type ListContextValue = {
	getListLength: () => number;
	registerItem: (entry: Entry) => CleanupFn;
	instanceId: symbol;
};


export const ListContext = createContext<ListContextValue | null>(null)
export const useListContext:any = () => {
	return useContext(ListContext)
}