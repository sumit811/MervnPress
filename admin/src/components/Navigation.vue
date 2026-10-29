<script setup>
import { useRoute } from 'vue-router';
import {
  FileText,
  Image,
  LayoutDashboard,
  MessageSquare,
  Palette,
  Settings,
  Users,
  Wrench
} from '@lucide/vue';

const route = useRoute();

defineEmits(['open-editor']);
</script>

<template>
  <nav aria-label="Main navigation">
    <a class="sidebar-link" href="#dashboard"><LayoutDashboard :size="17" /><span>Dashboard</span></a>
    <RouterLink class="sidebar-link" :class="{ 'sidebar-link--active': route.path === '/' }" to="/"><FileText :size="17" /><span>Posts</span></RouterLink>
    <div class="sidebar-subnav">
      <RouterLink :class="{ 'sidebar-subnav__active': route.path === '/' }" to="/">All Posts</RouterLink>
      <button type="button" @click="$emit('open-editor')">Add New</button>
      <RouterLink :class="{ 'sidebar-subnav__active': route.path === '/categories' }" to="/categories">Categories</RouterLink>
      <a href="#tags">Tags</a>
    </div>
    <a class="sidebar-link" href="#media"><Image :size="17" /><span>Media</span></a>
    <a class="sidebar-link" href="#pages"><FileText :size="17" /><span>Pages</span></a>
    <a class="sidebar-link" href="#comments"><MessageSquare :size="17" /><span>Comments</span></a>
    <a class="sidebar-link" href="#appearance"><Palette :size="17" /><span>Appearance</span></a>
    <a class="sidebar-link" href="#plugins"><Wrench :size="17" /><span>Plugins</span></a>
    <a class="sidebar-link" href="#users"><Users :size="17" /><span>Users</span></a>
    <a class="sidebar-link" href="#tools"><Wrench :size="17" /><span>Tools</span></a>
    <a class="sidebar-link" href="#settings"><Settings :size="17" /><span>Settings</span></a>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  display: flex;
  flex-direction: column;
}

.sidebar-link {
  position: relative;
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 10px;
  color: #f0f0f1;

  &:hover {
    color: #72aee6;
    background: #2c3338;
  }

  &--active {
    color: white;
    background: #2271b1;
    font-weight: 600;

    &:hover {
      color: white;
      background: #135e96;
    }
  }
}

.sidebar-subnav {
  display: flex;
  flex-direction: column;
  padding: 7px 0 10px 35px;
  background: #1d2327;

  a,
  button {
    width: fit-content;
    padding: 5px 0;
    border: 0;
    color: #c3c4c7;
    background: transparent;
    text-align: left;
  }

  a:hover,
  button:hover,
  &__active {
    color: #72aee6 !important;
  }
}
</style>