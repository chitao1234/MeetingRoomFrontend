<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h3 class="mb-4">{{ title }}</h3>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
})
</script> 