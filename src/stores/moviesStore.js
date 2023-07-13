import api from '../config/api'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const moviesStore = () => {
  const movies = ref([])
  const movieId = ref('')

  async function getMovies({ params }) {
    try {
      const { data } = await api.get('/movies', { params })
      if (data.length < 0) {
        return Promise.resolve([])
      }

      movies.value = data

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getMovie(payload) {
    const { id } = payload

    try {
      const { data } = await api.get(`movies/${id}`)

      if (data.status === 404) {
        return new Error('Movie not found')
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    movies,
    movieId,
    getMovies,
    getMovie
  }
}

export const useMovieStore = defineStore('moviesStore', moviesStore, { persist: true })
