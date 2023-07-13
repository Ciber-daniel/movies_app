<template>
  <div class="spinner-container">
    <ProgressSpinner :stroke-width="4" :animation-duration="2000" :color="'#007bff'" />
  </div>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner'
</script>

<style>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
