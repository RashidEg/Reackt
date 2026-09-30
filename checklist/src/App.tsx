import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import styles from './App.module.css';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  function addTodo(): void {
    if (text.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: text, done: false }]);
    setText('');
  }

  function removeTodo(id: number): void {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function toggleDone(id: number): void {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  }

  function startEdit(todo: Todo): void {
    setEditId(todo.id);
    setEditText(todo.text);
  }

  function saveEdit(id: number): void {
    if (editText.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditId(null);
  }

  function handleAddKey(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') addTodo();
  }

  return (
    <div className={styles.checklist}>
      <h1>Чеклист</h1>

      <div className={styles.add}>
        <input
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          onKeyDown={handleAddKey}
          placeholder="Новое дело..."
        />
        <button onClick={addTodo}>Добавить</button>
      </div>

      <ul className={styles.list}>
        {todos.map(todo => (
          <li key={todo.id} className={styles.item}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(todo.id)}
            />

            {editId === todo.id ? (
              <>
                <input
                  className={styles.text}
                  value={editText}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    e.key === 'Enter' && saveEdit(todo.id)
                  }
                />
                <button onClick={() => saveEdit(todo.id)}>Сохранить</button>
              </>
            ) : (
              <>
                <span className={`${styles.text} ${todo.done ? styles.done : ''}`}>
                  {todo.text}
                </span>
                <button onClick={() => startEdit(todo)}>Изменить</button>
                <button onClick={() => removeTodo(todo.id)}>Удалить</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;