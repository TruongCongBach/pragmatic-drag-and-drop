'use client';

import AppProvider from '@atlaskit/app-provider';
import BoardExample from '@/examples/board-example'
import TodoList from '@/todos-example'

export default function Home() {
  return (
    <AppProvider>
      <BoardExample />
      <hr className="my-2"/>
      <TodoList />
    </AppProvider>
  );
}
