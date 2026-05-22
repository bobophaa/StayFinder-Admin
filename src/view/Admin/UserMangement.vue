<template>
  <div class="admin-dashboard p-4">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-navy mb-1">គ្រប់គ្រងអ្នកប្រើប្រាស់</h2>
        <p class="text-muted mb-0">មើល និងកំណត់តួនាទីអ្នកប្រើប្រាស់ទាំងអស់</p>
      </div>
      <span class="badge bg-orange px-3 py-2 rounded-pill">
        <i class="bi bi-people-fill me-1"></i>{{ pagination.total }} អ្នកប្រើសរុប
      </span>
    </div>

    <!-- Main Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <!-- <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
        <span class="fw-bold text-white"><i class="bi bi-people-fill me-2"></i>បញ្ជីអ្នកប្រើប្រាស់</span>
        <span class="badge bg-orange rounded-pill px-3">ទំព័រ {{ pagination.currentPage }}/{{ pagination.lastPage }}</span>
      </div> -->

      <!-- Skeleton -->
      <div v-if="loading" class="p-4">
        <div v-for="i in perPage" :key="i" class="d-flex align-items-center gap-3 mb-3 py-2">
          <div class="skeleton-circle" style="width: 45px; height: 45px; flex-shrink: 0"></div>
          <div class="flex-fill">
            <div
              class="skeleton-line mb-2"
              style="width: 40%; height: 14px; border-radius: 6px"
            ></div>
            <div class="skeleton-line" style="width: 60%; height: 12px; border-radius: 6px"></div>
          </div>
          <div class="skeleton-line" style="width: 80px; height: 28px; border-radius: 20px"></div>
          <div class="skeleton-line" style="width: 60px; height: 28px; border-radius: 20px"></div>
          <div class="skeleton-line" style="width: 90px; height: 28px; border-radius: 20px"></div>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4">ID</th>
              <th>ព័ត៌មានអ្នកប្រើ</th>
              <th>មុខរបរ</th>
              <th>តួនាទី</th>
              <th>បានបង្កើតនៅ</th>
              <th class="text-center pe-4">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="ps-4 text-muted small fw-semibold">#{{ user.id }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="user-avatar">
                    <img v-if="user.avatar" :src="user.avatar" alt="avatar" />
                    <span v-else>{{ user.name?.charAt(0)?.toUpperCase() }}</span>
                  </div>
                  <div>
                    <div class="fw-bold small text-navy">{{ user.name }}</div>
                    <div class="text-muted" style="font-size: 0.75rem">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="small text-muted">{{ user.current_job || 'មិនមាន' }}</td>
              <td>
                <span :class="getRoleBadge(user.roles[0]?.name)">
                  {{ user.roles[0]?.name || 'គ្មានតួនាទី' }}
                </span>
              </td>
              <td class="small text-muted">
                {{
                  new Date(user.created_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                }}
              </td>
              <td class="text-center pe-4">
                <button
                  @click="openRoleModal(user)"
                  class="btn btn-sm btn-outline-navy rounded-pill px-3"
                >
                  <i class="bi bi-person-gear me-1"></i>កំណត់តួនាទី
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="bi bi-people d-block mb-2" style="font-size: 2rem; opacity: 0.2"></i>
                មិនមានអ្នកប្រើប្រាស់
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2 border-top"
      >
        <small class="text-muted">
          បង្ហាញ {{ rangeStart }}–{{ rangeEnd }} នៃ {{ pagination.total }} អ្នកប្រើ
        </small>
        <div class="d-flex gap-1">
          <!-- Prev -->
          <button
            class="page-btn"
            :disabled="pagination.currentPage === 1"
            @click="goToPage(pagination.currentPage - 1)"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <!-- Page numbers -->
          <button
            v-for="p in pageNumbers"
            :key="p"
            class="page-btn"
            :class="{
              'page-btn-active': p === pagination.currentPage,
              'page-btn-ellipsis': p === '…',
            }"
            :disabled="p === '…'"
            @click="p !== '…' && goToPage(p)"
          >
            {{ p }}
          </button>
          <!-- Next -->
          <button
            class="page-btn"
            :disabled="pagination.currentPage === pagination.lastPage"
            @click="goToPage(pagination.currentPage + 1)"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Set Role Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="confirm-box shadow-lg">
        <div class="confirm-box-header">
          <i class="bi bi-person-gear me-2"></i>កំណត់តួនាទីអ្នកប្រើ
        </div>
        <div class="confirm-box-body">
          <p class="text-muted small mb-3">
            កំពុងធ្វើបច្ចុប្បន្នភាពតួនាទីសម្រាប់៖
            <strong class="text-navy">{{ selectedUser?.name }}</strong>
          </p>
          <label class="field-label">តួនាទីថ្មី</label>
          <div class="field-wrap">
            <i class="bi bi-shield-check field-ico"></i>
            <select v-model="newRoleId">
              <option value="1">អ្នកប្រើប្រាស់</option>
              <option value="2">ម្ចាស់ផ្ទះជួល</option>
              <option value="3">អ្នកគ្រប់គ្រង</option>
            </select>
          </div>
        </div>
        <div class="confirm-box-footer">
          <button class="btn btn-light btn-sm px-4 rounded-3" @click="showModal = false">
            បោះបង់
          </button>
          <button
            class="btn btn-orange btn-sm px-4 fw-bold"
            @click="handleSetRole"
            :disabled="isUpdating"
          >
            <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check2 me-1"></i>ធ្វើបច្ចុប្បន្នភាព
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-slide">
      <div v-if="toast.show" class="admin-toast" :class="toast.type">
        <i
          class="bi me-2"
          :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"
        ></i>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/http'

const users = ref([])
const loading = ref(false)
const showModal = ref(false)
const isUpdating = ref(false)
const selectedUser = ref(null)
const newRoleId = ref('')
const perPage = 50

const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage })
const toast = ref({ show: false, message: '', type: 'success' })

// ── Computed ───────────────────────────────────────────────
const rangeStart = computed(() => (pagination.value.currentPage - 1) * perPage + 1)
const rangeEnd = computed(() =>
  Math.min(pagination.value.currentPage * perPage, pagination.value.total),
)

const pageNumbers = computed(() => {
  const total = pagination.value.lastPage
  const current = pagination.value.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '…', total)
  } else if (current >= total - 3) {
    pages.push(1, '…', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '…', current - 1, current, current + 1, '…', total)
  }
  return pages
})

// ── Helpers ────────────────────────────────────────────────
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

const getRoleBadge = (roleName) => {
  if (!roleName) return 'status-pill pill-default'
  const r = roleName.toLowerCase()
  if (r.includes('admin')) return 'status-pill pill-admin'
  if (r.includes('provider')) return 'status-pill pill-provider'
  return 'status-pill pill-user'
}

// ── API ────────────────────────────────────────────────────
const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    const res = await api.get(`/users?page=${page}&per_page=${perPage}`)
    // Check if response has data, handle both result-based and direct data responses
    if (res.data?.data || res.data?.result) {
      users.value = res.data.data || []
      pagination.value = {
        currentPage: res.data.current_page ?? page,
        lastPage: res.data.last_page ?? 1,
        total: res.data.total ?? res.data.data?.length ?? 0,
        perPage,
      }
    } else {
      console.warn('Unexpected API response structure:', res.data)
      showToast('រចនាសម្ព័ន្ធឆ្លើយមិនរំពឹងទុក', 'error')
    }
  } catch (err) {
    console.error('fetchUsers error:', err)
    showToast('មានបញ្ហាក្នុងការទាញទិន្នន័យ', 'error')
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > pagination.value.lastPage) return
  fetchUsers(page)
}

const openRoleModal = (user) => {
  selectedUser.value = user
  newRoleId.value = String(user.roles[0]?.id || '1')
  showModal.value = true
}

const handleSetRole = async () => {
  isUpdating.value = true
  try {
    const res = await api.put(`/users/set-role/${selectedUser.value.id}`, {
      role_id: newRoleId.value,
    })
    if (res.data.result) {
      showModal.value = false
      showToast('បានធ្វើបច្ចុប្បន្នភាពតួនាទីជោគជ័យ!')
      fetchUsers(pagination.value.currentPage)
    }
  } catch (err) {
    console.error('Set role error:', err)
    showToast('ធ្វើបច្ចុប្បន្នភាពតួនាទីបរាជ័យ', 'error')
  } finally {
    isUpdating.value = false
  }
}

onMounted(() => fetchUsers())
</script>

<style scoped>
.text-navy {
  color: #031c36;
}
.text-orange {
  color: #ff5f00;
}
.card-header-navy {
  background: #031c36;
  border-bottom: 3px solid #ff5f00;
}
.bg-orange {
  background: #ff5f00 !important;
}

/* Table head */
.table thead th {
  background: #031c36;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 14px 12px;
  border: none;
  letter-spacing: 0.04em;
}
.table thead th:first-child {
  border-top-left-radius: 0;
}
.table tbody tr {
  transition: background 0.15s;
}
.table tbody tr:hover {
  background: #fffaf7;
}

/* User avatar */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #031c36, #0d3a6e);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Role pills */
.status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.pill-admin {
  background: #ffebee;
  color: #e53935;
}
.pill-provider {
  background: #e7f1ff;
  color: #0d6efd;
}
.pill-user {
  background: #e9faf1;
  color: #198754;
}
.pill-default {
  background: #f0f0f0;
  color: #888;
}

/* Outline navy button */
.btn-outline-navy {
  border: 1.5px solid #031c36;
  color: #031c36;
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-outline-navy:hover {
  background: #031c36;
  color: #fff;
}

/* Pagination */
.page-btn {
  min-width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1.5px solid #eef0f2;
  background: #fff;
  color: #031c36;
  font-size: 0.82rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 6px;
}
.page-btn:hover:not(:disabled) {
  border-color: #ff5f00;
  color: #ff5f00;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.page-btn-active {
  background: #031c36;
  border-color: #031c36;
  color: #fff;
}
.page-btn-active:hover {
  color: #fff;
  border-color: #031c36;
}
.page-btn-ellipsis {
  border: none;
  background: transparent;
  cursor: default;
}

/* Form fields (modal) */
.field-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #999;
  margin-bottom: 8px;
  display: block;
}
.field-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #eef0f2;
  border-radius: 10px;
  background: #fafbfc;
  overflow: hidden;
  transition: border-color 0.2s;
}
.field-wrap:focus-within {
  border-color: #ff5f00;
  box-shadow: 0 0 0 3px rgba(255, 95, 0, 0.1);
  background: #fff;
}
.field-ico {
  padding: 0 12px;
  color: #bbb;
  font-size: 0.95rem;
  flex-shrink: 0;
}
.field-wrap select {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 14px 10px 0;
  font-size: 0.88rem;
  color: #031c36;
  outline: none;
  cursor: pointer;
}

/* Orange button */
.btn-orange {
  background: #ff5f00;
  color: #fff;
  border: none;
  border-radius: 10px;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-orange:hover:not(:disabled) {
  background: #e65600;
  transform: translateY(-1px);
  color: #fff;
}
.btn-orange:disabled {
  opacity: 0.7;
}

/* Skeleton */
.skeleton-line {
  display: block;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-circle {
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
}
.confirm-box {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 420px;
}
.confirm-box-header {
  background: #031c36;
  color: #f4a25a;
  padding: 16px 24px;
  font-weight: 700;
  border-bottom: 3px solid #ff5f00;
  display: flex;
  align-items: center;
}
.confirm-box-body {
  padding: 20px 24px;
}
.confirm-box-footer {
  padding: 0 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Toast */
.admin-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}
.admin-toast.success {
  background: #031c36;
}
.admin-toast.error {
  background: #dc3545;
}
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
