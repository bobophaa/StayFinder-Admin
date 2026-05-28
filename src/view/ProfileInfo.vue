<template>
  <div class="profile-container">
    <!-- skeleton -->
    <div v-if="!user" class="skeleton-wrapper">
      <div class="skeleton-sidebar"></div>
      <div class="skeleton-main">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
    </div>

    <!-- main content -->
    <div v-else class="content-wrapper">
      <h1 class="page-title">ព័ត៌មានគណនី</h1>

      <div class="layout-grid">
        <!-- ── LEFT SIDEBAR CARD ── -->
        <div class="sidebar-card">
          <!-- dark header with avatar -->
          <div class="card-header-dark">
            <div class="avatar-wrap" @click="triggerFileUpload">
              <div class="avatar" :class="{ uploading: loading && uploadingAvatar }">
                <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="avatar" />
                <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
                <div v-if="loading && uploadingAvatar" class="avatar-loading">
                  <div class="spinner-border spinner-border-sm"></div>
                </div>
              </div>
              <button class="camera-btn" @click.stop="triggerFileUpload">
                <i class="bi bi-camera-fill"></i>
              </button>
            </div>
            <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />
          </div>

          <!-- name / email / badge -->
          <div class="card-body-center">
            <p class="sidebar-name">{{ user.name }}</p>
            <p class="sidebar-email">{{ user.email }}</p>
            <span class="badge-provider">អ្នកផ្ដល់សេវាកម្ម</span>
          </div>

          <!-- info rows -->
          <div class="sidebar-info">
            <div class="info-row">
              <span class="info-label">អ៊ីមែល</span>
              <span class="info-value">{{ user.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ទូរស័ព្ទ</span>
              <span class="info-value">{{ user.phone || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ភេទ</span>
              <span class="info-value">
                {{ user.gender == 1 ? 'ប្រុស' : user.gender == 2 ? 'ស្រី' : 'មិនបានកំណត់' }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">កាតាលច្បាប់</span>
              <span class="info-value">{{ user.current_job || 'Provider' }}</span>
            </div>
          </div>
        </div>

        <!-- ── RIGHT CONTENT ── -->
        <div class="right-content">

          <!-- Account Info Card -->
          <div class="section-card">
            <div class="section-header">
              <h2>គតិមានគណនី</h2>
              <div class="header-actions">
                <button v-if="!isEditing" @click="enableEdit" class="btn-outline">កែប្រែ</button>
                <template v-else>
                  <button @click="cancelEdit" class="btn-ghost">បោះបង់</button>
                  <button @click="updateProfile" class="btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                    <i v-else class="bi bi-check-circle"></i>
                    រក្សាទុក
                  </button>
                </template>
              </div>
            </div>

            <div v-if="isEditing" class="edit-notice">
              <i class="bi bi-info-circle"></i>
              <span>អ្នកនៅក្នុងរបៀបកែសម្រួល។ រក្សាទុកការផ្លាស់ប្តូររបស់អ្នកនៅពេលបញ្ចប់។</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>ឈ្មោះពេញ</label>
                <input v-model="form.name" type="text" :readonly="!isEditing" :class="{ 'is-error': errors.name }" />
                <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label>អ៊ីមែល</label>
                <input v-model="form.email" type="email" :readonly="!isEditing" :class="{ 'is-error': errors.email }" />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label>ទូរស័ព្ទ</label>
                <input v-model="form.phone" type="tel" :readonly="!isEditing" placeholder="បញ្ចូលទូរស័ព្ទរបស់អ្នក" />
              </div>
              <div class="form-group">
                <label>ភេទ</label>
                <select v-model.number="form.gender" :disabled="!isEditing">
                  <option :value="1">ប្រុស</option>
                  <option :value="2">ស្រី</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>កាតាលច្បាប់</label>
                <input v-model="form.current_job" type="text" :readonly="!isEditing" />
              </div>
            </div>
          </div>

          <!-- Change Password Card -->
          <div class="section-card">
            <div class="section-header">
              <h2>ផ្លាស់ប្រការសម្ងាត់កាតសសម្ងាត់</h2>
              <button @click="showPassForm = !showPassForm" class="btn-outline">
                {{ showPassForm ? 'លាក់' : 'ផ្លាស់ប្តូរ' }}
              </button>
            </div>

            <div v-if="!showPassForm" class="pass-hint-text">
              <i class="bi bi-shield-check"></i>
              ប្រើពាក្យសម្ងាត់ខ្លាំងដែលមានយ៉ាងតិច ៨ តួអក្សរ រួមមានអក្សរធំ លេខ និងនិមិត្តសញ្ញា។
            </div>

            <div v-if="showPassForm" class="password-form">
              <div class="form-group full-width">
                <label>ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                <input v-model="passForm.old_pass" type="password" placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន" />
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>ពាក្យសម្ងាត់ថ្មី</label>
                  <input v-model="passForm.new_pass" type="password" placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី" />
                </div>
                <div class="form-group">
                  <label>បញ្ជាក់ពាក្យសម្ងាត់</label>
                  <input v-model="passForm.new_pass_confirmation" type="password" placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី" />
                </div>
              </div>
              <div class="pass-actions">
                <button @click="changePassword" class="btn-primary" :disabled="passLoading">
                  <span v-if="passLoading" class="spinner-border spinner-border-sm"></span>
                  <i v-else class="bi bi-check-circle"></i>
                  ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់
                </button>
              </div>
              <p class="password-hint">
                <i class="bi bi-shield-check"></i>
                ប្រើពាក្យសម្ងាត់ខ្លាំងដែលមានយ៉ាងតិច ៨ តួអក្សរ រួមមានអក្សរធំ លេខ និងនិមិត្តសញ្ញា។
              </p>
            </div>
          </div>

          <!-- Profile Photo Card -->
          <div class="section-card">
            <div class="section-header">
              <h2>រូបថតប្រវត្តិរូប</h2>
            </div>
            <div class="photo-row">
              <div class="avatar-sm">
                <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="avatar" />
                <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
              </div>
              <div class="photo-info">
                <p class="photo-title">ធ្វើបច្ចុប្បន្នភាពរូបថតប្រវត្តិរូបរបស់អ្នក</p>
                <p class="photo-sub">ទ្រង់ទ្រាយ JPG ឬ PNG អតិបរមា ២MB</p>
              </div>
              <div class="photo-btns">
                <button @click="triggerFileUpload" class="btn-primary" :disabled="loading">
                  <i class="bi bi-cloud-upload"></i> បញ្ចូល
                </button>
                <button v-if="user.avatar" @click="removeAvatar" class="btn-danger" :disabled="loading">
                  <i class="bi bi-trash3"></i> លុបចេញ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>បញ្ជាក់ការផ្លាស់ប្តូរ</h3>
          <button @click="showConfirmModal = false" class="btn-close"><i class="bi bi-x"></i></button>
        </div>
        <div class="modal-body">
          <p>តើអ្នកប្រាកដថាចង់រក្សាទុកការផ្លាស់ប្តូរប្រវត្តិរូបទាំងនេះទេ?</p>
        </div>
        <div class="modal-footer">
          <button @click="showConfirmModal = false" class="btn-ghost">បោះបង់</button>
          <button @click="confirmUpdate" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check"></i> បញ្ជាក់
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-fade">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'"></i>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import api from '@/api/http'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const user             = ref(null)
const loading          = ref(false)
const passLoading      = ref(false)
const uploadingAvatar  = ref(false)
const fileInput        = ref(null)
const avatarPreview    = ref(null)
const isEditing        = ref(false)
const showPassForm     = ref(false)
const showConfirmModal = ref(false)

const form = reactive({ name: '', email: '', phone: '', gender: 1, current_job: '' })
const errors = reactive({ name: '', email: '' })
const passForm = reactive({ old_pass: '', new_pass: '', new_pass_confirmation: '' })
const toast = reactive({ show: false, message: '', type: 'success' })

const showToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => (toast.show = false), 3000)
}

const fetchUser = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data?.data || res.data
    authStore.user = { ...authStore.user, ...user.value }
    Object.assign(form, {
      name:        user.value.name        || '',
      email:       user.value.email       || '',
      phone:       user.value.phone       || '',
      gender:      user.value.gender      ?? 1,
      current_job: user.value.current_job || '',
    })
  } catch (err) {
    console.error('fetchUser error:', err)
  }
}

const enableEdit = () => { isEditing.value = true }
const cancelEdit = () => {
  isEditing.value = false
  errors.name = errors.email = ''
  Object.assign(form, {
    name:        user.value.name        || '',
    email:       user.value.email       || '',
    phone:       user.value.phone       || '',
    gender:      user.value.gender      ?? 1,
    current_job: user.value.current_job || '',
  })
}

const validate = () => {
  errors.name = errors.email = ''
  let ok = true
  if (!form.name?.trim()) {
    errors.name = 'ត្រូវការឈ្មោះពេញ'
    ok = false
  }
  if (!form.email) {
    errors.email = 'ត្រូវការអ៊ីមែល'
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'អ៊ីមែលមិនត្រឹមត្រូវ'
    ok = false
  }
  return ok
}

const updateProfile = async () => {
  if (!validate()) return
  loading.value = true
  try {
    await api.post('/profile/info', form)
    Object.assign(user.value, { ...form })
    authStore.user = { ...authStore.user, ...form }
    isEditing.value = false
    showToast('បានកែប្រែប្រវត្តិរូបជោគជ័យ!')
  } catch (err) {
    showToast(err.response?.data?.message || 'កែប្រែបរាជ័យ', 'error')
  } finally {
    loading.value = false
  }
}

// kept for modal confirm button (still used in modal footer)
const confirmUpdate = async () => {
  showConfirmModal.value = false
  await updateProfile()
}

const changePassword = async () => {

  if (!passForm.old_pass) {
    return showToast('សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន', 'error')
  }

  if (!passForm.new_pass) {
    return showToast('សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី', 'error')
  }

  if (passForm.new_pass !== passForm.new_pass_confirmation) {
    return showToast('ការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នា', 'error')
  }

  passLoading.value = true

  try {

    const res = await api.put('/profile/pass', passForm)

   if (res.data.result === false) {

  let msg = 'ប្តូរពាក្យសម្ងាត់បរាជ័យ'

  
  if (res.data.message === 'Wrong old password.') {
    msg = 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ'
  }

  showToast(msg, 'error')

  return
}

    showToast('បានប្តូរពាក្យសម្ងាត់ជោគជ័យ!')

    Object.assign(passForm, {
      old_pass: '',
      new_pass: '',
      new_pass_confirmation: ''
    })

    showPassForm.value = false

  } catch (err) {

    showToast(
      err.response?.data?.message || 'Server Error',
      'error'
    )

  } finally {

    passLoading.value = false

  }
}

const triggerFileUpload = () => fileInput.value?.click()

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    showToast('ឯកសារធំពេក (អតិបរមា ២MB)', 'error')
    return
  }
  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData()
  fd.append('image', file)
  loading.value = true
  uploadingAvatar.value = true
  try {
    await api.post('/profile/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await fetchUser()
    avatarPreview.value = null
    showToast('បានធ្វើបច្ចុប្បន្នភាពរូបថតប្រវត្តិរូប!')
  } catch (err) {
    avatarPreview.value = null
    showToast(err.response?.data?.message || 'ផ្ទុកឡើងបរាជ័យ', 'error')
  } finally {
    loading.value = false
    uploadingAvatar.value = false
    e.target.value = ''
  }
}

const removeAvatar = async () => {
  if (!confirm('លុបចេញរូបថតប្រវត្តិរូបរបស់អ្នក?')) return
  loading.value = true
  try {
    await api.delete('/profile/image')
    user.value.avatar = null
    avatarPreview.value = null
    authStore.user = { ...authStore.user, avatar: null }
    showToast('បានលុបរូបថតប្រវត្តិរូប')
  } catch (err) {
    showToast(err.response?.data?.message || 'លុបរូបថតបរាជ័យ', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(fetchUser)
</script>

<style scoped>
/* ── Base ── */
.profile-container {
  background: #f0f2f5;
  min-height: 100vh;
  padding: 28px 24px;
  font-family: inherit;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 24px;
}

/* ── Skeleton ── */
.skeleton-wrapper {
  display: flex;
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}
.skeleton-sidebar {
  width: 260px;
  min-width: 260px;
  height: 420px;
  background: #fff;
  border-radius: 12px;
  animation: pulse 1.5s infinite;
}
.skeleton-main { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.skeleton-card { background: #fff; border-radius: 12px; height: 200px; animation: pulse 1.5s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Layout ── */
.content-wrapper { max-width: 1100px; margin: 0 auto; }

.layout-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 768px) {
  .layout-grid { grid-template-columns: 1fr; }
}

/* ── Sidebar Card ── */
.sidebar-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}

.card-header-dark {
  background: linear-gradient(135deg, #1a2744 0%, #0d2452 100%);
  height: 110px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0;
  position: relative;
}

.avatar-wrap {
  position: relative;
  cursor: pointer;
  margin-bottom: -36px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: linear-gradient(135deg, #1a2744, #0d3a8e);
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-loading {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.camera-btn {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff5f00;
  color: #fff;
  border: 2px solid #fff;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.camera-btn:hover { background: #e65600; }

.card-body-center {
  text-align: center;
  padding: 48px 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px;
}

.sidebar-email {
  font-size: 0.8rem;
  color: #888;
  margin: 0 0 12px;
}

.badge-provider {
  display: inline-block;
  background: rgba(255, 95, 0, 0.1);
  color: #ff5f00;
  border: 1px solid rgba(255, 95, 0, 0.25);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
}

.sidebar-info {
  padding: 8px 20px 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  gap: 8px;
}

.info-row:last-child { border-bottom: none; }

.info-label {
  font-size: 0.78rem;
  color: #aaa;
  font-weight: 500;
  white-space: nowrap;
}

.info-value {
  font-size: 0.82rem;
  color: #333;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

/* ── Right Content ── */
.right-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: #ff5f00;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #e65600; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: transparent;
  color: #1a1a2e;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: #aaa; background: #f5f5f5; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: #f0f0f0;
  color: #555;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { background: #e0e0e0; }

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff0f0;
  color: #dc3545;
  border: 1.5px solid #f5c6cb;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-danger:hover:not(:disabled) { background: #ffe0e0; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Edit Notice ── */
.edit-notice {
  background: rgba(255, 95, 0, 0.08);
  border-left: 3px solid #ff5f00;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: #ff5f00;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Form Grid ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width { grid-column: 1 / -1; }

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  padding: 9px 12px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  color: #333;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input[readonly],
.form-group input:read-only,
.form-group select:disabled {
  background: #fafafa;
  color: #777;
  cursor: default;
  border-color: #efefef;
}

.form-group input:not([readonly]):focus,
.form-group select:not(:disabled):focus {
  outline: none;
  border-color: #ff5f00;
  box-shadow: 0 0 0 3px rgba(255, 95, 0, 0.1);
}

.form-group input.is-error { border-color: #dc3545; }
.error-text { font-size: 0.75rem; color: #dc3545; margin-top: 4px; }

/* ── Password ── */
.pass-hint-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #888;
  padding: 4px 0;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
}

.pass-actions { display: flex; justify-content: flex-end; }

.password-hint {
  font-size: 0.8rem;
  color: #888;
  background: #f8f9fa;
  padding: 10px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

/* ── Photo Section ── */
.photo-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.avatar-sm {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a2744, #0d3a8e);
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.avatar-sm img { width: 100%; height: 100%; object-fit: cover; }

.photo-info { flex: 1; }
.photo-title { font-size: 0.9rem; font-weight: 600; color: #1a1a2e; margin: 0 0 4px; }
.photo-sub { font-size: 0.78rem; color: #aaa; margin: 0; }

.photo-btns { display: flex; gap: 10px; flex-wrap: wrap; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 16px;
}

.modal-dialog {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: slideUp 0.25s ease-out;
  overflow: hidden;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.modal-header {
  background: #1a2744;
  color: #fff;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 { font-size: 1rem; font-weight: 700; margin: 0; }

.btn-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
}
.btn-close:hover { opacity: 1; }

.modal-body { padding: 24px; color: #555; font-size: 0.9rem; }
.modal-footer {
  padding: 14px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
}

/* ── Toast ── */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.toast-notification.success { background: linear-gradient(135deg, #1a2744, #0d3a8e); }
.toast-notification.error   { background: linear-gradient(135deg, #dc3545, #ff6b6b); }

.toast-fade-enter-active,
.toast-fade-leave-active { transition: all 0.3s ease; }
.toast-fade-enter-from,
.toast-fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
