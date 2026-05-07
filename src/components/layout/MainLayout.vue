<template>
  <div class="layout-wrapper d-flex">
    <SidebarProvider />

    <div class="main-container flex-grow-1">
      <NavbarProvider /> <main class="page-content p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SidebarProvider from './SidebarProvider.vue';
import NavbarProvider from './NavbarProvider.vue';
</script>

<style scoped>
.layout-wrapper {
  display: flex; 
  min-height: 100vh;
}

.main-container {
  margin-left: 260px; 
  background-color: #f8fafb;
  min-height: 100vh;
  transition: all 0.3s; 
}

.page-content {
  padding: 1.5rem;
}
</style>