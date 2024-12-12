<template>
  <form @submit.prevent="$emit('submit', formData)">
    <div class="form-group">
      <label for="username">Username:</label>
      <input id="username" v-model="formData.username" required />
    </div>
    <div class="form-group" v-if="!isEdit">
      <label for="password">Password:</label>
      <input id="password" v-model="formData.password" type="password" required />
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input id="email" v-model="formData.email" type="email" required />
    </div>
    <div class="form-group">
      <label for="phone">Phone:</label>
      <input id="phone" v-model="formData.phone" />
    </div>
    <div class="form-group">
      <label for="role">Role:</label>
      <select id="role" v-model="formData.role">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
    <div class="modal-actions">
      <button type="submit" class="btn btn-primary">{{ isEdit ? 'Save' : 'Create' }}</button>
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>
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