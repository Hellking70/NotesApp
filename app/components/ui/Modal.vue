<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ title }}</h3>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('update:modelValue', false)">
            Отмена
          </button>
          <button class="btn btn-primary" @click="$emit('confirm')">
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background: white;
  text-align: center;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
}

.modal-header {
  padding: 16px;
  h2 {
    margin: 0;
    font-size: 18px;
  }
}
.modal-footer {
  padding: 16px;
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.modal-body {
  padding: 0 16px 16px;
  font-size: 15px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  min-width: 100px;
  &.btn-primary {
    background: #007bff;
    color: white;
  }
  &.btn-secondary {
    background: #6c757d;
    color: white;
  }
}

@media (min-width: 576px) {
  .modal {
    max-width: 450px;
  }
  .modal-header h2 {
    font-size: 19px;
  }
  .modal-body {
    font-size: 16px;
  }
  .btn {
    padding: 9px 18px;
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .modal {
    max-width: 500px;
  }
  .modal-header h2 {
    font-size: 20px;
  }
  .btn {
    padding: 10px 20px;
    font-size: 16px;
  }
}

@media (min-width: 990px) {
  .modal {
    max-width: 550px;
  }
  .modal-header h2 {
    font-size: 21px;
  }
}

@media (min-width: 1200px) {
  .modal {
    max-width: 600px;
  }
  .modal-header h2 {
    font-size: 22px;
  }
  .btn {
    padding: 11px 22px;
    font-size: 17px;
  }
}

@media (min-width: 1440px) {
  .modal {
    max-width: 650px;
  }
  .modal-header h2 {
    font-size: 23px;
  }
}

@media (min-width: 1920px) {
  .modal {
    max-width: 700px;
  }
  .modal-header h2 {
    font-size: 24px;
  }
  .btn {
    padding: 12px 24px;
    font-size: 18px;
  }
}
</style>
