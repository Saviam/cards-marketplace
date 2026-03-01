<template>
  <router-view />
  <PToast position="top-center"/>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
</script>

<style>
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}
.p-toast {
  left: 50% !important;
  transform: translateX(-50%) !important;
  right: auto !important;
  width: calc(100% - 32px) !important;
  max-width: 400px !important;
}

/* Ajuste para desktop */
@media (min-width: 768px) {
  .p-toast {
    width: auto !important;
    max-width: 400px !important;
  }
}
</style>