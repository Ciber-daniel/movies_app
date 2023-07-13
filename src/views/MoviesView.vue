<template>
  <main class="w-full h-full">
    <div class="container"></div>
    <section
      id="search-section"
      class="search-input flex border-1 justify-content-center align-items-center flex-column col-12"
    >
      <h1>Listado de Películas</h1>
      <div class="flex justify-content-center align-items-center">
        <SelectButton
          id="select-button"
          v-model="fields.select"
          class="p-inputtext-sm p-d-block p-mb-2"
          :options="selectButtonOptions"
          option-label="label"
          option-value="value"
          placeholder="Ordenar por"
        />
      </div>
      <form
        @submit.prevent="searchMovies"
        class="mt-3 flex justify-content-center align-items-center"
      >
        <InputText
          v-if="fields.select === 'QUERY'"
          id="title-input"
          v-model="fields.title"
          class="p-inputtext-sm p-d-block p-mb-2 mr-2"
          size="small"
          placeholder="Título"
        />
        <InputText
          v-else-if="fields.select === 'YEAR'"
          id="year-input"
          v-model="fields.year"
          class="p-inputtext-sm p-d-block p-mb-2 mr-2"
          size="small"
          minlength="4"
          maxlength="4"
          placeholder="Año"
        />
        <Dropdown
          v-else-if="fields.select === 'RATING'"
          id="rating-dropdown"
          v-model="fields.minRating"
          class="p-inputtext-sm p-d-block p-mb-2 mr-2"
          size="small"
          :options="ratingOptions"
          option-label="label"
          option-value="value"
          placeholder="Rating"
        />
        <Button
          id="search-button"
          type="submit"
          class="p-inputtext-sm p-d-block p-mb-2"
          label="Buscar"
        />
      </form>
    </section>
    <div v-if="!isEmpty && !loading">
      <section v-show="!searched && !isEmpty">
        <AppPaginator @go-to-page="setPage" :current-page="pagine" />
      </section>
      <section class="movie-list col-12 mb-5 mt-5">
        <AppCard
          v-for="movie in movies"
          @click="goToMovie(movie.id)"
          :rating="movie.vote_average"
          :title="movie.original_title"
          :year="movie.release_date"
          :image-url="
            movie?.poster_path
              ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
              : 'https://via.placeholder.com/500x750.png?text=No+Image'
          "
        />
      </section>
    </div>
    <div v-else-if="loading" class="w-full flex justify-content-center align-items-center">
      <AppSpinner id="spinner" />
    </div>
    <div v-else>
      <h1 id="notAvalaible">NO RESULTADOS HAY RESULTADOS DISPONIBLES</h1>
    </div>
  </main>
</template>
<script setup>
// components
import InputText from 'primevue/inputtext'
import { onMounted, reactive, ref, watch } from 'vue'
import { useMovieStore } from '../stores/moviesStore'
import Button from 'primevue/button'
import DataView from 'primevue/dataview'
import SelectButton from 'primevue/selectbutton'
import Dropdown from 'primevue/dropdown'
import { storeToRefs } from 'pinia'
import { requestUtil } from '../utils/request.util'
import { computed } from 'vue'
import AppCard from '../components/AppCard.vue'
import AppPaginator from '../components/AppPaginator.vue'
import AppSpinner from '../components/AppSpinner.vue'
import { useRouter } from 'vue-router'
import { selectButtonOptions, ratingOptions } from '../data/mantainers.js'

const moviesStore = useMovieStore()

const backdropImage = ref('')
const mainImage = computed(() => {
  return `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`
})

const router = useRouter()

const layout = ref('grid')
const loading = ref(false)
const pagine = ref(1)
const isEmpty = computed(() => movies.value.length === 0)
const searched = ref(false)

const fields = reactive({
  select: 'QUERY',
  title: '',
  year: '',
  minRating: '',
  maxRating: ''
})

const { movieId, movies } = storeToRefs(moviesStore)

const { getMovies } = moviesStore

watch(
  () => fields.select,
  () => {
    if (fields.select === 'RATING') {
      fields.title = ''
      fields.year = ''
    } else if (!fields.select) {
      fields.select = 'QUERY'
    } else {
      fields.minRating = ''
      fields.maxRating = ''
    }
  }
)

const generateParams = (page, title, year, minRating, maxRating) => {
  const params = Object.fromEntries([
    ...(page !== '' ? [['page', page]] : []),
    ...(title !== '' ? [['query', title]] : []),
    ...(year !== '' ? [['year', year]] : []),
    ...(minRating !== '' ? [['minRating', minRating]] : []),
    ...(minRating !== '' ? [['maxRating', minRating]] : [])
  ])

  return params
}

function handleGetMovies({ page = 1, title = '', year = '', minRating = '', maxRating = '' }) {
  const params = generateParams(page, title, year, minRating, maxRating)

  if (fields.title || fields.year || fields.minRating || fields.maxRating) {
    searched.value = true
  } else {
    searched.value = false
  }

  requestUtil({
    action: getMovies,
    payload: {
      params
    },
    loader: (l) => {
      loading.value = l
    },
    reject: (error) => {
      console.error('error', error)
    },
    resolve: (response) => {
      backdropImage.value = `https://image.tmdb.org/t/p/w500${response[0].backdrop_path}`
    }
  })
}

onMounted(() => {
  handleGetMovies({
    page: 1,
    title: fields.title,
    year: fields.year,
    minRating: fields.minRating,
    maxRating: fields.maxRating
  })
})

function searchMovies() {
  handleGetMovies({
    page: 1,
    title: fields.title,
    year: fields.year,
    minRating: fields.minRating,
    maxRating: fields.maxRating
  })

  pagine.value = 1
}

function setPage(page) {
  pagine.value = page
  handleGetMovies({
    page,
    title: fields.title,
    year: fields.year,
    minRating: fields.minRating,
    maxRating: fields.maxRating
  })
}

function goToMovie(id) {
  movieId.value = id
  router.push({ name: 'movie' })
}
</script>
<style scoped lang="css">
.search-input {
  height: 45vh;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 100vh;
}

.card {
  margin: 2em;
}

.grid-fix {
  justify-content: center !important;
  align-items: center !important;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
}
</style>
