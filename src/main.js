import PrimeVue from 'primevue/config'
import 'primeflex/primeflex.css'
import 'primevue/resources/themes/mdc-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, { ripple: true })
app.use(createPinia())
app.use(router)

app.mount('#app')
