<template>
  <div class="profile-container">
    <!-- ស្គេឡេតនៃការផ្ទុក -->
    <div v-if="!user" class="skeleton-wrapper">
      <div class="skeleton-header"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>

    <!-- មាតិកាចម្បង -->
    <div v-else class="content-wrapper">
      <!-- ផ្នែកបឋម (Hero) -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="profile-header">
          <div class="avatar-section">
            <div
              class="avatar-large"
              @click="triggerFileUpload"
              :class="{ uploading: loading && uploadingAvatar }"
            >
              <img
                v-if="avatarPreview || user.avatar"
                :src="avatarPreview || user.avatar"
                alt="រូបថត"
              />
              <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
              <div v-if="loading && uploadingAvatar" class="avatar-loading">
                <div class="spinner-border spinner-border-sm"></div>
              </div>
              <div class="avatar-overlay">
                <i class="bi bi-camera-fill"></i>
              </div>
            </div>
            <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />
          </div>
          <div class="header-info">
            <h1 class="user-name">{{ user.name }}</h1>
            <p class="user-email">{{ user.email }}</p>
            <div class="badges">
              <span class="badge-role"><i class="bi bi-shield-check"></i> អ្នកគ្រប់គ្រង</span>
              <span class="badge-id">#{{ user.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ក្រឡាចត្រង្គចម្បង -->
      <div class="main-grid">
        <!-- របារនៅខាងឆ្វេង -->
        <div class="sidebar">
          <!-- កាតព័ត៌មានគណនី -->
          <div class="info-card">
            <h3 class="card-title">ព័ត៌មានគណនី</h3>
            <div class="info-items">
              <div class="info-row">
                <span class="info-label">អ៊ីមែល</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">លេខទូរស័ព្ទ</span>
                <span class="info-value">{{ user.phone || 'មិនបានកំណត់' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">ភេទ</span>
                <span class="info-value">{{
                  user.gender == 1 ? 'ប្រុស' : user.gender == 2 ? 'ស្រី' : 'មិនបានកំណត់'
                }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">មុខរបរ</span>
                <span class="info-value">{{ user.current_job || 'មិនបានកំណត់' }}</span>
              </div>
            </div>
          </div>

          <!-- ចូលប្រើរហ័ស -->
          <div class="quick-access">
            <h3 class="card-title">ចូលប្រើរហ័ស</h3>
            <div class="quick-links">
              <router-link
                v-for="link in quickLinks"
                :key="link.to"
                :to="link.to"
                class="quick-link"
              >
                <div
                  class="quick-icon"
                  :style="{ background: link.color + '15', color: link.color }"
                >
                  <i :class="['bi', link.icon]"></i>
                </div>
                <span>{{ link.label }}</span>
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- មាតិកាចម្បង -->
        <div class="main-content">
          <!-- ផ្នែកកែសម្រួលប្រវត្តិរូប -->
          <div class="section-card">
            <div class="section-header">
              <h2>កែសម្រួលប្រវត្តិរូប</h2>
              <div class="section-actions">
                <button v-if="!isEditing" @click="enableEdit" class="btn-edit">
                  <i class="bi bi-pencil"></i> កែសម្រួល
                </button>
                <button v-else @click="cancelEdit" class="btn-cancel">
                  <i class="bi bi-x"></i> បោះបង់
                </button>
              </div>
            </div>

            <form @submit.prevent="updateProfile" class="edit-form">
              <div v-if="isEditing" class="edit-notice">
                <i class="bi bi-info-circle"></i>
                <span>អ្នកនៅក្នុងរបៀបកែសម្រួល។ រក្សាទុកការផ្លាស់ប្តូររបស់អ្នកនៅពេលបញ្ចប់។</span>
              </div>

              <div class="form-group">
                <label>ឈ្មោះពេញ</label>
                <input
                  v-model="form.name"
                  type="text"
                  :readonly="!isEditing"
                  :class="{ 'is-error': errors.name }"
                />
                <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
              </div>

              <div class="form-group">
                <label>អាសយដ្ឋានអ៊ីមែល</label>
                <input
                  v-model="form.email"
                  type="email"
                  :readonly="!isEditing"
                  :class="{ 'is-error': errors.email }"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>លេខទូរស័ព្ទ</label>
                  <input v-model="form.phone" type="tel" :readonly="!isEditing" />
                </div>
                <div class="form-group">
                  <label>ភេទ</label>
                  <select v-model="form.gender" :disabled="!isEditing">
                    <option :value="1">ប្រុស</option>
                    <option :value="2">ស្រី</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>មុខរបរ</label>
                <input v-model="form.current_job" type="text" :readonly="!isEditing" />
              </div>

              <div v-if="isEditing" class="form-actions">
                <button type="submit" class="btn-save" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                  <i v-else class="bi bi-check-circle"></i>
                  រក្សាទុកការផ្លាស់ប្តូរ
                </button>
              </div>
            </form>
          </div>

          <!-- ផ្នែកសន្តិសុខ -->
          <div class="section-card">
            <div class="section-header">
              <h2>សន្តិសុខ</h2>
              <button @click="showPassForm = !showPassForm" class="btn-toggle">
                {{ showPassForm ? 'លាក់' : 'បង្ហាញ' }}
              </button>
            </div>

            <div v-show="showPassForm" class="password-form">
              <div class="form-group">
                <label>ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                <input
                  v-model="passForm.old_pass"
                  type="password"
                  placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>ពាក្យសម្ងាត់ថ្មី</label>
                  <input
                    v-model="passForm.new_pass"
                    type="password"
                    placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី"
                    @input="validatePassword"
                  />
                  <div v-if="passForm.new_pass" class="password-requirements mt-2">
                    <div :class="['requirement', { met: passwordValidation.minLength }]">
                      <i
                        :class="
                          passwordValidation.minLength ? 'bi bi-check-circle-fill' : 'bi bi-circle'
                        "
                      ></i>
                      យ៉ាងតិច ៨ តួអក្សរ
                    </div>
                    <div :class="['requirement', { met: passwordValidation.hasUppercase }]">
                      <i
                        :class="
                          passwordValidation.hasUppercase
                            ? 'bi bi-check-circle-fill'
                            : 'bi bi-circle'
                        "
                      ></i>
                      មានអក្សរធំ (A-Z)
                    </div>
                    <div :class="['requirement', { met: passwordValidation.hasLowercase }]">
                      <i
                        :class="
                          passwordValidation.hasLowercase
                            ? 'bi bi-check-circle-fill'
                            : 'bi bi-circle'
                        "
                      ></i>
                      មានអក្សរតូច (a-z)
                    </div>
                    <div :class="['requirement', { met: passwordValidation.hasNumber }]">
                      <i
                        :class="
                          passwordValidation.hasNumber ? 'bi bi-check-circle-fill' : 'bi bi-circle'
                        "
                      ></i>
                      មានលេខ (0-9)
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>បញ្ជាក់ពាក្យសម្ងាត់</label>
                  <input
                    v-model="passForm.new_pass_confirmation"
                    type="password"
                    placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                    :class="{
                      'input-error':
                        passForm.new_pass_confirmation &&
                        passForm.new_pass !== passForm.new_pass_confirmation,
                    }"
                  />
                  <span
                    v-if="
                      passForm.new_pass_confirmation &&
                      passForm.new_pass !== passForm.new_pass_confirmation
                    "
                    class="error-text mt-2"
                  >
                    <i class="bi bi-exclamation-circle-fill me-1"></i>
                    ពាក្យសម្ងាត់មិនដូចគ្នា
                  </span>
                </div>
              </div>

              <button
                @click="changePassword"
                class="btn-save"
                :disabled="
                  passLoading ||
                  !isPasswordValid ||
                  passForm.new_pass !== passForm.new_pass_confirmation
                "
              >
                <span v-if="passLoading" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-check-circle"></i>
                ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់
              </button>

              <p class="password-hint">
                <i class="bi bi-shield-check"></i>
                ប្រើពាក្យសម្ងាត់ខ្លាំងដែលមានយ៉ាងតិច ៨ តួអក្សរ រួមមានអក្សរធំ លេខ និងនិមិត្តសញ្ញា។
              </p>
            </div>

            <div v-show="!showPassForm" class="empty-state">
              <i class="bi bi-lock"></i>
              <p>ចុច "បង្ហាញ" ដើម្បីផ្លាស់ប្តូរពាក្យសម្ងាត់របស់អ្នក</p>
            </div>
          </div>

          <!-- ផ្នែករូបថតប្រវត្តិរូប -->
          <div class="section-card">
            <div class="section-header">
              <h2>រូបថតប្រវត្តិរូប</h2>
            </div>

            <div class="photo-section">
              <div class="photo-preview">
                <div class="avatar-medium">
                  <img
                    v-if="avatarPreview || user.avatar"
                    :src="avatarPreview || user.avatar"
                    alt="រូបថត"
                  />
                  <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
                </div>
                <div class="photo-info">
                  <p class="photo-title">ធ្វើបច្ចុប្បន្នភាពរូបថតប្រវត្តិរូបរបស់អ្នក</p>
                  <p class="photo-hint">ទ្រង់ទ្រាយ JPG ឬ PNG អតិបរមា ២MB</p>
                </div>
              </div>
              <div class="photo-actions">
                <button @click="triggerFileUpload" class="btn-upload" :disabled="loading">
                  <i class="bi bi-cloud-upload"></i> បញ្ចូល
                </button>
                <button
                  v-if="user.avatar"
                  @click="removeAvatar"
                  class="btn-delete"
                  :disabled="loading"
                >
                  <i class="bi bi-trash3"></i> លុបចេញ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal បញ្ជាក់ -->
    <div v-if="showConfirmModal" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>បញ្ជាក់ការផ្លាស់ប្តូរ</h3>
          <button @click="showConfirmModal = false" class="btn-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>តើអ្នកប្រាកដថាចង់រក្សាទុកការផ្លាស់ប្តូរប្រវត្តិរូបទាំងនេះទេ?</p>
        </div>
        <div class="modal-footer">
          <button @click="showConfirmModal = false" class="btn-secondary">បោះបង់</button>
          <button @click="confirmUpdate" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check"></i> បញ្ជាក់
          </button>
        </div>
      </div>
    </div>

    <!-- ការជូនដំណឹង Toast -->
    <transition name="toast-fade">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <i
          :class="
            toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'
          "
        ></i>
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

const user = ref(null)
const loading = ref(false)
const passLoading = ref(false)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const isEditing = ref(false)
const showPassForm = ref(false)
const showConfirmModal = ref(false)

const form = reactive({ name: '', email: '', phone: '', gender: 1, current_job: '' })
const errors = reactive({ name: '', email: '' })
const passForm = reactive({ old_pass: '', new_pass: '', new_pass_confirmation: '' })
const toast = reactive({ show: false, message: '', type: 'success' })

const todayDate = new Date().toLocaleDateString('km-KH', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

// Password validation
const passwordValidation = reactive({
  minLength: false,
  hasUppercase: false,
  hasLowercase: false,
  hasNumber: false,
})

const validatePassword = () => {
  const pass = passForm.new_pass
  passwordValidation.minLength = pass.length >= 8
  passwordValidation.hasUppercase = /[A-Z]/.test(pass)
  passwordValidation.hasLowercase = /[a-z]/.test(pass)
  passwordValidation.hasNumber = /[0-9]/.test(pass)
}

const isPasswordValid = computed(() => {
  return (
    passwordValidation.minLength &&
    passwordValidation.hasUppercase &&
    passwordValidation.hasLowercase &&
    passwordValidation.hasNumber
  )
})

const quickLinks = [
  {
    to: '/admin/manage',
    label: 'គ្រប់គ្រងអ្នកប្រើ',
    sub: 'មើល និងកំណត់តួនាទី',
    icon: 'bi-people-fill',
    bg: 'bg-primary-light',
    color: '#0d6efd',
  },
  {
    to: '/admin/room-options',
    label: 'ជម្រើសបន្ទប់',
    sub: 'គ្រឿងសម្ភារៈ និងសេវាកម្ម',
    icon: 'bi-ui-checks',
    bg: 'bg-orange-light',
    color: '#ff5f00',
  },
  {
    to: '/admin/locations',
    label: 'ខណ្ឌ',
    sub: 'គ្រប់គ្រងទីតាំង',
    icon: 'bi-geo-alt-fill',
    bg: 'bg-success-light',
    color: '#198754',
  },
  {
    to: '/admin/dashboard',
    label: 'ផ្ទាំងគ្រប់គ្រង',
    sub: 'ទិដ្ឋភាពទូទៅ',
    icon: 'bi-speedometer2',
    bg: 'bg-purple-light',
    color: '#8b5cf6',
  },
]

const showToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => (toast.show = false), 3000)
}

// ── Fetch user ─────────────────────────────────────────────
const fetchUser = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data?.data || res.data
    // ✅ Sync to auth store so navbar updates immediately
    authStore.user = { ...authStore.user, ...user.value }
    Object.assign(form, {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      gender: user.value.gender || 1,
      current_job: user.value.current_job || '',
    })
  } catch (err) {
    console.error('fetchUser error:', err)
  }
}

// ── Edit profile ───────────────────────────────────────────
const enableEdit = () => {
  isEditing.value = true
}
const cancelEdit = () => {
  isEditing.value = false
  errors.name = errors.email = ''
  Object.assign(form, {
    name: user.value.name || '',
    email: user.value.email || '',
    phone: user.value.phone || '',
    gender: user.value.gender || 1,
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

const updateProfile = () => {
  if (!validate()) return
  showConfirmModal.value = true
}

const confirmUpdate = async () => {
  showConfirmModal.value = false
  loading.value = true
  try {
    await api.post('/profile/info', form)
    Object.assign(user.value, form)
    authStore.user = { ...authStore.user, ...form }
    isEditing.value = false
    showToast('បានកែប្រែប្រវត្តិរូបជោគជ័យ!')
  } catch (err) {
    showToast(err.response?.data?.message || 'កែប្រែបរាជ័យ', 'error')
  } finally {
    loading.value = false
  }
}

// ── Change password ────────────────────────────────────────
const changePassword = async () => {
  if (!passForm.old_pass || !passForm.new_pass || !passForm.new_pass_confirmation) {
    showToast('សូមបំពេញវាលពាក្យសម្ងាត់ទាំងអស់', 'error')
    return
  }

  // Validate password strength
  if (!isPasswordValid.value) {
    showToast('ពាក្យសម្ងាត់មិនបានឆ្លងកាត់តម្រូវការលម្អិត', 'error')
    return
  }

  if (passForm.new_pass !== passForm.new_pass_confirmation) {
    showToast('ពាក្យសម្ងាត់មិនដូចគ្នា', 'error')
    return
  }

  passLoading.value = true
  try {
    await api.put('/profile/pass', passForm)
    showToast('បានប្តូរពាក្យសម្ងាត់ជោគជ័យ!')
    Object.assign(passForm, { old_pass: '', new_pass: '', new_pass_confirmation: '' })
    Object.assign(passwordValidation, {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
    })
    showPassForm.value = false
  } catch (err) {
    showToast(err.response?.data?.message || 'ប្តូរពាក្យសម្ងាត់បរាជ័យ', 'error')
  } finally {
    passLoading.value = false
  }
}

// ── Avatar ─────────────────────────────────────────────────
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
/* ── Layout ── */
.profile-container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 24px 16px;
}

.skeleton-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-header,
.skeleton-card {
  background: #fff;
  border-radius: 12px;
  height: 200px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Hero Section ── */
.hero-section {
  position: relative;
  margin-bottom: 40px;
}

.hero-bg {
  background: linear-gradient(135deg, #031c36 0%, #0d3a6e 100%);
  height: 200px;
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
}

.hero-bg::before {
  content: '';
  position: absolute;
  top: 0;
  right: -50px;
  width: 300px;
  height: 300px;
  background: rgba(255, 95, 0, 0.1);
  border-radius: 50%;
}

.profile-header {
  background: #fff;
  border-radius: 0 0 16px 16px;
  padding: 0 32px 32px;
  display: flex;
  gap: 32px;
  align-items: flex-start;
  transform: translateY(-80px);
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-large {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #031c36, #0d3a6e);
  color: #fff;
  font-size: 3rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 6px solid #fff;
  box-shadow: 0 8px 24px rgba(3, 28, 54, 0.2);
  cursor: pointer;
  position: relative;
  transition: transform 0.3s;
}

.avatar-large:hover {
  transform: scale(1.05);
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  transition: all 0.3s;
  opacity: 0;
}

.avatar-large:hover .avatar-overlay {
  background: rgba(0, 0, 0, 0.4);
  opacity: 1;
}

.avatar-loading {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.header-info {
  flex: 1;
  padding-top: 24px;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  color: #031c36;
  margin-bottom: 4px;
}

.user-email {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 12px;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge-role,
.badge-id {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-role {
  background: rgba(255, 95, 0, 0.1);
  color: #ff5f00;
  border: 1px solid rgba(255, 95, 0, 0.2);
}

.badge-id {
  background: rgba(3, 28, 54, 0.08);
  color: #031c36;
}

/* ── Main Grid ── */
.main-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px;
  }
}

/* ── Sidebar ── */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.quick-access {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #031c36;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #031c36;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #031c36;
  transition: all 0.2s;
  font-size: 0.9rem;
  font-weight: 500;
}

.quick-link:hover {
  background: #f0f4f8;
  transform: translateX(4px);
  color: #031c36;
}

.quick-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.quick-link i:last-child {
  margin-left: auto;
  font-size: 0.75rem;
  color: #ccc;
}

/* ── Main Content ── */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #031c36;
  margin: 0;
}

.section-actions,
.section-header button {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-cancel,
.btn-toggle,
.btn-save,
.btn-delete,
.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #031c36;
  color: #fff;
}

.btn-edit:hover {
  background: #052d5a;
}

.btn-cancel {
  background: #f0f0f0;
  color: #031c36;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-toggle {
  background: transparent;
  color: #ff5f00;
  font-weight: 600;
}

.btn-toggle:hover {
  background: rgba(255, 95, 0, 0.1);
}

.btn-save {
  background: #ff5f00;
  color: #fff;
}

.btn-save:hover:not(:disabled) {
  background: #e65600;
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-upload {
  background: #ff5f00;
  color: #fff;
}

.btn-upload:hover:not(:disabled) {
  background: #e65600;
}

.btn-delete {
  background: #f5f5f5;
  color: #dc3545;
}

.btn-delete:hover:not(:disabled) {
  background: #ffe0e0;
}

.btn-close {
  background: none;
  border: none;
  color: #031c36;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

/* ── Forms ── */
.edit-notice {
  background: rgba(255, 95, 0, 0.1);
  border-left: 4px solid #ff5f00;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #ff5f00;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #031c36;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #ff5f00;
  box-shadow: 0 0 0 3px rgba(255, 95, 0, 0.1);
}

.form-group input:readonly {
  background: #f8f8f8;
  color: #666;
}

.form-group input.is-error {
  border-color: #dc3545;
}

.error-text {
  font-size: 0.8rem;
  color: #dc3545;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

/* ── Password Form ── */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
}

.password-hint {
  font-size: 0.85rem;
  color: #666;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.password-requirements {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #999;
  transition: all 0.2s;
}

.requirement.met {
  color: #198754;
  font-weight: 600;
}

.requirement i {
  font-size: 1rem;
}

.input-error {
  border-color: #dc3545 !important;
  background-color: rgba(220, 53, 69, 0.05) !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 0.9rem;
}

/* ── Photo Section ── */
.photo-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 12px;
}

.photo-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.avatar-medium {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #031c36, #0d3a6e);
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(3, 28, 54, 0.2);
  flex-shrink: 0;
}

.avatar-medium img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-info {
  flex: 1;
}

.photo-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #031c36;
  margin: 0 0 4px;
}

.photo-hint {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

.photo-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 640px) {
  .photo-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .photo-actions {
    width: 100%;
  }

  .btn-upload,
  .btn-delete {
    flex: 1;
    justify-content: center;
  }
}

/* ── Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 16px;
}

.modal-dialog {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background: #031c36;
  color: #fff;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.modal-body {
  padding: 24px;
  color: #666;
  font-size: 0.95rem;
}

.modal-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
}

.btn-secondary {
  background: #f0f0f0;
  color: #031c36;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #ff5f00;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary:hover:not(:disabled) {
  background: #e65600;
}

.btn-primary:disabled {
  opacity: 0.6;
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
  padding: 14px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.toast-notification.success {
  background: linear-gradient(135deg, #031c36, #0d3a6e);
}

.toast-notification.error {
  background: linear-gradient(135deg, #dc3545, #ff6b6b);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hero-section {
    margin-bottom: 32px;
  }

  .profile-header {
    gap: 24px;
    padding: 0 24px 24px;
  }
}

@media (max-width: 640px) {
  .profile-container {
    padding: 16px 12px;
  }

  .hero-bg {
    height: 120px;
  }

  .avatar-large {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .section-card {
    padding: 16px;
  }

  .main-grid {
    margin-top: 16px;
  }
}
</style>
