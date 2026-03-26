<template>
  <aside class="sidebar">
    <div class="logo-area">
            <img src="@/assets/images/image.png" alt="Logo" height="60" class="me-3" />

    </div>

    <nav class="menu px-3">
      <RouterLink
        v-for="item in menuItems"
        :key="item.label"
        :to="item.to"
        class="menu-item"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="bottom-area pb-4">
      <button class="logout-btn px-4" @click="handleLogout">
        <i class="bi bi-box-arrow-left"></i>
        <span>Log Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from "vue-router";

const menuItems = [
  { label: "Dashboard", to: "/provider/dashboard", icon: "bi bi-grid-fill" },
  { label: "My Properties", to: "/provider/my-rooms", icon: "bi bi-building" },
  // ADD THIS ONE HERE
  { label: "Post New Room", to: "/provider/add-room", icon: "bi bi-plus-circle-fill" }, 
  { label: "Booking Requests", to: "/provider/booking-requests", icon: "bi bi-calendar-event" },
  { label: "Manage Renters", to: "/provider/rent-management", icon: "bi bi-house-gear-fill" },
  { label: "Profile info", to: "/profile", icon: "bi bi-person-badge-fill" }
];
function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
</script>

<style scoped>
.sidebar {
  width: 260px; /* Matched to your UI width */
  background: #031c36; /* Darker Navy to match your screenshot */
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
}

.logo-area {
  padding: 40px 20px;
  text-align: center;
}

.logo {
  width: 160px;
  filter: brightness(1.1); /* Makes the orange pop more */
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Space between items */
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: #a4b4c4; /* Muted light blue/grey */
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  gap: 15px;
  border-radius: 12px; /* Rounded corners for the highlight box */
}

.menu-item i {
  font-size: 22px;
}

/* --- THE UI MATCHING PART --- */

/* This is the active box style from your screenshot */
.router-link-active {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}

.menu-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.bottom-area {
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  padding: 15px;
  background: transparent;
  border: none;
  color: #ffffff; /* White text for logout */
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 18px;
  font-weight: 500;
}

.logout-btn i {
  font-size: 24px;
}

.logout-btn:hover {
  color: #ff5f00; /* Turns orange on hover to match theme */
}
</style>