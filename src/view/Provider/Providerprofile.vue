<template>
  <div class="container-fluid py-3 px-md-4">

    <!-- ── Loading skeleton ── -->
    <div v-if="!user" class="row g-4">
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div style="height:8px;background:#031c36"></div>
          <div class="p-4 text-center">
            <div class="skel-avatar mx-auto mb-3"></div>
            <div class="skel-line mx-auto mb-2" style="width:120px;height:18px;border-radius:6px"></div>
            <div class="skel-line mx-auto" style="width:80px;height:14px;border-radius:20px"></div>
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <div v-for="i in 5" :key="i" class="skel-line mb-3"
            :style="`width:${60+i*5}%;height:42px;border-radius:10px`"></div>
        </div>
      </div>
    </div>

    <div v-else>

      <!-- ── Page Header ── -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div class="card-header-navy p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 class="fw-bold mb-0 text-white">Provider Profile</h4>
            <small class="opacity-75 text-white">Manage your account settings</small>
          </div>
          <span class="badge bg-orange px-3 py-2">
            <i class="bi bi-house-check-fill me-1"></i>Service Provider
          </span>
        </div>
      </div>

      <div class="row g-4">

        <!-- ── LEFT COLUMN ── -->
        <div class="col-lg-4">

          <!-- Profile card -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div style="height:6px;background:linear-gradient(90deg,#031c36,#ff5f00)"></div>
            <div class="p-4 text-center">

              <!-- Avatar -->
              <div class="admin-avatar-wrap mx-auto mb-3" @click="triggerUpload" title="Change photo">
                <div class="admin-avatar">
                  <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="avatar" />
                  <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'P' }}</span>
                  <div v-if="loading && uploadingAvatar" class="avatar-overlay-loading">
                    <div class="spinner-border spinner-border-sm text-white"></div>
                  </div>
                </div>
                <div class="admin-avatar-cam">
                  <i class="bi bi-camera-fill"></i>
                </div>
              </div>
              <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />

              <h5 class="fw-bold text-navy mb-1">{{ user.name }}</h5>
              <p class="text-muted small mb-3">{{ user.email }}</p>

              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <span class="role-badge-provider">
                  <i class="bi bi-house-check-fill me-1"></i>Service Provider
                </span>
                <span class="role-badge-id">#{{ user.id }}</span>
              </div>
            </div>
          </div>

          <!-- Info card -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div class="card-header-navy px-4 py-3">
              <span class="fw-bold text-white small">
                <i class="bi bi-info-circle-fill me-2"></i>Account Details
              </span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="info-icon"><i class="bi bi-envelope-fill"></i></span>
                <div>
                  <div class="info-label">Email</div>
                  <div class="info-value">{{ user.email || '–' }}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon"><i class="bi bi-telephone-fill"></i></span>
                <div>
                  <div class="info-label">Phone</div>
                  <div class="info-value">{{ user.phone || 'Not set' }}</div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon"><i class="bi bi-gender-ambiguous"></i></span>
                <div>
                  <div class="info-label">Gender</div>
                  <div class="info-value">
                    {{ user.gender == 1 ? 'Male' : user.gender == 2 ? 'Female' : 'Not set' }}
                  </div>
                </div>
              </div>
              <div class="info-item border-0">
                <span class="info-icon"><i class="bi bi-briefcase-fill"></i></span>
                <div>
                  <div class="info-label">Job Title</div>
                  <div class="info-value">{{ user.current_job || 'Not set' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick links -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="card-header-navy px-4 py-3">
              <span class="fw-bold text-white small">
                <i class="bi bi-lightning-fill me-2"></i>Quick Links
              </span>
            </div>
            <div class="p-2">
              <router-link v-for="link in quickLinks" :key="link.to" :to="link.to"
                class="quick-link-item text-decoration-none">
                <div :class="['ql-icon', link.bg]">
                  <i :class="['bi', link.icon]" :style="{ color: link.color }"></i>
                </div>
                <span class="ql-label">{{ link.label }}</span>
                <i class="bi bi-chevron-right ms-auto text-muted small"></i>
              </router-link>
            </div>
          </div>

        </div>

        <!-- ── RIGHT COLUMN ── -->
        <div class="col-lg-8">

          <!-- Edit Profile Form -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
              <span class="fw-bold text-white">
                <i class="bi bi-person-fill me-2"></i>Profile Information
              </span>
              <div class="d-flex gap-2">
                <button v-if="!isEditing" class="btn btn-orange btn-sm px-3" @click="enableEdit">
                  <i class="bi bi-pencil-fill me-2"></i>Edit
                </button>
                <button v-else class="btn btn-outline-light btn-sm px-3" @click="cancelEdit">
                  <i class="bi bi-x-lg me-1"></i>Cancel
                </button>
              </div>
            </div>

            <div class="p-4">
              <div v-if="isEditing" class="edit-alert mb-4">
                <i class="bi bi-pencil-square me-2"></i>
                Editing mode is active. Make your changes then click <strong>Save Changes</strong>.
              </div>

              <form @submit.prevent="updateProfile">
                <div class="row g-3">

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'err-label': errors.name }">Full Name</label>
                    <div class="field-wrap" :class="{ 'err-wrap': errors.name, 'readonly-wrap': !isEditing }">
                      <i class="bi bi-person field-ico"></i>
                      <input v-model="form.name" placeholder="Full name" :readonly="!isEditing" />
                    </div>
                    <div v-if="errors.name" class="err-msg">{{ errors.name }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'err-label': errors.email }">Email Address</label>
                    <div class="field-wrap" :class="{ 'err-wrap': errors.email, 'readonly-wrap': !isEditing }">
                      <i class="bi bi-envelope field-ico"></i>
                      <input v-model="form.email" type="email" placeholder="email@example.com" :readonly="!isEditing" />
                    </div>
                    <div v-if="errors.email" class="err-msg">{{ errors.email }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label">Phone Number</label>
                    <div class="field-wrap" :class="{ 'readonly-wrap': !isEditing }">
                      <i class="bi bi-telephone field-ico"></i>
                      <input v-model="form.phone" placeholder="Phone number" :readonly="!isEditing" />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label">Gender</label>
                    <div class="field-wrap" :class="{ 'readonly-wrap': !isEditing }">
                      <i class="bi bi-gender-ambiguous field-ico"></i>
                      <select v-model="form.gender" :disabled="!isEditing">
                        <option :value="1">Male</option>
                        <option :value="2">Female</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="field-label">Job Title</label>
                    <div class="field-wrap" :class="{ 'readonly-wrap': !isEditing }">
                      <i class="bi bi-briefcase field-ico"></i>
                      <input v-model="form.current_job" placeholder="e.g. Property Manager" :readonly="!isEditing" />
                    </div>
                  </div>

                </div>

                <div v-if="isEditing" class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-orange px-4 fw-bold" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle-fill me-2"></i>Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Change Password -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
              <span class="fw-bold text-white">
                <i class="bi bi-shield-lock-fill me-2"></i>Change Password
              </span>
              <button class="btn btn-outline-light btn-sm px-3" @click="showPassForm = !showPassForm">
                {{ showPassForm ? 'Cancel' : 'Change' }}
              </button>
            </div>
            <div v-if="showPassForm" class="p-4">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="field-label">Current Password</label>
                  <div class="field-wrap">
                    <i class="bi bi-lock field-ico"></i>
                    <input v-model="passForm.old_pass" type="password" placeholder="Current password" />
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="field-label">New Password</label>
                  <div class="field-wrap">
                    <i class="bi bi-lock-fill field-ico"></i>
                    <input v-model="passForm.new_pass" type="password" placeholder="New password" />
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="field-label">Confirm Password</label>
                  <div class="field-wrap">
                    <i class="bi bi-lock-fill field-ico"></i>
                    <input v-model="passForm.new_pass_confirmation" type="password" placeholder="Confirm password" />
                  </div>
                </div>
                <div class="col-12">
                  <button class="btn btn-orange px-4 fw-bold" @click="changePassword" :disabled="passLoading">
                    <span v-if="passLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-shield-check me-2"></i>Update Password
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="px-4 py-3">
              <p class="text-muted small mb-0">
                <i class="bi bi-info-circle me-1"></i>
                Use a strong password with at least 8 characters including uppercase, numbers and symbols.
              </p>
            </div>
          </div>

          <!-- Photo upload -->
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="card-header-navy px-4 py-3">
              <span class="fw-bold text-white">
                <i class="bi bi-image-fill me-2"></i>Profile Photo
              </span>
            </div>
            <div class="p-4 d-flex align-items-center gap-4 flex-wrap">
              <div class="admin-avatar" style="width:64px;height:64px;font-size:1.5rem;flex-shrink:0">
                <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="avatar" />
                <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'P' }}</span>
              </div>
              <div class="flex-fill">
                <p class="fw-semibold text-navy mb-1 small">Update your profile photo</p>
                <p class="text-muted mb-0" style="font-size:.78rem">JPG or PNG. Max size 2MB.</p>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-orange btn-sm px-3 fw-bold" @click="triggerUpload" :disabled="loading">
                  <i class="bi bi-cloud-arrow-up-fill me-2"></i>Upload
                </button>
                <button v-if="user.avatar" class="btn btn-sm btn-outline-danger px-3" @click="removeAvatar" :disabled="loading">
                  <i class="bi bi-trash3-fill me-1"></i>Remove
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ── Confirm Modal ── -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="confirm-box shadow-lg">
        <div class="confirm-box-header">
          <i class="bi bi-person-check-fill me-2"></i>Confirm Update
        </div>
        <div class="confirm-box-body">
          <p class="text-muted mb-0 small">Save changes to your profile information?</p>
        </div>
        <div class="confirm-box-footer">
          <button class="btn btn-light btn-sm px-4 rounded-3" @click="showConfirmModal = false">Cancel</button>
          <button class="btn btn-orange btn-sm px-4 fw-bold" @click="confirmUpdate" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check2 me-1"></i>Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- ── Toast ── -->
    <transition name="toast-slide">
      <div v-if="toast.show" class="admin-toast" :class="toast.type">
        <i class="bi me-2"
          :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

const user            = ref(null)
const loading         = ref(false)
const passLoading     = ref(false)
const uploadingAvatar = ref(false)
const fileInput       = ref(null)
const avatarPreview   = ref(null)
const isEditing       = ref(false)
const showPassForm    = ref(false)
const showConfirmModal = ref(false)

const form     = reactive({ name: '', email: '', phone: '', gender: 1, current_job: '' })
const errors   = reactive({ name: '', email: '' })
const passForm = reactive({ old_pass: '', new_pass: '', new_pass_confirmation: '' })
const toast    = reactive({ show: false, message: '', type: 'success' })

// Provider-specific quick links
const quickLinks = [
  { to: '/provider',           label: 'Dashboard',       icon: 'bi-speedometer2',     bg: 'ql-navy',   color: '#031c36' },
  { to: '/provider/my-rooms',  label: 'My Rooms',        icon: 'bi-house-door-fill',  bg: 'ql-orange', color: '#ff5f00' },
  { to: '/provider/add-room',  label: 'Post New Room',   icon: 'bi-plus-circle-fill', bg: 'ql-green',  color: '#198754' },
  { to: '/provider/bookings',  label: 'Booking Requests',icon: 'bi-calendar-check-fill', bg: 'ql-blue', color: '#0d6efd' },
]

const showToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true
  setTimeout(() => (toast.show = false), 3000)
}

// ── Fetch user ────────────────────────────────────────────
const fetchUser = async () => {
  try {
    const res  = await api.get('/me')
    user.value = res.data?.data || res.data
    Object.assign(form, {
      name:        user.value.name        || '',
      email:       user.value.email       || '',
      phone:       user.value.phone       || '',
      gender:      user.value.gender      || 1,
      current_job: user.value.current_job || '',
    })
  } catch (err) { console.error('fetchUser error:', err) }
}

// ── Edit profile ──────────────────────────────────────────
const enableEdit = () => { isEditing.value = true }
const cancelEdit = () => {
  isEditing.value = false
  errors.name = errors.email = ''
  Object.assign(form, {
    name: user.value.name || '', email: user.value.email || '',
    phone: user.value.phone || '', gender: user.value.gender || 1,
    current_job: user.value.current_job || '',
  })
}

const validate = () => {
  errors.name = errors.email = ''
  let ok = true
  if (!form.name?.trim())  { errors.name  = 'Full name is required'; ok = false }
  if (!form.email)          { errors.email = 'Email is required'; ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Invalid email'; ok = false }
  return ok
}

const updateProfile = () => { if (!validate()) return; showConfirmModal.value = true }
const confirmUpdate = async () => {
  showConfirmModal.value = false
  loading.value = true
  try {
    await api.post('/profile/info', form)
    Object.assign(user.value, form)
    isEditing.value = false
    showToast('Profile updated successfully!')
  } catch (err) {
    showToast(err.response?.data?.message || 'Update failed', 'error')
  } finally { loading.value = false }
}

// ── Change password ────────────────────────────────────────
const changePassword = async () => {
  if (!passForm.old_pass || !passForm.new_pass || !passForm.new_pass_confirmation) {
    showToast('Please fill in all password fields', 'error'); return
  }
  if (passForm.new_pass !== passForm.new_pass_confirmation) {
    showToast('Passwords do not match', 'error'); return
  }
  passLoading.value = true
  try {
    await api.put('/profile/pass', passForm)
    showToast('Password changed successfully!')
    Object.assign(passForm, { old_pass: '', new_pass: '', new_pass_confirmation: '' })
    showPassForm.value = false
  } catch (err) {
    showToast(err.response?.data?.message || 'Password change failed', 'error')
  } finally { passLoading.value = false }
}

// ── Avatar ────────────────────────────────────────────────
const triggerUpload = () => fileInput.value?.click()

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { showToast('File too large (max 2MB)', 'error'); return }
  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData(); fd.append('image', file)
  loading.value = true; uploadingAvatar.value = true
  try {
    await api.post('/profile/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await fetchUser()
    avatarPreview.value = null
    showToast('Profile photo updated!')
  } catch (err) {
    avatarPreview.value = null
    showToast(err.response?.data?.message || 'Upload failed', 'error')
  } finally { loading.value = false; uploadingAvatar.value = false; e.target.value = '' }
}

const removeAvatar = async () => {
  if (!confirm('Remove your profile photo?')) return
  loading.value = true
  try {
    await api.delete('/profile/image')
    user.value.avatar = null; avatarPreview.value = null
    showToast('Profile photo removed')
  } catch (err) {
    showToast(err.response?.data?.message || 'Failed to remove photo', 'error')
  } finally { loading.value = false }
}

onMounted(fetchUser)
</script>

<style scoped>
/* ── Base ── */
.text-navy   { color: #031c36; }
.text-orange { color: #ff5f00; }
.card-header-navy { background: #031c36; border-bottom: 3px solid #ff5f00; }

/* ── Skeleton ── */
.skel-avatar { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skel-line   { display: block; background: linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Avatar ── */
.admin-avatar-wrap { width: 90px; height: 90px; position: relative; cursor: pointer; }
.admin-avatar {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #031c36, #0d3a6e);
  color: #fff; font-size: 2rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; border: 4px solid #fff;
  box-shadow: 0 4px 16px rgba(3,28,54,.2);
}
.admin-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-overlay-loading { position: absolute; inset: 0; background: rgba(0,0,0,.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; }

.admin-avatar-cam {
  position: absolute; bottom: 0; right: 0;
  width: 28px; height: 28px;
  background: #ff5f00; color: #fff;
  border-radius: 50%; border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .72rem; transition: background .2s, transform .2s;
}
.admin-avatar-wrap:hover .admin-avatar-cam { background: #e65600; transform: scale(1.1); }

/* ── Role badges ── */
.role-badge-provider {
  background: rgba(255,95,0,.12); color: #ff5f00;
  border: 1px solid rgba(255,95,0,.3);
  font-size: .72rem; font-weight: 800;
  padding: 4px 12px; border-radius: 20px;
  display: inline-flex; align-items: center;
}
.role-badge-id {
  background: rgba(3,28,54,.08); color: #031c36;
  font-size: .72rem; font-weight: 800;
  padding: 4px 12px; border-radius: 20px;
}

/* ── Info list ── */
.info-list  { padding: 4px 0; }
.info-item  { display: flex; align-items: flex-start; gap: 12px; padding: 12px 20px; border-bottom: 1px solid #f8f8f8; }
.info-icon  { width: 32px; height: 32px; background: rgba(255,95,0,.1); color: #ff5f00; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .85rem; flex-shrink: 0; margin-top: 2px; }
.info-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #999; margin-bottom: 2px; }
.info-value { font-size: .88rem; font-weight: 600; color: #031c36; word-break: break-word; }

/* ── Quick links ── */
.quick-link-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #031c36; border-radius: 10px; margin: 2px 4px; transition: background .18s, transform .18s; }
.quick-link-item:hover { background: #f8f9fa; transform: translateX(3px); color: #031c36; }
.ql-icon  { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .85rem; flex-shrink: 0; }
.ql-label { font-size: .85rem; font-weight: 600; flex: 1; }
.ql-blue   { background: #e7f1ff; }
.ql-orange { background: #fff4ed; }
.ql-green  { background: #e9faf1; }
.ql-navy   { background: rgba(3,28,54,.08); }

/* ── Form fields ── */
.field-label { font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #999; margin-bottom: 8px; display: block; }
.err-label   { color: #dc3545 !important; }

.field-wrap {
  display: flex; align-items: center;
  border: 1.5px solid #eef0f2; border-radius: 10px;
  background: #fafbfc; overflow: hidden;
  transition: border-color .2s, box-shadow .2s;
}
.field-wrap:focus-within             { border-color: #ff5f00; box-shadow: 0 0 0 3px rgba(255,95,0,.1); background: #fff; }
.field-wrap:focus-within .field-ico  { color: #ff5f00; }
.field-wrap.readonly-wrap            { background: #f8f9fa; border-color: #f0f0f0; }
.field-wrap.err-wrap                 { border-color: #dc3545; background: #fff8f8; }

.field-ico { padding: 0 12px; color: #bbb; font-size: .95rem; flex-shrink: 0; }
.field-wrap input,
.field-wrap select {
  flex: 1; border: none; background: transparent;
  padding: 10px 14px 10px 0;
  font-size: .88rem; color: #031c36; outline: none;
}
.field-wrap input:read-only { cursor: default; color: #666; }
.field-wrap select { cursor: pointer; }
.err-msg { color: #dc3545; font-size: .75rem; font-weight: 600; margin-top: 5px; }

/* ── Edit alert ── */
.edit-alert {
  background: rgba(255,95,0,.07);
  border: 1px solid rgba(255,95,0,.2);
  border-left: 4px solid #ff5f00;
  border-radius: 0 10px 10px 0;
  padding: 10px 16px;
  font-size: .83rem; color: #c04800; font-weight: 500;
}

/* ── Buttons ── */
.btn-orange { background: #ff5f00; color: #fff; border: none; border-radius: 10px; transition: background .2s, transform .15s; }
.btn-orange:hover:not(:disabled) { background: #e65600; transform: translateY(-1px); color: #fff; }
.btn-orange:disabled { opacity: .7; }

/* ── Confirm modal ── */
.modal-overlay    { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 9000; }
.confirm-box      { background: #fff; border-radius: 16px; overflow: hidden; width: 100%; max-width: 400px; }
.confirm-box-header { background: #031c36; color: #F4A25A; padding: 16px 24px; font-weight: 700; border-bottom: 3px solid #ff5f00; display: flex; align-items: center; }
.confirm-box-body   { padding: 20px 24px; }
.confirm-box-footer { padding: 0 24px 20px; display: flex; justify-content: flex-end; gap: 10px; }

/* ── Toast ── */
.admin-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  display: flex; align-items: center;
  padding: 12px 20px; border-radius: 12px;
  font-weight: 700; font-size: .85rem; color: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
  border-left: 4px solid rgba(255,255,255,.3);
}
.admin-toast.success { background: #031c36; }
.admin-toast.error   { background: #dc3545; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all .3s cubic-bezier(.4,0,.2,1); }
.toast-slide-enter-from, .toast-slide-leave-to       { opacity: 0; transform: translateY(20px); }
</style>