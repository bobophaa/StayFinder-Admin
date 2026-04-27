<template>
  <div class="pg">

    <!-- Page heading -->
    <div class="pg-heading">
      <h1 class="pg-title">
        {{ isAdmin ? 'Admin' : 'Provider' }}<span class="title-dot">.</span>profile
      </h1>
      <span class="role-chip" :class="isAdmin ? 'chip-admin' : 'chip-provider'">
        {{ isAdmin ? 'Administrator' : 'Service Provider' }}
      </span>
    </div>

    <div class="pg-grid">

      <!-- LEFT: Profile Card -->
      <div class="left-col">
        <div class="profile-card">

          <div class="card-banner" :class="isAdmin ? 'banner-admin' : 'banner-provider'">
            <div class="banner-lines"></div>
          </div>

          <div class="avatar-wrap" @click="triggerUpload">
            <div class="avatar-ring">
              <img v-if="avatarPreview || user?.avatar" :src="avatarPreview || user.avatar" class="av-img" />
              <span v-else class="av-letter" :class="isAdmin ? 'letter-admin' : 'letter-provider'">
                {{ user?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="avatar-cam" :class="isAdmin ? 'cam-admin' : 'cam-provider'">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div v-if="uploadingAvatar" class="av-loading">
              <div class="spinner"></div>
            </div>
          </div>
          <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />

          <div class="card-body">
            <div class="card-name">{{ user?.name }}</div>
            <div class="card-email">{{ user?.email }}</div>
            <span class="role-chip-sm" :class="isAdmin ? 'chip-admin' : 'chip-provider'">
              {{ isAdmin ? 'Administrator' : 'Service Provider' }}
            </span>
          </div>

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
            <!-- Admin-only field -->
            <div v-if="isAdmin" class="info-row">
              <span class="info-key">Department</span>
              <span class="info-val">{{ user?.department || '—' }}</span>
            </div>
            <!-- Provider-only field -->
            <div v-if="!isAdmin" class="info-row">
              <span class="info-key">Job</span>
              <span class="info-val">{{ user?.current_job || '—' }}</span>
            </div>
            <div class="info-row last">
              <span class="info-key">Role</span>
              <span class="info-val">{{ isAdmin ? 'Administrator' : 'Service Provider' }}</span>
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
              <button
                v-if="isEditing"
                class="btn-primary"
                :class="isAdmin ? 'btn-admin' : 'btn-provider'"
                @click="updateProfile"
              >
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

            <!-- Admin-only field -->
            <div v-if="isAdmin" class="field">
              <label>Department</label>
              <input v-model="form.department" :class="['finput', { active: isEditing }]" :readonly="!isEditing" placeholder="e.g. Operations" />
            </div>

            <!-- Provider-only field -->
            <div v-if="!isAdmin" class="field">
              <label>Current job</label>
              <input v-model="form.current_job" :class="['finput', { active: isEditing }]" :readonly="!isEditing" placeholder="e.g. UX/UI Designer" />
            </div>
          </div>
        </div>

        <!-- Admin-only: Permissions block -->
        <div v-if="isAdmin" class="section-card">
          <div class="section-head">
            <span class="section-label">Admin permissions</span>
            <span class="perm-badge">Read only</span>
          </div>
          <div class="perm-list">
            <div class="perm-row" v-for="perm in adminPermissions" :key="perm.label">
              <span class="perm-label">{{ perm.label }}</span>
              <span class="perm-status" :class="perm.granted ? 'granted' : 'denied'">
                {{ perm.granted ? 'Granted' : 'Denied' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Provider-only: Business info -->
        <div v-if="!isAdmin" class="section-card">
          <div class="section-head">
            <span class="section-label">Business information</span>
            <button class="btn-ghost" @click="toggleBizEdit">
              {{ isBizEditing ? 'Cancel' : 'Edit' }}
            </button>
          </div>
          <div class="form-body">
            <div class="field-pair">
              <div class="field">
                <label>Business name</label>
                <input v-model="bizForm.business_name" :class="['finput', { active: isBizEditing }]" :readonly="!isBizEditing" placeholder="Your business name" />
              </div>
              <div class="field">
                <label>Business type</label>
                <input v-model="bizForm.business_type" :class="['finput', { active: isBizEditing }]" :readonly="!isBizEditing" placeholder="e.g. Rental, Hotel" />
              </div>
            </div>
            <div class="field">
              <label>Address</label>
              <input v-model="bizForm.address" :class="['finput', { active: isBizEditing }]" :readonly="!isBizEditing" placeholder="Business address" />
            </div>
            <button v-if="isBizEditing" class="btn-primary btn-provider mt-sm" @click="saveBizInfo">
              Save business info
            </button>
          </div>
        </div>

        <!-- Change Password (shared) -->
        <div class="section-card">
          <div class="section-head">
            <span class="section-label">Change password</span>
            <button class="btn-ghost" @click="showPassForm = !showPassForm">
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
            <button
              class="btn-primary mt-sm"
              :class="isAdmin ? 'btn-admin' : 'btn-provider'"
              @click="changePassword"
            >
              Update password
            </button>
          </div>

          <p v-else class="pass-hint">Use a strong password — at least 8 characters with letters and numbers.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/api/http'

const user = ref(null)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const isEditing = ref(false)
const isBizEditing = ref(false)
const showPassForm = ref(false)

// Derive role from user object — adjust field name to match your API
const isAdmin = computed(() => user.value?.role === 'admin')

const form = reactive({ name: '', email: '', phone: '', gender: 1, current_job: '', department: '' })
const bizForm = reactive({ business_name: '', business_type: '', address: '' })
const passForm = reactive({ old_pass: '', new_pass: '', new_pass_confirmation: '' })

// Admin permissions (example — replace with real data from API)
const adminPermissions = ref([
  { label: 'Manage users', granted: true },
  { label: 'Manage providers', granted: true },
  { label: 'View reports', granted: true },
  { label: 'Edit system settings', granted: false },
  { label: 'Delete records', granted: false },
])

const fetchUser = async () => {
  const res = await api.get('/me')
  user.value = res.data?.data || res.data
  Object.assign(form, user.value)
  if (user.value?.business) {
    Object.assign(bizForm, user.value.business)
  }
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

const toggleBizEdit = () => {
  if (isBizEditing.value && user.value?.business) Object.assign(bizForm, user.value.business)
  isBizEditing.value = !isBizEditing.value
}

const saveBizInfo = async () => {
  await api.post('/profile/business', bizForm)
  isBizEditing.value = false
  await fetchUser()
}

const changePassword = async () => {
  await api.put('/profile/pass', passForm)
  showPassForm.value = false
  Object.assign(passForm, { old_pass: '', new_pass: '', new_pass_confirmation: '' })
}

onMounted(fetchUser)
</script>

<style scoped>
.pg {
  padding: 2rem 2.5rem;
  background: #f0efec;
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
  color: #1c1c1c;
}

/* Heading */
.pg-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.75rem;
}

.pg-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a2236;
  letter-spacing: -0.3px;
}

.title-dot { color: #f97316; }

/* Role chips */
.role-chip {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
}

.chip-admin {
  background: #eef2ff;
  color: #3730a3;
  border: 1px solid #c7d2fe;
}

.chip-provider {
  background: #fff4ed;
  color: #c2520a;
  border: 1px solid #fcd5b3;
}

/* Grid */
.pg-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.25rem;
  align-items: start;
}

.right-col { display: flex; flex-direction: column; gap: 1.25rem; }

/* Profile card */
.profile-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.07);
  overflow: hidden;
}

.card-banner {
  height: 80px;
  position: relative;
}

.banner-admin  { background: #1e1b4b; }
.banner-provider { background: #1a2236; }

.banner-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 14px,
    rgba(255,255,255,0.04) 14px,
    rgba(255,255,255,0.04) 15px
  );
}

/* Avatar */
.avatar-wrap {
  width: 76px;
  height: 76px;
  margin: -38px auto 0;
  position: relative;
  cursor: pointer;
}

.avatar-ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  border: 3px solid #fff;
  background: #1a2236;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: filter 0.2s;
}

.avatar-wrap:hover .avatar-ring { filter: brightness(0.88); }
.av-img { width: 100%; height: 100%; object-fit: cover; }

.av-letter {
  font-size: 28px;
  font-weight: 700;
  font-family: Georgia, serif;
}

.letter-admin   { color: #818cf8; }
.letter-provider { color: #f97316; }

.avatar-cam {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.cam-admin    { background: #4f46e5; }
.cam-provider { background: #f97316; }

.av-loading {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.card-body { padding: 12px 1.25rem 1rem; text-align: center; }
.card-name { font-size: 15px; font-weight: 700; color: #1a2236; margin-bottom: 2px; }
.card-email { font-size: 12px; color: #999; margin-bottom: 10px; }

.role-chip-sm {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 3px 12px;
  border-radius: 20px;
}

/* Info block */
.info-block {
  border-top: 1px solid rgba(0,0,0,0.06);
  padding: 0.25rem 1.25rem 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-size: 12.5px;
  gap: 8px;
}

.info-row.last { border-bottom: none; }
.info-key { color: #aaa; flex-shrink: 0; }
.info-val { font-weight: 500; text-align: right; color: #1c1c1c; word-break: break-all; }

/* Section card */
.section-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.07);
  overflow: hidden;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.section-label { font-size: 14px; font-weight: 700; color: #1a2236; }
.action-row { display: flex; gap: 8px; align-items: center; }

/* Buttons */
.btn-ghost {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.15);
  background: transparent;
  color: #555;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-ghost:hover { background: #f5f4f1; }

.btn-primary {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.btn-primary:hover { opacity: 0.88; }
.btn-admin    { background: #4f46e5; }
.btn-provider { background: #f97316; }

/* Form */
.form-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 14px; }

.field-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
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
.finput.active:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
.finput[readonly], .finput[disabled] { opacity: 0.6; cursor: default; }

/* Permissions */
.perm-badge {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.perm-list { padding: 0.25rem 1.5rem 1rem; }

.perm-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-size: 13px;
}

.perm-row:last-child { border-bottom: none; }
.perm-label { color: #555; }

.perm-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
}

.granted { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.denied  { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Password */
.pass-hint { font-size: 12.5px; color: #bbb; padding: 0.9rem 1.5rem 1.1rem; line-height: 1.6; }
.mt-sm { margin-top: 4px; align-self: flex-start; }

/* Responsive */
@media (max-width: 700px) {
  .pg { padding: 1.25rem; }
  .pg-grid { grid-template-columns: 1fr; }
  .field-pair, .field-pair.three { grid-template-columns: 1fr; }
}
</style>