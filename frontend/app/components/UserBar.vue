<script setup lang="ts">
// Shows who is logged in, or the button to log in with Google.
const { user, loginUrl, load, logout } = useAuth()
await load()
</script>

<template>
  <div class="flex items-center justify-end gap-3">
    <template v-if="user">
      <!-- Google avatars sometimes refuse to load when the browser sends a referrer. -->
      <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="" referrerpolicy="no-referrer" class="size-8 rounded-full">
      <span v-else class="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
        {{ user.name[0] }}
      </span>
      <span class="text-sm font-medium">{{ user.name }}</span>
      <Button variant="outline" size="sm" @click="logout">
        Abmelden
      </Button>
    </template>
    <Button v-else as-child variant="outline" size="sm">
      <a :href="loginUrl">Mit Google anmelden</a>
    </Button>
  </div>
</template>
