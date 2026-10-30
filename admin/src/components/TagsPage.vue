<script setup>
import { ref } from 'vue';
import AdminHeader from './AdminHeader.vue';
import AdminSidebar from './AdminSidebar.vue';
import AdminFooter from './AdminFooter.vue';
</script>

<template>
    <div class="admin-shell">
        <AdminHeader />
        <AdminSidebar />

        <main class="main-content">
            <div class="screen-header">
                <h1>Dhurandhar</h1>
            </div>
            <AdminFooter />
        </main>
    </div>
    ß
</template>