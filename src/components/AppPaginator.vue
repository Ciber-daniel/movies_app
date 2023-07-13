<template>
  <div class="pagination">
    <Button
      icon="pi pi-search"
      rounded
      aria-label="Search"
      class="m-1 mt-4"
      v-for="page in totalPages"
      :key="page"
      @click="goToPage(page)"
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </Button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import Button from 'primevue/button'

defineProps({
  totalPages: {
    type: Number,
    default: 5
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['goToPage'])

const goToPage = (page) => {
  emit('goToPage', page)
}
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
}

button.active {
  background-color: #f2f2f2;
}

button {
  padding: 8px;
  margin-right: 4px;
  border: none;
  background-color: #ccc;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.active {
  background-color: #f2f2f2;
  color: #000;
}
</style>
