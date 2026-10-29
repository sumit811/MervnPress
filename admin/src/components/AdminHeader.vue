<script setup>
import { ChevronDown, Menu } from '@lucide/vue';

defineEmits(['toggle-navigation']);
</script>

<template>
  <header class="admin-bar">
    <button class="admin-bar__brand" type="button" title="MervnPress home" aria-label="MervnPress home">
      <span class="brand-mark">M</span><span class="brand-name">MervnPress</span>
    </button>
    <button class="admin-bar__mobile-menu icon-button" type="button" aria-label="Toggle navigation" @click="$emit('toggle-navigation')"><Menu :size="17" /></button>
    <div class="admin-bar__tools">
      <span class="admin-bar__site">Site Admin</span>
      <span class="admin-bar__account"><span class="avatar">A</span> admin <ChevronDown :size="14" /></span>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.admin-bar {
  position: fixed;
  z-index: 20;
  inset: 0 0 auto;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 18px;
  color: #f0f0f1;
  background: #1d2327;

  &__brand,
  &__account,
  &__tools {
    display: flex;
    align-items: center;
  }

  &__brand {
    height: 46px;
    gap: 9px;
    padding: 0 14px;
    border: 0;
    color: inherit;
    background: transparent;
  }

  &__tools {
    height: 100%;
    gap: 20px;
  }

  &__site {
    color: #c3c4c7;
  }

  &__account {
    height: 100%;
    gap: 7px;
    padding: 0 7px;
    color: #f0f0f1;
  }

  &__mobile-menu {
    display: none !important;
    color: #f0f0f1 !important;
  }
}

.brand-mark {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border: 1px solid #f0f0f1;
  border-radius: 50%;
  font-family: Georgia, serif;
  font-weight: 700;
}

.brand-name {
  font-weight: 600;
}

.avatar {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #1d2327;
  background: #d7df4b;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .admin-bar {
    padding-right: 8px;

    &__brand {
      padding: 0 10px;
    }

    &__mobile-menu {
      display: inline-grid !important;
    }

    &__site {
      display: none;
    }

    &__tools {
      gap: 4px;
    }
  }
}
</style>