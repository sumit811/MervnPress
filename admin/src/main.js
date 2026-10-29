import { createApp, h } from 'vue';
import { RouterView } from 'vue-router';
import App from './App.vue';
import router from './router';
import './style.scss';

const Root = { render: () => h(RouterView) };

createApp(Root).use(router).mount('#app');