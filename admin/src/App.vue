<script setup>
import { computed, onMounted, ref } from 'vue';
import { Check, X } from '@lucide/vue';
import AdminFooter from './components/AdminFooter.vue';
import AdminHeader from './components/AdminHeader.vue';
import AdminSidebar from './components/AdminSidebar.vue';
import PostEditor from './components/PostEditor.vue';
import PostsPage from './components/PostsPage.vue';

const apiBase = import.meta.env.VITE_API_URL || '/api';
const posts = ref([]);
const isLoading = ref(true);
const loadError = ref('');
const notice = ref('');
const activeStatus = ref('all');
const searchInput = ref('');
const searchQuery = ref('');
const selectedIds = ref([]);
const bulkAction = ref('');
const isEditorOpen = ref(false);
const isSaving = ref(false);
const editorError = ref('');
const editor = ref(emptyEditor());
const sortDirection = ref('desc');
const isSidebarOpen = ref(false);

function emptyEditor() {
  return { _id: '', title: '', slug: '', content: '', category: 'Uncategorized', status: 'draft' };
}

const statusTabs = computed(() => [
  { key: 'all', label: 'All', count: posts.value.length },
  { key: 'publish', label: 'Published', count: countStatus('publish') },
  { key: 'draft', label: 'Drafts', count: countStatus('draft') },
  { key: 'trash', label: 'Trash', count: countStatus('trash') }
]);

const visiblePosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return posts.value
    .filter((post) => activeStatus.value === 'all' || post.status === activeStatus.value)
    .filter((post) => !query || [post.title, post.slug, post.category].some((value) => value?.toLowerCase().includes(query)))
    .sort((first, second) => {
      const difference = new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
      return sortDirection.value === 'desc' ? difference : -difference;
    });
});

const allVisibleSelected = computed(() => visiblePosts.value.length > 0 && visiblePosts.value.every((post) => selectedIds.value.includes(post._id)));

function countStatus(status) {
  return posts.value.filter((post) => post.status === status).length;
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
  return payload;
}

async function loadPosts() {
  isLoading.value = true;
  loadError.value = '';
  try {
    posts.value = await request('/admin/posts?type=post');
  } catch (error) {
    loadError.value = `${error.message}. Check that the Express API and MongoDB are running.`;
  } finally {
    isLoading.value = false;
  }
}

function openEditor(post = null) {
  editor.value = post
    ? { _id: post._id, title: post.title, slug: post.slug, content: post.content, category: post.category || 'Uncategorized', status: post.status }
    : emptyEditor();
  editorError.value = '';
  isEditorOpen.value = true;
}

function closeEditor() {
  if (!isSaving.value) isEditorOpen.value = false;
}

async function savePost() {
  const { _id, ...fields } = editor.value;
  if (!fields.title.trim() || !fields.slug.trim() || !fields.content.trim()) {
    editorError.value = 'Title, slug, and content are required.';
    return;
  }

  isSaving.value = true;
  editorError.value = '';
  try {
    if (_id) {
      await request(`/admin/posts/${_id}`, { method: 'PATCH', body: JSON.stringify(fields) });
      showNotice('Post updated.');
    } else {
      await request('/admin/posts', { method: 'POST', body: JSON.stringify(fields) });
      showNotice('Post created.');
    }
    isEditorOpen.value = false;
    await loadPosts();
  } catch (error) {
    editorError.value = error.message;
  } finally {
    isSaving.value = false;
  }
}

async function changeStatus(post, status) {
  try {
    await request(`/admin/posts/${post._id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    showNotice(status === 'publish' ? 'Post published.' : status === 'draft' ? 'Post moved to drafts.' : 'Post restored.');
    await loadPosts();
  } catch (error) {
    showNotice(error.message);
  }
}

async function trashPost(post) {
  if (!window.confirm(`Move “${post.title}” to the trash?`)) return;
  try {
    await request(`/admin/posts/${post._id}`, { method: 'DELETE' });
    selectedIds.value = selectedIds.value.filter((id) => id !== post._id);
    showNotice('Post moved to the trash.');
    await loadPosts();
  } catch (error) {
    showNotice(error.message);
  }
}

async function applyBulkAction() {
  if (!bulkAction.value || selectedIds.value.length === 0) return;
  const selectedPosts = posts.value.filter((post) => selectedIds.value.includes(post._id));
  if (bulkAction.value === 'trash' && !window.confirm(`Move ${selectedPosts.length} selected post(s) to the trash?`)) return;

  try {
    await Promise.all(selectedPosts.map((post) => bulkAction.value === 'trash'
      ? request(`/admin/posts/${post._id}`, { method: 'DELETE' })
      : request(`/admin/posts/${post._id}`, { method: 'PATCH', body: JSON.stringify({ status: bulkAction.value }) })));
    showNotice(`${selectedPosts.length} post(s) updated.`);
    selectedIds.value = [];
    bulkAction.value = '';
    await loadPosts();
  } catch (error) {
    showNotice(error.message);
    await loadPosts();
  }
}

function showNotice(message) {
  notice.value = message;
  window.setTimeout(() => {
    if (notice.value === message) notice.value = '';
  }, 3500);
}

function selectStatus(status) {
  activeStatus.value = status;
  selectedIds.value = [];
}

function toggleAll() {
  selectedIds.value = allVisibleSelected.value ? [] : visiblePosts.value.map((post) => post._id);
}

function toggleSelected(id) {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((selectedId) => selectedId !== id)
    : [...selectedIds.value, id];
}

function submitSearch() {
  searchQuery.value = searchInput.value;
}

onMounted(loadPosts);
</script>

<template>
  <div class="admin-shell">
    <AdminHeader @toggle-navigation="isSidebarOpen = !isSidebarOpen" />
    <AdminSidebar :is-open="isSidebarOpen" @open-editor="openEditor" />

    <main id="posts" class="main-content">
      <PostsPage
        :posts="visiblePosts"
        :status-tabs="statusTabs"
        :active-status="activeStatus"
        :search-input="searchInput"
        :selected-ids="selectedIds"
        :all-visible-selected="allVisibleSelected"
        :bulk-action="bulkAction"
        :sort-direction="sortDirection"
        :is-loading="isLoading"
        :load-error="loadError"
        @add-post="openEditor()"
        @edit-post="openEditor"
        @change-status="changeStatus"
        @trash-post="trashPost"
        @apply-bulk-action="applyBulkAction"
        @retry="loadPosts"
        @select-status="selectStatus"
        @update-search="searchInput = $event"
        @submit-search="submitSearch"
        @toggle-all="toggleAll"
        @toggle-selected="toggleSelected"
        @update-bulk-action="bulkAction = $event"
        @toggle-sort="sortDirection = sortDirection === 'desc' ? 'asc' : 'desc'"
      />
      <AdminFooter />
    </main>

    <Transition name="toast">
      <div v-if="notice" class="notice" role="status">
        <Check :size="16" />{{ notice }}
        <button type="button" aria-label="Dismiss notice" @click="notice = ''"><X :size="15" /></button>
      </div>
    </Transition>

    <PostEditor
      v-if="isEditorOpen"
      v-model:post="editor"
      :error="editorError"
      :is-saving="isSaving"
      :created-at="posts.find((post) => post._id === editor._id)?.createdAt"
      @close="closeEditor"
      @save="savePost"
    />
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

.notice {
  position: fixed;
  z-index: 50;
  right: 24px;
  bottom: 24px;
  max-width: min(440px, calc(100vw - 32px));
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  border-left: 4px solid #00a32a;
  background: white;
  box-shadow: 0 2px 12px #1d232733;

  button {
    display: grid;
    place-items: center;
    margin-left: 5px;
    padding: 2px;
    border: 0;
    color: #646970;
    background: transparent;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
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

  .notice {
    right: 12px;
    bottom: 12px;
  }
}
</style>