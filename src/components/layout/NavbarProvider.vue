<template>
  <nav class="top-navbar d-flex align-items-center justify-content-between px-5">
    <div class="page-title-area">
      <h4 class="mb-0 fw-bold text-navy">{{ formatPageName(route.name) }}</h4>
    </div>

    <div class="user-profile d-flex align-items-center gap-2">
    <div class="pfp-container">
 <router-link to="/provider/profile" class="pfp-container">
  <img 
    :src="auth.user?.avatar || defaultAvatar" 
    alt="Profile" 
    class="pfp-img"
  />
</router-link>
</div>

      <div class="profile-text">
        <h6 class="profile-name mb-0">{{ auth.user?.name || 'Charming Views' }}</h6>
        <div class="role-area d-flex align-items-center">
        
          <span class="profile-role">{{ auth.user?.role }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
const route = useRoute();
const auth = useAuthStore();

const defaultAvatar = computed(() => 
  `https://ui-avatars.com/api/?background=031c36&color=fff&name=${encodeURIComponent(auth.user?.name || 'CV')}`
);
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
  cursor: pointer;
  transition: border-color .2s, transform .2s;
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