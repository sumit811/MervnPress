<script setup>
import { ChevronDown } from '@lucide/vue';
import Navigation from './Navigation.vue';

defineProps({ isOpen: { type: Boolean, default: false } });
defineEmits(['open-editor']);
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--open': isOpen }">
    <Navigation @open-editor="$emit('open-editor')" />
    <button class="sidebar-collapse" type="button" aria-label="Collapse menu"><ChevronDown :size="15" /><span>Collapse menu</span></button>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  z-index: 10;
  top: 46px;
  bottom: 0;
  left: 0;
  width: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 8px;
  overflow-y: auto;
  color: #c3c4c7;
  background: var(--sidebar);

  &-collapse {
    min-height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 11px;
    border: 0;
    color: #c3c4c7;
    background: transparent;
    text-align: left;

    svg {
      transform: rotate(90deg);
    }
  }

  &--open {
    transform: translateX(0);
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 180px;
    transform: translateX(-100%);
    transition: transform .18s ease;
    box-shadow: 4px 4px 14px #0002;

    &--open {
      transform: translateX(0);
    }
  }
}
</style>