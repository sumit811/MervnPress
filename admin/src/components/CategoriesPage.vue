<script setup>
import { ref } from 'vue';
import AdminFooter from './AdminFooter.vue';
import AdminHeader from './AdminHeader.vue';
import AdminSidebar from './AdminSidebar.vue';

const isSidebarOpen = ref(false);
</script>

<template>
  <div class="admin-shell">
    <AdminHeader @toggle-navigation="isSidebarOpen = !isSidebarOpen" />
    <AdminSidebar :is-open="isSidebarOpen" />

    <main class="main-content">
      <div class="screen-header">
        <h1>Categories</h1>
      </div>
      <p>cat</p>
      <AdminFooter />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin-left: 160px;
  padding: 64px 22px 0 18px;
}

.screen-header {
  min-height: 50px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

h1 {
  margin: 0;
  font-size: 23px;
  line-height: 1.3;
  font-weight: 400;
}

@media (max-width: 900px) {
  .main-content {
    padding-right: 16px;
    padding-left: 14px;
  }
}

@media (max-width: 640px) {
  .main-content {
    margin-left: 0;
    padding: 63px 12px 0;
  }
}
</style>