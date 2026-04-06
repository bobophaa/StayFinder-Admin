import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/style.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

//toast
// import 'vue-toast-notification/dist/theme-sugar.css';

import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
