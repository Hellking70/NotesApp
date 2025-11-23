<script setup lang="ts">
import type {Note} from "../../stores/notes";

defineProps<{
  note: Note
}>()

defineEmits<{
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="note-card">
    <h3>{{ note.title || 'Без названия' }}</h3>
    <ul class="todo-preview">
      <li v-for="todo in note.todos.slice(0, 3)" :key="todo.id">
        <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
      </li>
      <li v-if="note.todos.length > 3" class="more">+{{ note.todos.length - 3 }} ещё...</li>
    </ul>
    <div class="card-actions">
      <NuxtLink :to="`/note/${note.id}`" class="btn btn-sm">Редактировать</NuxtLink>
      <button class="btn btn-sm btn-danger" @click="$emit('delete', note.id)">Удалить</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.note-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;

  h3 {
    margin: 0 0 12px;
    font-size: 18px;
    word-break: break-word;
  }
}

.todo-preview {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  li {
    padding: 4px 0;
    font-size: 14px;
    word-break: break-word;
    &.more {
      color: #666;
    }
  }
  .completed {
    text-decoration: line-through;
    color: #888;
  }
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: space-between;

  .btn {
    padding: 6px 10px;
    font-size: 14px;
  }
}

@media (min-width: 576px) {
  .note-card {
    padding: 18px;
  }
  h3 {
    font-size: 19px;
  }
  .todo-preview li {
    font-size: 15px;
  }
  .card-actions .btn {
    padding: 7px 12px;
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .note-card {
    padding: 20px;
  }
  h3 {
    font-size: 20px;
  }
  .todo-preview li {
    font-size: 16px;
  }
  .card-actions .btn {
    padding: 8px 14px;
    font-size: 16px;
  }
}

@media (min-width: 990px) {
  .note-card {
    padding: 22px;
  }
  h3 {
    font-size: 21px;
  }
}

@media (min-width: 1200px) {
  .note-card {
    padding: 24px;
  }
  h3 {
    font-size: 22px;
  }
}

@media (min-width: 1440px) {
  .note-card {
    padding: 26px;
  }
  h3 {
    font-size: 23px;
  }
}

@media (min-width: 1920px) {
  .note-card {
    padding: 28px;
  }
  h3 {
    font-size: 24px;
  }
}
</style>
