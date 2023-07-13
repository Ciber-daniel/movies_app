<template>
  <div class="card col-12 md:col-6 lg:col-3 m-2 surface-border surface-card border-round border-1">
    <div class="p-4">
      <div class="flex flex-column align-items-center gap-2 py-5 px-2">
        <img class="image img-resposive shadow-2 border-round" :src="imageUrl" :alt="'imageUrl'" />
        <div class="text-2xl font-bold">{{ title }}</div>
        <Rating
          class="w-full"
          v-show="rating"
          v-model="ratingModel"
          readonly
          :cancel="false"
          :stars="10"
        />
      </div>
      <div class="flex align-items-center justify-content-between">
        <span v-show="year" class="text-2xl font-light">Año: {{ parsedYear }}</span>
        <span v-show="job" class="text-2xl font-light">{{ job }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

// components
import Button from 'primevue/button'
import Rating from 'primevue/rating'

const ratingModel = computed(() => {
  return props.rating
})

const props = defineProps({
  job: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  }
})

const parsedYear = computed(() => {
  return new Date(props.year).getFullYear()
})
</script>
<style scoped>
.card {
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  pointer-events: all;
}

.card:hover {
  transform: scale(1.05);
}

.card img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}

/* Estilos para pantallas pequeñas */
.img-responsive {
  max-width: 100%;
  height: auto;
}

/* Punto de quiebre para pantallas medianas */
@media (min-width: 768px) {
  .img-responsive {
    max-width: 50%;
  }
}

/* Punto de quiebre para pantallas grandes */
@media (min-width: 1024px) {
  .img-responsive {
    max-width: 33.33%;
  }
}

.info:hover {
  background-color: #f2f2f2;
  color: #000;
}
</style>
