<template>
  <nav class="top-navbar d-flex align-items-center justify-content-between px-5">
    <div class="page-title-area">
      <h4 class="mb-0 fw-bold text-navy">{{ formatPageName(route.name) }}</h4>
    </div>

    <div class="user-profile d-flex align-items-center gap-2">
      <div class="pfp-container">
        <img 
          :src="auth.user?.profile_photo_url || defaultAvatar" 
          alt="Profile" 
          class="pfp-img"
        />
      </div>

      <div class="profile-text">
        <h6 class="profile-name mb-0">{{ auth.user?.name || 'Charming Views' }}</h6>
        <div class="role-area d-flex align-items-center">
          <i class="bi bi-chevron-right me-1"></i>
          <span class="profile-role">Provider</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const auth = useAuthStore();

const defaultAvatar = "https://ui-avatars.com/api/?background=031c36&color=fff&name=CV";

const formatPageName = (name) => {
  if (!name) return 'Dashboard';
  return name.toString()
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace('Provider ', '');
};
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