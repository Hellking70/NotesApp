<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Note } from '../../stores/notes'
import Modal from '../../components/ui/Modal.vue'

const route = useRoute()
const router = useRouter()
const store = useNotesStore()

const id = route.params.id as string

const originalNote = computed(() => store.notes.find(n => n.id === id))
if (!originalNote.value) {
  router.push('/')
}

const isNewNote = ref(false)


const localNote = ref<Note>(JSON.parse(JSON.stringify(originalNote.value)))

const localHistory = ref<Note[]>([])
const localHistoryIndex = ref(-1)

function saveLocalSnapshot() {
  if (localHistoryIndex.value < localHistory.value.length - 1) {
    localHistory.value = localHistory.value.slice(0, localHistoryIndex.value + 1)
  }
  localHistory.value.push(JSON.parse(JSON.stringify(localNote.value)))
  localHistoryIndex.value = localHistory.value.length - 1
}

onMounted(() => {
  const note = originalNote.value
  if (note) {
    isNewNote.value = !!note.isCreatedInSession
  }

  saveLocalSnapshot()
})

function localUndo() {
  if (localHistoryIndex.value > 0) {
    localHistoryIndex.value--
    localNote.value = JSON.parse(JSON.stringify(localHistory.value[localHistoryIndex.value]))
  }
}

function localRedo() {
  if (localHistoryIndex.value < localHistory.value.length - 1) {
    localHistoryIndex.value++
    localNote.value = JSON.parse(JSON.stringify(localHistory.value[localHistoryIndex.value]))
  }
}

function addTodo() {
  localNote.value.todos.push({
    id: crypto.randomUUID(),
    text: '',
    completed: false,
  })
  saveLocalSnapshot()
}

function removeTodo(todoId: string) {
  localNote.value.todos = localNote.value.todos.filter(t => t.id !== todoId)
  saveLocalSnapshot()
}

function updateTodoText(todoId: string, text: string) {
  const todo = localNote.value.todos.find(t => t.id === todoId)
  if (todo) {
    todo.text = text
  }
}

function toggleCompleted(todoId: string, completed: boolean) {
  const todo = localNote.value.todos.find(t => t.id === todoId)
  if (todo) {
    todo.completed = completed
    saveLocalSnapshot()
  }
}

function save() {
  store.updateNote(id, localNote.value)
  router.push('/')
}

const showCancelModal = ref(false)
const cancelModalTitle = ref('')
const cancelModalMessage = ref('')

function cancel() {
  const isUnchanged = JSON.stringify(localNote.value) === JSON.stringify(originalNote.value)

  if (isNewNote.value && isUnchanged) {
    cancelModalTitle.value = 'Удалить новую заметку?'
    cancelModalMessage.value = 'Заметка была создана, но не изменена. Удалить её?'
  } else if (!isUnchanged) {
    cancelModalTitle.value = 'Отменить изменения?'
    cancelModalMessage.value = 'Все несохранённые изменения будут потеряны.'
  } else {
    router.back()
    return
  }

  showCancelModal.value = true
}

function goBack() {
  showCancelModal.value = false
  if (isNewNote.value && JSON.stringify(localNote.value) === JSON.stringify(originalNote.value)) {
    store.deleteNote(id)
  }
  router.back()
}

const showDeleteModal = ref(false)
function confirmDelete() {
  showDeleteModal.value = true
}
function deleteConfirmed() {
  store.deleteNote(id)
  showDeleteModal.value = false
  router.push('/')
}

function handleKeyDown(e: KeyboardEvent) {
  const isCtrl = e.ctrlKey || e.metaKey
  if (!isCtrl || e.key.toLowerCase() !== 'z') return

  const target = e.target
  if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
  ) {
    return
  }

  e.preventDefault()
  if (e.shiftKey) {
    localRedo()
  } else {
    localUndo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="edit-page">
    <header class="page-header">
      <NuxtLink to="/" class="btn">← Назад</NuxtLink>
      <h1>Редактирование заметки</h1>
    </header>

    <form @submit.prevent="save">
      <input
          v-model="localNote.title"
          type="text"
          placeholder="Название заметки"
          class="title-input"
          @blur="saveLocalSnapshot"
          @keydown.enter="saveLocalSnapshot"
      />

      <div class="todos">
        <div v-for="todo in localNote.todos" :key="todo.id" class="todo-item">
          <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleCompleted(todo.id, !todo.completed)"
          />
          <input
              :value="todo.text"
              type="text"
              @input="updateTodoText(todo.id, ($event.target as HTMLInputElement).value)"
              @blur="saveLocalSnapshot"
              @keydown.enter="saveLocalSnapshot"
              class="todo-text"
              placeholder="Текст задачи..."
          />
          <button type="button" class="btn-remove" @click="removeTodo(todo.id)">×</button>
        </div>
        <button type="button" class="btn-add" @click="addTodo">+ Добавить задачу</button>
      </div>

      <div class="actions">
        <button type="button" class="btn btn-undo" @click="localUndo">↩ Отменить</button>
        <button type="button" class="btn btn-redo" @click="localRedo">↪ Повторить</button>
        <button type="submit" class="btn btn-save">Сохранить</button>
        <button type="button" class="btn btn-cancel" @click="cancel">Отменить</button>
        <button type="button" class="btn btn-delete" @click="confirmDelete">Удалить</button>
      </div>
    </form>

    <Modal
        v-model="showCancelModal"
        :title="cancelModalTitle"
        @confirm="goBack"
    >
      {{ cancelModalMessage }}
    </Modal>

    <Modal
        v-model="showDeleteModal"
        title="Удалить заметку?"
        @confirm="deleteConfirmed"
    >
      Это действие нельзя отменить.
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.edit-page {
  padding: 16px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 20px;

  h1 {
    font-size: 20px;
    margin: 0;
  }

  .btn {
    align-self: flex-start;
  }
}

@media (min-width: 576px) {
  .edit-page {
    padding: 20px;
  }
  .page-header h1 {
    font-size: 21px;
  }
}

@media (min-width: 768px) {
  .edit-page {
    padding: 24px;
  }
  .page-header {
    flex-direction: row;
    align-items: center;
    h1 {
      font-size: 22px;
    }
  }
}

@media (min-width: 990px) {
  .edit-page {
    padding: 28px;
  }
  .page-header h1 {
    font-size: 23px;
  }
}

@media (min-width: 1200px) {
  .edit-page {
    padding: 32px;
  }
  .page-header h1 {
    font-size: 24px;
  }
}

@media (min-width: 1440px) {
  .edit-page {
    padding: 36px;
  }
  .page-header h1 {
    font-size: 25px;
  }
}

@media (min-width: 1920px) {
  .edit-page {
    padding: 40px;
  }
  .page-header h1 {
    font-size: 26px;
  }
}

.title-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  @media (min-width: 576px) {
    font-size: 17px;
    padding: 11px;
    margin-bottom: 18px;
  }
  @media (min-width: 768px) {
    font-size: 18px;
    padding: 12px;
    margin-bottom: 20px;
  }
  @media (min-width: 990px) {
    font-size: 19px;
    padding: 13px;
  }
  @media (min-width: 1200px) {
    font-size: 20px;
    padding: 14px;
  }
  @media (min-width: 1440px) {
    font-size: 21px;
    padding: 15px;
  }
  @media (min-width: 1920px) {
    font-size: 22px;
    padding: 16px;
  }
}

.todos {
  margin-bottom: 20px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;

  input[type="checkbox"] {
    flex-shrink: 0;
  }

  .todo-text {
    font-size: 16px;
  }
}

.todo-text {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 0;

  @media (min-width: 576px) {
    font-size: 17px;
    padding: 7px;
  }
  @media (min-width: 768px) {
    font-size: 18px;
    padding: 8px;
  }
  @media (min-width: 990px) {
    font-size: 19px;
    padding: 9px;
  }
  @media (min-width: 1200px) {
    font-size: 20px;
    padding: 10px;
  }
  @media (min-width: 1440px) {
    font-size: 21px;
    padding: 11px;
  }
  @media (min-width: 1920px) {
    font-size: 22px;
    padding: 12px;
  }
}

.btn-remove {
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;

  @media (min-width: 576px) {
    width: 26px;
    height: 26px;
  }
  @media (min-width: 768px) {
    width: 28px;
    height: 28px;
  }
}

.btn-add {
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  font-size: 14px;
  align-self: flex-start;

  @media (min-width: 576px) {
    padding: 7px 14px;
    font-size: 15px;
  }
  @media (min-width: 768px) {
    padding: 8px 16px;
    font-size: 16px;
  }
  @media (min-width: 990px) {
    padding: 9px 18px;
    font-size: 17px;
  }
  @media (min-width: 1200px) {
    padding: 10px 20px;
    font-size: 18px;
  }
  @media (min-width: 1440px) {
    padding: 11px 22px;
    font-size: 19px;
  }
  @media (min-width: 1920px) {
    padding: 12px 24px;
    font-size: 20px;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;

  .btn {
    padding: 10px;
    font-size: 15px;
    width: 100%;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    color: #000;

    &.btn-undo   { background: #ffc107; color: #000; }
    &.btn-redo   { background: #17a2b8; color: white; }
    &.btn-save   { background: #28a745; color: white; }
    &.btn-cancel { background: #6c757d; color: white; }
    &.btn-delete { background: #dc3545; color: white; }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    .btn {
      padding: 8px 12px;
      font-size: 14px;
      width: auto;
    }
  }

  @media (min-width: 990px) {
    .btn {
      padding: 9px 14px;
      font-size: 15px;
    }
  }
  @media (min-width: 1200px) {
    .btn {
      padding: 10px 16px;
      font-size: 16px;
    }
  }
  @media (min-width: 1440px) {
    .btn {
      padding: 11px 18px;
      font-size: 17px;
    }
  }
  @media (min-width: 1920px) {
    .btn {
      padding: 12px 20px;
      font-size: 18px;
    }
  }
}
</style>
