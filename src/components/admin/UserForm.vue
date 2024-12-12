<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="form-group">
      <label for="username">{{ $t('message.username') }}:</label>
      <input id="username" v-model="formData.username" required />
    </div>
    <div class="form-group" v-if="!isEdit">
      <label for="password">{{ $t('message.password') }}:</label>
      <input id="password" v-model="formData.password" type="password" required />
    </div>
    <div class="form-group">
      <label for="email">{{ $t('message.email') }}:</label>
      <input id="email" v-model="formData.email" type="email" required />
    </div>
    <div class="form-group">
      <label for="phone">{{ $t('message.phone') }}:</label>
      <input id="phone" v-model="formData.phone" />
    </div>
    <div class="form-group">
      <label for="role">{{ $t('message.forms.role') }}</label>
      <select id="role" v-model="formData.role">
        <option value="USER">{{ $t('message.forms.roleUser') }}</option>
        <option value="ADMIN">{{ $t('message.forms.roleAdmin') }}</option>
      </select>
    </div>
    <div class="modal-actions">
      <button type="submit" class="btn btn-primary">
        {{ isEdit ? $t('message.saveChanges') : $t('message.submit') }}
      </button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        {{ $t('message.cancel') }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UserForm',
  props: {
    user: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props) {
    const formData = ref({ ...props.user })

    return {
      formData
    }
  }
})
</script> 