import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export interface TodoItem {
    id: string
    text: string
    completed: boolean
}

export interface Note {
    id: string
    title: string
    todos: TodoItem[]
    isCreatedInSession?: boolean
}

export interface Snapshot {
    notes: Note[]
    timestamp: number
}

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<Note[]>([])

    const history = ref<Snapshot[]>([])
    const historyIndex = ref(-1)

    function loadFromLocalStorage() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('notes')
            if (saved) {
                const parsedNotes = JSON.parse(saved)
                notes.value.splice(0, notes.value.length, ...parsedNotes)
                saveSnapshot()
            } else {
                notes.value = [
                    {
                        id: uuidv4(),
                        title: 'Добро пожаловать!',
                        todos: [
                            { id: uuidv4(), text: 'Отметьте этот пункт', completed: false },
                            { id: uuidv4(), text: 'Создайте свою заметку', completed: false },
                        ],
                    },
                ]
                saveSnapshot()
            }
        }
    }

    function saveSnapshot() {
        if (historyIndex.value < history.value.length - 1) {
            history.value = history.value.slice(0, historyIndex.value + 1)
        }

        history.value.push({
            notes: JSON.parse(JSON.stringify(notes.value)),
            timestamp: Date.now(),
        })
        historyIndex.value = history.value.length - 1

        localStorage.setItem('notes', JSON.stringify(notes.value))
    }

    function undo() {
        if (historyIndex.value > 0) {
            historyIndex.value--
            const snapshot = history.value[historyIndex.value]
            if (snapshot) {
                notes.value = JSON.parse(JSON.stringify(snapshot.notes))
                localStorage.setItem('notes', JSON.stringify(notes.value))
            }
        }
    }

    function redo() {
        if (historyIndex.value < history.value.length - 1) {
            historyIndex.value++
            const snapshot = history.value[historyIndex.value]
            if (snapshot) {
                notes.value = JSON.parse(JSON.stringify(snapshot.notes))
                localStorage.setItem('notes', JSON.stringify(notes.value))
            }
        }
    }

    function createNote() {
        const newNote: Note = {
            id: uuidv4(),
            title: 'Новая заметка',
            todos: [{ id: uuidv4(), text: 'Новый пункт', completed: false }],
            isCreatedInSession: true,
        }
        notes.value.push(newNote)
        saveSnapshot()
        return newNote.id
    }

    function updateNote(id: string, payload: Partial<Note>) {
        const note = notes.value.find(n => n.id === id)
        if (note) {
            Object.assign(note, payload)
            saveSnapshot()
        }
    }

    function deleteNote(id: string) {
        notes.value = notes.value.filter(n => n.id !== id)
        saveSnapshot()
    }

    function addTodo(noteId: string) {
        const note = notes.value.find(n => n.id === noteId)
        if (note) {
            note.todos.push({ id: uuidv4(), text: 'Новый пункт', completed: false })
            saveSnapshot()
        }
    }

    function updateTodo(noteId: string, todoId: string, payload: Partial<TodoItem>) {
        const note = notes.value.find(n => n.id === noteId)
        if (note) {
            const todo = note.todos.find(t => t.id === todoId)
            if (todo) {
                Object.assign(todo, payload)
                saveSnapshot()
            }
        }
    }

    function deleteTodo(noteId: string, todoId: string) {
        const note = notes.value.find(n => n.id === noteId)
        if (note) {
            note.todos = note.todos.filter(t => t.id !== todoId)
            saveSnapshot()
        }
    }

    return {
        notes,
        loadFromLocalStorage,
        undo,
        redo,
        createNote,
        updateNote,
        deleteNote,
        saveSnapshot,
        addTodo,
        updateTodo,
        deleteTodo,
    }
})
