<script setup>
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  CircleHelp,
  Pencil,
  Plus,
  Search,
  Trash2
} from '@lucide/vue';

defineProps({
  posts: { type: Array, required: true },
  statusTabs: { type: Array, required: true },
  activeStatus: { type: String, required: true },
  searchInput: { type: String, required: true },
  selectedIds: { type: Array, required: true },
  allVisibleSelected: { type: Boolean, required: true },
  bulkAction: { type: String, required: true },
  sortDirection: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
  loadError: { type: String, required: true }
});

defineEmits([
  'add-post', 'edit-post', 'change-status', 'trash-post', 'apply-bulk-action',
  'retry', 'select-status', 'update-search', 'submit-search', 'toggle-all',
  'toggle-selected', 'update-bulk-action', 'toggle-sort'
]);

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function statusLabel(status) {
  return status === 'publish' ? 'Published' : status === 'draft' ? 'Draft' : 'Trash';
}
</script>

<template>
  <div class="screen-header">
    <div class="screen-header__title"><h1>Posts</h1><button class="button button--primary-outline" type="button" @click="$emit('add-post')"><Plus :size="15" /> Add Post</button></div>
    <div class="screen-header__utility"><button type="button"><ChevronDown :size="14" /> Screen Options</button><button type="button"><CircleHelp :size="14" /> Help</button></div>
  </div>

  <div class="list-toolbar">
    <div class="status-tabs" aria-label="Filter by post status">
      <template v-for="(tab, index) in statusTabs" :key="tab.key">
        <span v-if="index" class="status-tabs__separator">|</span>
        <button type="button" :class="{ 'status-tabs__active': activeStatus === tab.key }" @click="$emit('select-status', tab.key)">{{ tab.label }} <span>({{ tab.count }})</span></button>
      </template>
    </div>
    <form class="search-form" @submit.prevent="$emit('submit-search')">
      <label class="visually-hidden" for="post-search">Search posts</label>
      <input id="post-search" type="search" :value="searchInput" @input="$emit('update-search', $event.target.value)" />
      <button class="button button--primary-outline" type="submit"><Search :size="15" /><span>Search Posts</span></button>
    </form>
  </div>

  <div class="filter-toolbar">
    <div class="filter-toolbar__actions">
      <label class="visually-hidden" for="bulk-action">Bulk actions</label>
      <select id="bulk-action" :value="bulkAction" @change="$emit('update-bulk-action', $event.target.value)">
        <option value="">Bulk actions</option><option value="publish">Publish</option><option value="draft">Move to draft</option><option value="trash">Move to trash</option>
      </select>
      <button class="button button--primary-outline" type="button" :disabled="!bulkAction || selectedIds.length === 0" @click="$emit('apply-bulk-action')">Apply</button>
    </div>
    <div class="filter-toolbar__filters">
      <label class="visually-hidden" for="date-filter">Filter by date</label><select id="date-filter" disabled><option>All dates</option></select>
      <label class="visually-hidden" for="category-filter">Filter by category</label><select id="category-filter" disabled><option>All Categories</option></select>
      <button class="button button--primary-outline" type="button" disabled>Filter</button>
    </div>
    <span class="result-count">{{ posts.length }} item{{ posts.length === 1 ? '' : 's' }}</span>
  </div>

  <div class="posts-table-wrap">
    <table class="posts-table">
      <thead><tr>
        <th class="check-column"><input type="checkbox" aria-label="Select all posts" :checked="allVisibleSelected" @change="$emit('toggle-all')" /></th>
        <th class="title-column"><button class="sort-button sort-button--active" type="button" @click="$emit('toggle-sort')">Title <ArrowDown v-if="sortDirection === 'desc'" :size="13" /><ArrowUp v-else :size="13" /></button></th>
        <th>Author</th><th>Categories</th><th>Date</th>
      </tr></thead>
      <tbody>
        <tr v-if="isLoading"><td colspan="5" class="table-message">Loading posts…</td></tr>
        <tr v-else-if="loadError"><td colspan="5" class="table-message table-message--error"><span>{{ loadError }}</span><button class="button button--primary-outline" type="button" @click="$emit('retry')">Retry</button></td></tr>
        <tr v-else-if="posts.length === 0"><td colspan="5" class="table-message">No posts found.</td></tr>
        <template v-else>
          <tr v-for="post in posts" :key="post._id" class="post-row" :class="{ 'post-row--selected': selectedIds.includes(post._id) }">
            <td class="check-column"><input type="checkbox" :aria-label="`Select ${post.title}`" :checked="selectedIds.includes(post._id)" @change="$emit('toggle-selected', post._id)" /></td>
            <td class="title-column">
              <div class="post-title-line"><button class="post-title" type="button" @click="$emit('edit-post', post)">{{ post.title }}</button><span v-if="post.status !== 'publish'" class="status-badge" :class="`status-badge--${post.status}`">{{ statusLabel(post.status) }}</span></div>
              <div class="row-actions">
                <button type="button" @click="$emit('edit-post', post)"><Pencil :size="13" /> Edit</button><span>|</span>
                <button type="button" @click="$emit('change-status', post, post.status === 'publish' ? 'draft' : 'publish')">{{ post.status === 'publish' ? 'Unpublish' : 'Publish' }}</button><span>|</span>
                <button class="row-actions__delete" type="button" @click="$emit('trash-post', post)"><Trash2 :size="13" /> Trash</button>
              </div>
            </td>
            <td><a href="#author">admin</a></td><td><a href="#category">{{ post.category || 'Uncategorized' }}</a></td><td><span class="date-status">{{ statusLabel(post.status) }}</span><br />{{ formatDate(post.createdAt) }}</td>
          </tr>
        </template>
      </tbody>
      <tfoot><tr>
        <th class="check-column"><input type="checkbox" aria-label="Select all posts" :checked="allVisibleSelected" @change="$emit('toggle-all')" /></th>
        <th><button class="sort-button sort-button--active" type="button" @click="$emit('toggle-sort')">Title <ArrowDown v-if="sortDirection === 'desc'" :size="13" /><ArrowUp v-else :size="13" /></button></th>
        <th>Author</th><th>Categories</th><th>Date</th>
      </tr></tfoot>
    </table>
  </div>

  <div class="bottom-toolbar">
    <div class="filter-toolbar__actions">
      <label class="visually-hidden" for="bulk-action-bottom">Bulk actions</label>
      <select id="bulk-action-bottom" :value="bulkAction" @change="$emit('update-bulk-action', $event.target.value)"><option value="">Bulk actions</option><option value="publish">Publish</option><option value="draft">Move to draft</option><option value="trash">Move to trash</option></select>
      <button class="button button--primary-outline" type="button" :disabled="!bulkAction || selectedIds.length === 0" @click="$emit('apply-bulk-action')">Apply</button>
    </div>
    <span class="result-count">{{ posts.length }} item{{ posts.length === 1 ? '' : 's' }}</span>
  </div>
</template>

<style lang="scss" scoped>
.screen-header {
  min-height: 50px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  &__title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__utility {
    display: flex;
    gap: 7px;
    margin-top: -1px;

    button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 9px;
      border: 1px solid #c3c4c7;
      border-top: 0;
      border-radius: 0 0 3px 3px;
      color: #50575e;
      background: #f6f7f7;
    }
  }
}

h1 {
  margin: 0;
  font-size: 23px;
  line-height: 1.3;
  font-weight: 400;
}

.list-toolbar,
.filter-toolbar,
.bottom-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-toolbar {
  min-height: 39px;
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8c8f94;

  button {
    padding: 0;
    border: 0;
    color: var(--wp-blue);
    background: transparent;

    &:hover {
      color: #1d2327 !important;
    }

    span {
      color: var(--wp-muted);
      font-weight: 400;
    }
  }

  &__active {
    color: #1d2327 !important;
    font-weight: 600;
  }
}

.search-form {
  display: flex;
  align-items: center;
  gap: 7px;

  input {
    width: 210px;
    height: 30px;
    padding: 3px 7px;
    border: 1px solid #8c8f94;
    border-radius: 2px;
    background: white;
  }

  .button {
    min-height: 30px;
  }
}

.filter-toolbar,
.bottom-toolbar {
  gap: 14px;
  min-height: 42px;

  select {
    height: 30px;
    padding: 3px 27px 3px 8px;
    border: 1px solid #8c8f94;
    border-radius: 2px;
    color: #2c3338;
    background: #fff;
  }
}

.filter-toolbar {
  &__actions,
  &__filters {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__actions select {
    width: 100px;
  }

  &__filters select {
    min-width: 110px;
  }
}

.bottom-toolbar select {
  width: 100px;
}

.result-count {
  margin-left: auto;
  color: #646970;
  white-space: nowrap;
}

.posts-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.posts-table {
  width: 100%;
  border-spacing: 0;
  border: 1px solid #c3c4c7;
  background: #fff;
  text-align: left;

  th,
  td {
    padding: 9px 10px;
    border-bottom: 1px solid #c3c4c7;
    vertical-align: middle;
  }

  thead th,
  tfoot th {
    height: 31px;
    padding-top: 6px;
    padding-bottom: 6px;
    font-weight: 400;
  }

  tfoot th {
    border-bottom: 0;
  }

  th:first-child,
  td:first-child {
    padding-left: 8px;
  }

  tbody tr:nth-child(odd) {
    background: #f6f7f7;
  }

  tbody tr:hover {
    background: #f0f6fc;
  }

  .check-column {
    width: 34px;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    vertical-align: middle;
    accent-color: var(--wp-blue);
  }

  th:not(.check-column):not(.title-column) {
    width: 15%;
  }
}

.title-column {
  min-width: 230px;
  width: 38%;
}

.sort-button {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0;
  border: 0;
  color: #50575e;
  background: transparent;
  font-weight: 400;

  &--active {
    color: var(--wp-blue);
  }
}

.post-title {
  padding: 0;
  border: 0;
  color: var(--wp-blue);
  background: transparent;
  font-weight: 600;
  text-align: left;

  &:hover {
    color: var(--wp-blue-dark);
  }
}

.post-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  padding: 2px 6px;
  border: 1px solid #c3c4c7;
  border-radius: 2px;
  color: #50575e;
  background: #f6f7f7;
  font-size: 11px;

  &--trash {
    color: #b32d2e;
    background: #fcf0f1;
  }
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  color: #c3c4c7;
  font-size: 12px;
  opacity: 0;
  transition: opacity .12s ease;

  .post-row:hover &,
  .post-row:focus-within & {
    opacity: 1;
  }

  button {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 0;
    border: 0;
    color: var(--wp-blue);
    background: transparent;

    &:hover {
      color: var(--wp-blue-dark);
    }
  }

  .row-actions__delete {
    color: #b32d2e;
  }
}

.date-status {
  color: #646970;
}

.table-message {
  height: 64px;
  color: #646970;
  text-align: center;

  &--error {
    display: table-cell;
    color: #b32d2e;

    span {
      margin-right: 10px;
    }
  }
}

.bottom-toolbar {
  min-height: 48px;
  align-items: flex-start;
  padding-top: 6px;
}

@media (max-width: 900px) {
  .filter-toolbar {
    flex-wrap: wrap;
    padding: 6px 0;

    &__filters {
      order: 2;
    }
  }

  .result-count {
    order: 3;
  }

  .title-column {
    min-width: 210px;
  }

  .posts-table th:not(.check-column):not(.title-column) {
    min-width: 100px;
  }
}

@media (max-width: 640px) {
  .screen-header {
    min-height: 48px;

    &__utility {
      display: none;
    }
  }

  h1 {
    font-size: 21px;
  }

  .list-toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 4px 0 8px;
  }

  .search-form {
    width: 100%;

    input {
      flex: 1;
      min-width: 80px;
    }

    .button {
      flex-shrink: 0;
    }
  }

  .filter-toolbar {
    align-items: flex-start;

    &__filters {
      width: 100%;
      flex-wrap: wrap;

      select {
        flex: 1;
        min-width: 100px;
      }

      .button {
        flex-shrink: 0;
      }
    }
  }

  .posts-table {
    min-width: 690px;

    .title-column {
      width: 270px;
    }
  }

  .row-actions {
    opacity: 1;
  }
}
</style>