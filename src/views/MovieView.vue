<template>
  <main class="w-full h-full">
    <div class="movie-view">
      <!-- Movie details here -->
      <button class="back-button" @click="goBack">Back</button>
    </div>
    <div
      v-if="!loading"
      class="flex justify-content-center align-items-center movie-main-information"
    >
      <div
        class="container flex flex-column h-full align-items-center justify-content-between col-10"
      >
        <div id="card-container" class="card mt-5">
          <div class="thumbnail">
            <img
              class="left"
              :src="
                movie.backdrop_path
                  ? 'https://image.tmdb.org/t/p/w500' + movie.backdrop_path ?? movie.poster_path
                  : 'https://via.placeholder.com/500x750.png?text=No+Image'
              "
            />
          </div>
          <div class="right">
            <h1 id="movie-title">{{ movie?.original_title }}</h1>
            <div class="author">
              <h2 id="director-name">{{ movie.credits?.director.name }}</h2>
            </div>
            <div class="separator"></div>
            <div class="overview">
              <p id="movie-overview">
                {{ movie.overview }}
              </p>
            </div>
            <Rating
              id="movie-rating"
              :model-value="movie?.vote_average"
              readonly
              :cancel="false"
              :stars="10"
            />
          </div>
          <div class="flex flex-column col-10 p-2">
            <h3 class="m-2">Año: {{ parsedYear }}</h3>
            <div>
              <Chip
                class="chip m-1"
                v-for="(item, index) in movie?.genres"
                :key="item.id"
                :label="item.name"
              />
            </div>
          </div>
        </div>
        <div class="col-12">
          <Carousel
            :value="movie.credits?.crew"
            :numVisible="getCarouselVisibleItems()"
            :numScroll="getCarouselScrollItems()"
            :responsiveOptions="responsiveOptions"
          >
            <template #item="{ data }">
              <AppCard
                :title="data?.name"
                :job="data?.job"
                :image-url="
                  data?.profile_path
                    ? 'https://image.tmdb.org/t/p/w500' + data?.profile_path
                    : 'https://via.placeholder.com/500x750.png?text=No+Image'
                "
              />
            </template>
          </Carousel>
        </div>
      </div>
    </div>
    <div v-else-if="loading" class="w-full flex justify-content-center align-items-center">
      <AppSpinner id="loading-spinner" />
    </div>
  </main>
</template>
<script setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useMovieStore } from '../stores/moviesStore'
import { requestUtil } from '../utils/request.util'
import Rating from 'primevue/rating'
import { useRouter } from 'vue-router'
import Chip from 'primevue/chip'
import Carousel from 'primevue/carousel'
import AppCard from '../components/AppCard.vue'
import AppSpinner from '../components/AppSpinner.vue'

const movieStore = useMovieStore()

const router = useRouter()

const { movieId } = storeToRefs(movieStore)

const { getMovie } = movieStore

let movie = ref({})
const loading = ref(false)

const parsedYear = computed(() => {
  const date = new Date(movie.value?.release_date)
  return date.getFullYear()
})

const responsiveOptions = ref([
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 3
  },
  {
    breakpoint: '991px',
    numVisible: 2,
    numScroll: 2
  },
  {
    breakpoint: '767px',
    numVisible: 1,
    numScroll: 1
  }
])

function goBack() {
  router.go(-1)
}

function getCarouselVisibleItems() {
  const width =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (width >= 1200) {
    return 3
  } else if (width >= 992) {
    return 2
  } else {
    return
  }
}

function getCarouselScrollItems() {
  const width =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (width >= 1200) {
    return 3
  } else if (width >= 992) {
    return 2
  } else {
    return 1
  }
}

onMounted(() => {
  requestUtil({
    action: getMovie,
    payload: {
      id: movieId.value
    },
    loader: (l) => {
      loading.value = l
    },
    resolve: (res) => {
      movie.value = res
    },
    reject: (err) => {
      router.push({ name: 'home' })
    }
  })
})

// Event listener to handle window resize
window.addEventListener('resize', () => {
  responsiveOptions.value[0].numVisible = getCarouselVisibleItems()
  responsiveOptions.value[0].numScroll = getCarouselScrollItems()
})
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto);

body {
  background-color: #353b3f;
  font-family: 'Roboto', sans-serif;
}

.card {
  position: relative;
  width: 90%;
  max-width: 900px;
  margin: 20px auto;
  background-color: #fff;
  box-shadow: 10px 10px 93px 0px rgba(0, 0, 0, 0.75);
}

.thumbnail {
  float: left;
  position: relative;
  left: 30px;
  top: -30px;
  width: 100%;
  padding-top: 56.25%; /* Maintain aspect ratio (9:16) for responsive image */
  overflow: hidden;
  box-shadow: 10px 10px 60px 0px rgba(0, 0, 0, 0.75);
}

.thumbnail img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cast-list {
  display: flex;
  justify-content: space-between;
}

.right {
  margin-left: 10px;
  margin-right: 20px;
}

.overview {
  max-height: 230px;
  overflow: auto;
  scroll-behavior: smooth;
}

h1 {
  padding-top: 15px;
  font-size: 1.3rem;
  color: #4b4b4b;
}

.author {
  background-color: #9ecaff;
  height: 30px;
  width: 110px;
  border-radius: 20px;
}

.author > img {
  padding-top: 5px;
  margin-left: 10px;
  float: left;
  height: 20px;
  width: 20px;
  border-radius: 50%;
}

h2 {
  padding-top: 8px;
  margin-left: 8px;
  text-align: left;
  font-size: 0.8rem;
  color: white;
}

.separator {
  margin-top: 10px;
  border: 1px solid #c3c3c3;
}

p {
  text-align: justify;
  padding-top: 10px;
  font-size: 0.95rem;
  line-height: 150%;
  color: #4b4b4b;
  max-height: 400px;
  overflow: auto;
  scroll-behavior: smooth;
}

h5 {
  position: absolute;
  left: 30px;
  bottom: -120px;
  font-size: 6rem;
  color: #c3c3c3;
}

h6 {
  position: absolute;
  left: 30px;
  bottom: -55px;
  font-size: 2rem;
  color: #c3c3c3;
}

ul {
  margin-left: 250px;
}

li {
  display: inline;
  list-style: none;
  padding-right: 40px;
  color: #7b7b7b;
}

.carousel .p-carousel-content {
  display: flex;
  justify-content: center;
}

.back-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background-color: #0078d4;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>
