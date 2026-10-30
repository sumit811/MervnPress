import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import CategoriesPage from './components/CategoriesPage.vue';
import TagsPage from './components/TagsPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: App },
    { path: '/categories', component: CategoriesPage },
    { path: '/tags', component: TagsPage },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

export default router;