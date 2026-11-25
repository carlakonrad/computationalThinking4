<template>
  <!-- Each board gets a fresh page, so switching boards also resets zoom, position and selection. -->
  <NuxtPage :page-key="route => route.fullPath" />
  <BoardDialogs />
</template>
