<template>
  <nav class="top-navbar d-flex align-items-center justify-content-between px-5">
    <div class="page-title-area">
      <h4 class="mb-0 fw-bold text-navy">{{ formatPageName(route.name) }}</h4>
    </div>

    <div class="user-profile d-flex align-items-center gap-2">
      <div class="pfp-container">
        <router-link to="/provider/profile" class="pfp-container">
          <img :src="auth.user?.avatar || defaultAvatar" alt="Profile" class="pfp-img" />
        </router-link>
      </div>

      <div class="profile-text">
        <h6 class="profile-name mb-0">{{ auth.user?.name || 'StayFinder' }}</h6>
        <div class="role-area d-flex align-items-center">
          <span class="profile-role">{{ displayRole }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
const route = useRoute()
const auth = useAuthStore()

const defaultAvatar = computed(
  () =>
    `https://ui-avatars.com/api/?background=031c36&color=fff&name=${encodeURIComponent(auth.user?.name || 'SF')}`,
)
const roleNames = {
  'System Admin': 'អ្នកគ្រប់គ្រង',
  'Service Provider': 'ម្ចាស់អចលនទ្រព្យ',
}
const displayRole = computed(
  () => roleNames[auth.user?.role] || auth.user?.role || 'អ្នកប្រើប្រាស់',
)

const pageNames = {
  'provider.dashboard': 'ផ្ទាំងគ្រប់គ្រង',
  'provider.profile': 'ព័ត៌មានផ្ទាំង',
  'provider.addRoom': 'បន្ថែមបន្ទប់',
  'provider.manageRooms': 'គ្រប់គ្រងបន្ទប់',
  'provider.myRooms': 'បន្ទប់ដាក់ជួល',
  'provider.editRoom': 'កែសម្រួលបន្ទប់',
  'provider.bookingRequests': 'សំណើការកក់',
  'provider.rentManagement': 'គ្រប់គ្រងការជួល',
  'admin.dashboard': 'ផ្ទាំងគ្រប់គ្រង',
  'admin.users': 'គ្រប់គ្រងអ្នកប្រើ',
  'admin.districts': 'គ្រប់គ្រងខណ្ឌ',
  'admin.roomOptions': 'ជម្រើសបន្ទប់',
}
const formatPageName = (name) => {
  if (!name) return 'ផ្ទាំងគ្រប់គ្រង'
  return pageNames[name] || name.toString().replace(/\./g, ' ')
}
</script>

<style scoped>
.top-navbar {
  height: 80px;
  background: white;
  border-bottom: 1px solid #f0f0f0;

  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}
.top-navbar {
  height: 80px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.text-navy {
  color: #031c36;
}

.pfp-container {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition:
    border-color 0.2s,
    transform 0.2s;
  display: block;
}

.pfp-container:hover {
  border-color: #ff5f00;
  transform: scale(1.05);
}

.pfp-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-text {
  line-height: 1.2;
}

.profile-name {
  font-size: 15px;
  font-weight: 700;
  color: #333;
}

.role-area {
  color: #888;
  font-size: 13px;
}

.role-area i {
  font-size: 10px;
  font-weight: bold;
}

.profile-role {
  font-weight: 500;
}

.page-title-area h4 {
  letter-spacing: -0.5px;
}
</style>
