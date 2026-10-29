import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import CategoriesPage from './components/CategoriesPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: App },
    { path: '/categories', component: CategoriesPage },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

export default router;