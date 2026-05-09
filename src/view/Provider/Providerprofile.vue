<template>
  <div class="container py-4">

    <!-- Page heading -->
    <div class="pg-heading">
      <h1 class="pg-title">Provider<span class="title-dot">.</span>profile</h1>
    </div>

    <div class="pg-grid">

      <!-- LEFT: Profile Card -->
      <div class="left-col">
        <div class="profile-card">

          <div class="card-banner">
            <div class="banner-lines"></div>
          </div>

          <!-- Avatar -->
          <div class="avatar-wrap" @click="triggerUpload">
            <div class="avatar-ring">
              <img v-if="avatarPreview || user?.avatar" :src="avatarPreview || user.avatar" class="av-img" />
              <span v-else class="av-letter">{{ user?.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <div class="avatar-cam">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <div v-if="uploadingAvatar" class="av-loading">
              <div class="spinner"></div>
            </div>
          </div>
          <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />

          <div class="card-body">
            <div class="card-name">{{ user?.name }}</div>
            <div class="card-email">{{ user?.email }}</div>
            <span class="role-chip">Service Provider</span>
          </div>

          <!-- Info rows -->
          <div class="info-block">
            <div class="info-row">
              <span class="info-key">Email</span>
              <span class="info-val">{{ user?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Phone</span>
              <span class="info-val">{{ user?.phone || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Gender</span>
              <span class="info-val">{{ user?.gender == 1 ? 'Male' : 'Female' }}</span>
            </div>
            <div class="info-row last">
              <span class="info-key">Job</span>
              <span class="info-val">{{ user?.current_job || '—' }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- RIGHT -->
      <div class="right-col">

        <!-- Profile Form -->
        <div class="section-card">
          <div class="section-head">
            <span class="section-label">Profile information</span>
            <div class="action-row">
              <button class="btn-ghost" @click="toggleEdit">
                {{ isEditing ? 'Cancel' : 'Edit' }}
              </button>
              <button v-if="isEditing" class="btn-primary" @click="updateProfile">
                Save changes
              </button>
            </div>
          </div>

          <div class="form-body">
            <div class="field-pair">
              <div class="field">
                <label>Full name</label>
                <input v-model="form.name" :class="['finput', { active: isEditing }]" :readonly="!isEditing" />
              </div>
              <div class="field">
                <label>Email</label>
                <input v-model="form.email" :class="['finput', { active: isEditing }]" :readonly="!isEditing" />
              </div>
            </div>
            <div class="field-pair">
              <div class="field">
                <label>Phone</label>
                <input v-model="form.phone" :class="['finput', { active: isEditing }]" :readonly="!isEditing" placeholder="Add phone" />
              </div>
              <div class="field">
                <label>Gender</label>
                <select v-model="form.gender" :class="['finput', { active: isEditing }]" :disabled="!isEditing">
                  <option :value="1">Male</option>
                  <option :value="2">Female</option>
                </select>
              </div>
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

          <div v-if="showPassForm" class="form-body">
            <div class="field-pair three">
              <div class="field">
                <label>Current password</label>
                <input type="password" v-model="passForm.old_pass" class="finput active" placeholder="••••••••" />
              </div>
              <div class="field">
                <label>New password</label>
                <input type="password" v-model="passForm.new_pass" class="finput active" placeholder="••••••••" />
              </div>
              <div class="field">
                <label>Confirm password</label>
                <input type="password" v-model="passForm.new_pass_confirmation" class="finput active" placeholder="••••••••" />
              </div>
            </div>
            <button class="btn-primary mt-sm" @click="changePassword">Update password</button>
          </div>

          <p v-else class="pass-hint">Use a strong password — at least 8 characters with letters and numbers.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

const user = ref(null)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const isEditing = ref(false)
const showPassForm = ref(false)

const form = reactive({ name: '', email: '', phone: '', gender: 1, current_job: '' })
const passForm = reactive({ old_pass: '', new_pass: '', new_pass_confirmation: '' })

const fetchUser = async () => {
  const res = await api.get('/me')
  user.value = res.data?.data || res.data
  Object.assign(form, user.value)
}

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

const toggleEdit = () => {
  if (isEditing.value) Object.assign(form, user.value)
  isEditing.value = !isEditing.value
}

const updateProfile = async () => {
  await api.post('/profile/info', form)
  isEditing.value = false
  await fetchUser()
}

const changePassword = async () => {
  await api.put('/profile/pass', passForm)
  showPassForm.value = false
}
onMounted(fetchUser)
</script>

<style scoped>
:root {
  --navy:#0d2137; --navy2:#163352; --teal:#1a7a5e; --green:#4aab3e;
  --accent:#1a6bde; --amber:#c97a10; --danger:#c62828;
  --bg:#f2f5f9; --white:#fff; --border:rgba(0,0,0,.08);
  --t1:#0f172a; --t2:#475569; --t3:#94a3b8;
}
.pp-page { min-height:100vh; background:var(--bg); font-family:'DM Sans',ui-sans-serif,system-ui,sans-serif; }

.form-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 14px; }

.field-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field-pair.three { grid-template-columns: 1fr 1fr 1fr; }

.field { display: flex; flex-direction: column; gap: 5px; }

.field label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #bbb;
}

.finput {
  font-family: inherit;
  font-size: 13px;
  padding: 9px 12px;
  border-radius: 9px;
  border: 1px solid rgba(0,0,0,0.10);
  background: #f7f6f3;
  color: #1c1c1c;
  width: 100%;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.finput.active { background: #fff; border-color: rgba(0,0,0,0.18); }

.finput.active:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
}

.finput[readonly], .finput[disabled] { opacity: 0.6; cursor: default; }

.pass-hint { font-size: 12.5px; color: #bbb; padding: 0.9rem 1.5rem 1.1rem; line-height: 1.6; }

.mt-sm { margin-top: 4px; align-self: flex-start; }

@media (max-width: 700px) {
  .pg { padding: 1.25rem; }
  .pg-grid { grid-template-columns: 1fr; }
  .field-pair, .field-pair.three { grid-template-columns: 1fr; }
}

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