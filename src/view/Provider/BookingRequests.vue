<template>
  <!-- <NavbarProvider /> -->
  <div class="flex">
    <SidebarProvider />
    <div class="flex-1 p-4">
      <h1 class="text-2xl font-bold mb-4">Booking Requests</h1>
      <!-- Booking requests content goes here -->
    </div>
  </div>
  <SidebarProvider />
</template>
<script setup>
import NavbarProvider from '@/components/layout/NavbarProvider.vue'
import SidebarProvider from '@/components/layout/SidebarProvider.vue'
</script>
