<template>
  <div class="container py-4">

    <div class="row g-4">

      <!-- LEFT -->
      <div class="col-lg-4">

        <!-- PROFILE CARD -->
        <div class="card clean-card text-center p-4">

          <!-- AVATAR -->
          <div class="avatar-wrapper mb-3" @click="triggerUpload">

            <div class="avatar">
              <img v-if="avatarPreview || user?.avatar" :src="avatarPreview || user.avatar" />
              <span v-else>{{ user?.name?.charAt(0) }}</span>
            </div>

            <div class="avatar-icon">
              <i class="bi bi-camera-fill"></i>
            </div>

            <!-- loading -->
            <div v-if="uploadingAvatar" class="avatar-loading">
              <div class="spinner-border spinner-border-sm text-white"></div>
            </div>

          </div>

          <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />

          <h5 class="fw-bold mb-1">{{ user?.name }}</h5>
          <p class="text-muted small mb-3">{{ user?.email }}</p>

          <span class="badge badge-role">Service Provider</span>
        </div>

        <!-- INFO -->
        <div class="card clean-card mt-4 p-3">
          <h6 class="section-title">Account Info</h6>

          <div class="info-item">
            <span>Email</span>
            <strong>{{ user?.email }}</strong>
          </div>

          <div class="info-item">
            <span>Phone</span>
            <strong>{{ user?.phone || 'Not set' }}</strong>
          </div>

          <div class="info-item">
            <span>Gender</span>
            <strong>{{ user?.gender == 1 ? 'Male' : 'Female' }}</strong>
          </div>

          <div class="info-item">
            <span>Job</span>
            <strong>{{ user?.current_job || 'Not set' }}</strong>
          </div>
        </div>

      </div>

      <!-- RIGHT -->
      <div class="col-lg-8">

        <!-- PROFILE FORM -->
        <div class="card clean-card p-4 mb-4">
          <div class="d-flex justify-content-between mb-3">
            <h6 class="section-title">Profile Information</h6>
            <button class="btn btn-orange btn-sm" @click="enableEdit">
              Edit
            </button>
          </div>

          <div class="row g-3">

            <div class="col-md-6">
              <label>Full Name</label>
              <input v-model="form.name" :readonly="!isEditing" />
            </div>

            <div class="col-md-6">
              <label>Email</label>
              <input v-model="form.email" :readonly="!isEditing" />
            </div>

            <div class="col-md-6">
              <label>Phone</label>
              <input v-model="form.phone" :readonly="!isEditing" />
            </div>

            <div class="col-md-6">
              <label>Gender</label>
              <select v-model="form.gender" :disabled="!isEditing">
                <option :value="1">Male</option>
                <option :value="2">Female</option>
              </select>
            </div>

            <div class="col-12">
              <label>Job</label>
              <input v-model="form.current_job" :readonly="!isEditing" />
            </div>

          </div>

          <div v-if="isEditing" class="text-end mt-3">
            <button class="btn btn-orange" @click="updateProfile">
              Save
            </button>
          </div>
        </div>

        <!-- PASSWORD -->
        <div class="card clean-card p-4">
          <div class="d-flex justify-content-between mb-3">
            <h6 class="section-title">Change Password</h6>
            <button class="btn btn-outline-secondary btn-sm" @click="showPassForm = !showPassForm">
              {{ showPassForm ? 'Cancel' : 'Change' }}
            </button>
          </div>

          <div v-if="showPassForm" class="row g-3">

            <div class="col-md-4">
              <input v-model="passForm.old_pass" placeholder="Current password" />
            </div>

            <div class="col-md-4">
              <input v-model="passForm.new_pass" placeholder="New password" />
            </div>

            <div class="col-md-4">
              <input v-model="passForm.new_pass_confirmation" placeholder="Confirm password" />
            </div>

            <div class="col-12">
              <button class="btn btn-orange" @click="changePassword">
                Update Password
              </button>
            </div>

          </div>

          <p v-else class="text-muted small">
            Use a strong password with at least 8 characters.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

const user = ref(null)
const loading = ref(false)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const isEditing = ref(false)
const showPassForm = ref(false)

const form = reactive({
  name: '', email: '', phone: '', gender: 1, current_job: ''
})

const passForm = reactive({
  old_pass: '', new_pass: '', new_pass_confirmation: ''
})

// fetch user
const fetchUser = async () => {
  const res = await api.get('/me')
  user.value = res.data?.data || res.data
  Object.assign(form, user.value)
}

// avatar upload
const triggerUpload = () => fileInput.value.click()

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarPreview.value = URL.createObjectURL(file)

  const fd = new FormData()
  fd.append('image', file)

  uploadingAvatar.value = true

  try {
    await api.post('/profile/image', fd)
    await fetchUser()
  } finally {
    uploadingAvatar.value = false
  }
}

// edit profile
const enableEdit = () => isEditing.value = true

const updateProfile = async () => {
  await api.post('/profile/info', form)
  isEditing.value = false
}

// change password
const changePassword = async () => {
  await api.put('/profile/pass', passForm)
  showPassForm.value = false
}
onMounted(fetchUser)
</script>

<style scoped>

/* CARD */
.clean-card {
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

/* AVATAR */
.avatar-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  margin: auto;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ff5f00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ICON */
.avatar-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #ff5f00;
  color: white;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper:hover .avatar-icon {
  transform: scale(1.1);
}

/* LOADING */
.avatar-loading {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* INPUT */
input, select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

input:focus {
  border-color: #ff5f00;
  outline: none;
}

/* BUTTON */
.btn-orange {
  background: #ff5f00;
  color: white;
  border-radius: 8px;
}

.badge-role {
  background: #fff3eb;
  color: #ff5f00;
  padding: 5px 12px;
  border-radius: 20px;
}

/* INFO */
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.section-title {
  font-weight: 600;
}

</style>