import { createApp } from 'vue'
import App from './App.vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'


const app = createApp(App);
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCPZcaizqaGEgr6uhfyRyO2370RJaANg84',
     },
}).mount('#app')