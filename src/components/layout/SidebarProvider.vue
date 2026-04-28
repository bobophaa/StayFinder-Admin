<template>
  <aside class="sidebar">
    <div class="logo-area">
      <img src="@/assets/images/image.png" alt="Logo" height="60" class="me-3" />
    </div>

    <nav class="menu px-3">
      <RouterLink v-for="item in menuItems" :key="item.label" :to="item.to" class="menu-item">
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
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { alertSuccess } from '@/Utils/alert'
const authStore = useAuthStore()
import Swal from 'sweetalert2'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const router = useRouter()

const providerMenus = [
  { label: 'Dashboard', to: '/provider/dashboard', icon: 'bi bi-grid-fill' },
  { label: 'My Properties', to: '/provider/my-rooms', icon: 'bi bi-building' },
  { label: 'Post New Room', to: '/provider/add-room', icon: 'bi bi-plus-circle-fill' },
  { label: 'Manage Booking', to: '/provider/booking-requests', icon: 'bi bi-calendar-event' },
  { label: 'Manage Renters', to: '/provider/rent-management', icon: 'bi bi-house-gear-fill' },
  { label: 'Profile', to: '/provider/profile', icon: 'bi bi-person-badge-fill' },
]

const adminMenus = [
  { label: 'Admin Dashboard', to: '/admin/dashboard', icon: 'bi bi-speedometer2' },
  { label: 'User Management', to: '/admin/Manage', icon: 'bi bi-people-fill' },
  { label: 'Location Settings', to: '/admin/locations', icon: 'bi bi-geo-alt-fill' },
  { label: 'Room Options', to: '/admin/room-options', icon: 'bi bi-list-stars' },
  { label: 'Profile info', to: '/admin/profile', icon: 'bi bi-person-badge-fill' },
]

const menuItems = computed(() => {
  const user = JSON.parse(localStorage.getItem('user'))

  const roleName = user?.roles?.[0]?.name

  if (roleName === 'System Admin') {
    return adminMenus
  }
  return providerMenus
})

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of your account.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: 'red',
    confirmButtonText: 'Yes, log out',
  })

  if (result.isConfirmed) {
    authStore.logout()

    await Swal.fire({
      icon: 'success',
      title: 'Logged out!',
      timer: 1500,
      showConfirmButton: false,
    })

    router.push('/login')
  }
}
</script>
<style scoped>
.sidebar {
  width: 260px;
  background: #031c36;
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
  filter: brightness(1.1);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: #a4b4c4;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  gap: 15px;
  border-radius: 12px;
}
.menu-item i {
  font-size: 22px;
}

.router-link-active {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ff5f00 !important;
  border-left: 4px solid #ff5f00;
  border-radius: 0 12px 12px 0 !important;
  font-weight: bolder;
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
  color: #ffffff;
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
  color: #ff5f00;
}
</style>
