<script setup lang="ts">
import NoteCard from "../components/notes/NoteCard.vue";
import Modal from "../components/ui/Modal.vue";
import { useNotesStore } from '../stores/notes'

import {onMounted} from "vue";

const store = useNotesStore()
const { deleteNote, createNote, loadFromLocalStorage } = store

const notes = computed(() => store.notes)
const router = useRouter()

const showDeleteModal = ref(false)
let noteToDelete = ''

function confirmDelete(id: string) {
  noteToDelete = id
  showDeleteModal.value = true
}

function deleteConfirmed() {
  deleteNote(noteToDelete)
  showDeleteModal.value = false
}

onMounted(() => {
  loadFromLocalStorage();
});

function handleCreateNote() {
  const id = createNote()
  router.push(`/note/${id}`)
}
</script>

<template>
  <div class="notes-page">
    <header class="page-header">
      <h1>Мои заметки</h1>
      <button class="btn btn-primary" @click="handleCreateNote">+ Новая заметка</button>
    </header>

    <div v-if="notes.length === 0" class="empty-state">
      Нет заметок
    </div>

    <div v-else class="notes-grid">
      <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @delete="confirmDelete"
      />
    </div>

    <Modal
        v-model="showDeleteModal"
        title="Удалить заметку?"
        @confirm="deleteConfirmed"
    >
      Вы уверены, что хотите удалить эту заметку?
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.notes-page {
  padding: 16px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  margin-bottom: 20px;

  h1 {
    font-size: 22px;
    margin: 0;
    text-align: center;
  }

  .btn-primary {
    align-self: center;
    width: 100%;
    max-width: 240px;
    padding: 10px;
    font-size: 16px;
  }
}

@media (min-width: 576px) {
  .notes-page {
    padding: 20px;
  }
  .page-header h1 {
    font-size: 23px;
  }
  .page-header .btn-primary {
    max-width: 260px;
    padding: 11px;
    font-size: 17px;
  }
}

@media (min-width: 768px) {
  .notes-page {
    padding: 24px;
  }
  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-size: 24px;
      text-align: left;
    }
    .btn-primary {
      align-self: auto;
      width: auto;
      max-width: none;
      padding: 12px 20px;
      font-size: 18px;
    }
  }
}

@media (min-width: 990px) {
  .notes-page {
    padding: 28px;
  }
  .page-header h1 {
    font-size: 25px;
  }
}

@media (min-width: 1200px) {
  .notes-page {
    padding: 32px;
  }
  .page-header h1 {
    font-size: 26px;
  }
}

@media (min-width: 1440px) {
  .notes-page {
    padding: 36px;
  }
  .page-header h1 {
    font-size: 27px;
  }
}

@media (min-width: 1920px) {
  .notes-page {
    padding: 40px;
  }
  .page-header h1 {
    font-size: 28px;
  }
}

.notes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  @media (min-width: 990px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
  @media (min-width: 1440px) {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
  @media (min-width: 1920px) {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  }
}

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 24px;
  font-size: 16px;

  @media (min-width: 576px) {
    font-size: 17px;
    padding: 28px;
  }
  @media (min-width: 768px) {
    font-size: 18px;
    padding: 32px;
  }
  @media (min-width: 990px) {
    font-size: 19px;
  }
  @media (min-width: 1200px) {
    font-size: 20px;
  }
  @media (min-width: 1440px) {
    font-size: 21px;
  }
  @media (min-width: 1920px) {
    font-size: 22px;
  }
}
</style>
