<template>
  <router-view />
  <PToast position="top-center" />
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

/* ConfirmDialog com padding no mobile */
.p-dialog.p-confirmdialog {
  width: calc(100% - 32px) !important;
  max-width: 400px !important;
  margin: 16px !important;
}

/* Ajustes para desktop */
@media (min-width: 768px) {
  .p-toast {
    width: auto !important;
    max-width: 400px !important;
  }
  
  .p-dialog.p-confirmdialog {
    width: auto !important;
    margin: 0 auto !important;
  }
}
</style>