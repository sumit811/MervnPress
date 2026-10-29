<script setup>
import { ref } from 'vue';
import { X } from '@lucide/vue';

const post = defineModel('post', { required: true });
const props = defineProps({
  error: { type: String, default: '' },
  isSaving: { type: Boolean, default: false },
  createdAt: { type: String, default: '' }
});
const emit = defineEmits(['close', 'save']);
const generatedSlug = ref('');

function updateField(field, value) {
  post.value = { ...post.value, [field]: value };
}

function makeSlug(value) {
  return value.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function updateTitle(value) {
  const slug = post.value.slug;
  const suggested = makeSlug(value);
  if (!post.value._id && (!slug || slug === generatedSlug.value)) {
    updateField('slug', suggested);
    generatedSlug.value = suggested;
  }
  updateField('title', value);
}

function updateSlug(value) {
  generatedSlug.value = '';
  updateField('slug', value);
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function close() {
  if (!props.isSaving) emit('close');
}
</script>

<template>
  <div class="modal-backdrop" @click.self="close" @keydown.esc="close">
    <section class="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <header class="editor-modal__header">
        <h2 id="editor-title">{{ post._id ? 'Edit Post' : 'Add Post' }}</h2>
        <button class="icon-button" type="button" aria-label="Close editor" @click="close"><X :size="18" /></button>
      </header>
      <form class="editor-form" @submit.prevent="$emit('save')">
        <label>Title<input :value="post.title" autofocus required placeholder="Post title" @input="updateTitle($event.target.value)" /></label>
        <label>Slug<input :value="post.slug" required placeholder="post-url-slug" @input="updateSlug($event.target.value)" /></label>
        <div class="editor-form__row">
          <label>Category<input :value="post.category" placeholder="Uncategorized" @input="updateField('category', $event.target.value)" /></label>
          <label>Status<select :value="post.status" @change="updateField('status', $event.target.value)"><option value="draft">Draft</option><option value="publish">Published</option><option value="trash">Trash</option></select></label>
        </div>
        <label>Content<textarea :value="post.content" required rows="9" placeholder="Write your post…" @input="updateField('content', $event.target.value)"></textarea></label>
        <p v-if="error" class="editor-error" role="alert">{{ error }}</p>
        <footer class="editor-form__footer">
          <span>{{ post._id ? `Created ${formatDate(createdAt)}` : 'New post' }}</span>
          <div><button class="button" type="button" :disabled="isSaving" @click="close">Cancel</button><button class="button button--primary" type="submit" :disabled="isSaving">{{ isSaving ? 'Saving…' : 'Save Post' }}</button></div>
        </footer>
      </form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  z-index: 40;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #1d232780;
}

.editor-modal {
  width: min(680px, 100%);
  max-height: min(90vh, 850px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #c3c4c7;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 10px 35px #1d232733;
  animation: modal-in .16s ease-out;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 21px;
    border-bottom: 1px solid #dcdcde;

    h2 {
      margin: 0;
      font-size: 17px;
      font-weight: 600;
    }
  }
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 21px 0;
  overflow-y: auto;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #2c3338;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #8c8f94;
    border-radius: 2px;
    color: #1d2327;
    background: white;
    font-weight: 400;

    &:focus {
      border-color: var(--wp-blue);
      outline: 1px solid var(--wp-blue);
    }
  }

  textarea {
    min-height: 160px;
    resize: vertical;
    line-height: 1.55;
  }

  select {
    width: 100%;
    height: 36px;
    padding: 3px 27px 3px 8px;
    border: 1px solid #8c8f94;
    border-radius: 2px;
    color: #2c3338;
    background: #fff;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 180px;
    gap: 14px;
  }

  &__footer {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 2px -21px 0;
    padding: 12px 21px;
    border-top: 1px solid #dcdcde;
    color: #646970;
    background: white;

    > div {
      display: flex;
      gap: 8px;
    }
  }
}

.editor-error {
  margin: 0;
  color: #b32d2e;
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .editor-form {
    padding-right: 16px;
    padding-left: 16px;

    &__row {
      grid-template-columns: 1fr;
    }

    &__footer {
      margin-right: -16px;
      margin-left: -16px;
      padding-right: 16px;
      padding-left: 16px;
    }
  }

  .modal-backdrop {
    align-items: end;
    padding: 0;
  }

  .editor-modal {
    max-height: 92vh;
    border-radius: 6px 6px 0 0;
  }
}
</style>