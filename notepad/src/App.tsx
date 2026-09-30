import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import styled from 'styled-components';

interface Note {
  id: number;
  text: string;
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  font-family: sans-serif;
`;

const Sidebar = styled.aside`
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  box-sizing: border-box;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NoteItem = styled.li<{ $active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  background: ${props => (props.$active ? '#dde8ff' : 'transparent')};

  &:hover {
    background: ${props => (props.$active ? '#dde8ff' : '#f0f0f0')};
  }
`;

const Editor = styled.main`
  flex: 1;
  padding: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 95%;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
`;

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');

  const activeNote: Note | undefined = notes.find(note => note.id === activeId);

  function addNote(): void {
    const note: Note = { id: Date.now(), text: '' };
    setNotes([note, ...notes]);
    setActiveId(note.id);
  }

  function changeText(text: string): void {
    setNotes(notes.map(note =>
      note.id === activeId ? { ...note, text: text } : note
    ));
  }

  function removeNote(e: MouseEvent<HTMLButtonElement>, id: number): void {
    e.stopPropagation();
    setNotes(notes.filter(note => note.id !== id));
    if (id === activeId) setActiveId(null);
  }

  function getTitle(note: Note): string {
    const title = note.text.trim().split('\n')[0];
    return title === '' ? 'Новая запись' : title.slice(0, 25);
  }

  const filteredNotes: Note[] = notes.filter(note =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Wrapper>
      <Sidebar>
        <AddButton onClick={addNote}>+ Новая запись</AddButton>
        <SearchInput
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Поиск..."
        />
        <List>
          {filteredNotes.map(note => (
            <NoteItem
              key={note.id}
              $active={note.id === activeId}
              onClick={() => setActiveId(note.id)}
            >
              <span>{getTitle(note)}</span>
              <button onClick={e => removeNote(e, note.id)}>✕</button>
            </NoteItem>
          ))}
        </List>
      </Sidebar>

      <Editor>
        {activeNote ? (
          <TextArea
            value={activeNote.text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => changeText(e.target.value)}
            placeholder="Введите текст..."
          />
        ) : (
          <p>Выберите запись или создайте новую</p>
        )}
      </Editor>
    </Wrapper>
  );
}

export default App;