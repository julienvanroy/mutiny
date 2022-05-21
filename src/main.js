import "./scss/global/index.scss";
import { createApp } from "vue";
import { createI18n } from 'vue-i18n'
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import './registerServiceWorker'
import en from './i18n/en.json'
import fr from './i18n/fr.json'

const lang = navigator.language.substring(0, 2);

const i18n = createI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages: {
        en: en,
        fr: fr
    }
})

const app = createApp(App);
app.use(i18n)
app.use(router);
app.use(createPinia());
app.mount("#app");
