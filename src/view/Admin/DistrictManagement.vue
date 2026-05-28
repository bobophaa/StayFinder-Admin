<template>
  <div class="district-management p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-navy">គ្រប់គ្រងខណ្ឌ</h2>
        <p class="text-muted small">គ្រប់គ្រងតំបន់ទីក្រុងសម្រាប់បញ្ជីជួលបន្ទប់</p>
      </div>
      <button @click="openModal()" class="btn btn-main px-4 py-2 shadow-orange">
        <i class="bi bi-geo-alt-fill me-2"></i>បន្ថែមខណ្ឌថ្មី
      </button>
    </div>

    <!-- Loading -->
    <div v-if="districtStore.loading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status"></div>
      <p class="mt-2 text-muted">កំពុងទាញយកខណ្ឌ...</p>
    </div>

    <!-- Table -->
    <div v-else class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive p-3">
        <table class="table table-hover align-middle">
          <thead class="bg-navy-header">
            <tr>
              <th width="120">ID</th>
              <th>ឈ្មោះខណ្ឌ (ទីតាំង)</th>
              <th width="200" class="text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dist in districtStore.districts" :key="dist.id">
              <td>
                <span class="fw-bold text-muted">#{{ dist.id }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="location-icon me-3"><i class="bi bi-geo-fill"></i></div>
                  <span class="fw-semibold text-navy">{{ dist.name }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button
                    @click="openModal(dist)"
                    class="btn btn-sm btn-outline-navy rounded-pill px-3"
                  >
                    កែសម្រួល
                  </button>
                  <!-- FIX: was handleលុប() → handleDelete() -->
                  <button
                    @click="handleDelete(dist.id, dist.name)"
                    :disabled="deletingId === dist.id"
                    class="btn btn-sm btn-outline-danger rounded-pill px-3"
                  >
                    <span
                      v-if="deletingId === dist.id"
                      class="spinner-border spinner-border-sm"
                    ></span>
                    <span v-else>លុប</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="districtStore.districts.length === 0">
              <td colspan="3" class="text-center py-4 text-muted small">មិនទាន់មានខណ្ឌ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-box p-4 shadow-lg border-0">
        <h4 class="fw-bold mb-3 text-navy">
          {{ isEditing ? 'កែសម្រួលខណ្ឌ' : 'បន្ថែមខណ្ឌថ្មី' }}
        </h4>

        <div class="mb-4">
          <label class="form-label fw-semibold">ឈ្មោះខណ្ឌ</label>
          <input
            v-model="districtName"
            type="text"
            class="form-control form-control-lg rounded-3"
            :class="{ 'input-error': isDuplicateDistrict }"
            placeholder="ឧទាហរណ៍៖ ចំការមន"
            @keyup.enter="handleSubmit"
            autofocus
          />
          <div v-if="isDuplicateDistrict" class="error-message mt-2">
            <i class="bi bi-exclamation-circle-fill me-2"></i>
            ឈ្មោះខណ្ឌនេះមានរួចហើយ សូមបញ្ចូលឈ្មោះថ្មី
          </div>
        </div>

        <div class="d-flex gap-2">
          <button @click="showModal = false" class="btn btn-light flex-grow-1 py-2 rounded-3">
            បោះបង់
          </button>
          <button
            @click="handleSubmit"
            :disabled="isSaving || isDuplicateDistrict"
            class="btn btn-orange flex-grow-1 py-2 rounded-3"
          >
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEditing ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDistrictStore } from '@/stores/DistrictStore'
import { alertSuccess, alertError } from '@/Utils/alert'
import Swal from 'sweetalert2'

const districtStore = useDistrictStore()

const showModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const deletingId = ref(null)
const districtName = ref('')
const selectedId = ref(null)

onMounted(() => {
  districtStore.fetchDistricts()
})

// Check if district name already exists (only for adding new, not for editing)
const isDuplicateDistrict = computed(() => {
  if (isEditing.value) return false // Don't check for duplicates when editing
  if (!districtName.value.trim()) return false

  return districtStore.districts.some(
    (dist) => dist.name.toLowerCase().trim() === districtName.value.toLowerCase().trim(),
  )
})

const openModal = (dist = null) => {
  if (dist) {
    isEditing.value = true
    selectedId.value = dist.id
    districtName.value = dist.name
  } else {
    isEditing.value = false
    selectedId.value = null
    districtName.value = ''
  }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!districtName.value.trim()) {
    alertError('សូមបញ្ចូលឈ្មោះខណ្ឌ')
    return
  }

  // Prevent saving if duplicate district name (only for adding)
  if (!isEditing.value && isDuplicateDistrict.value) {
    alertError('ឈ្មោះខណ្ឌនេះមានរួចហើយ សូមបញ្ចូលឈ្មោះថ្មី')
    return
  }

  isSaving.value = true
  let success = false

  if (isEditing.value) {
    success = await districtStore.updateDistrict(selectedId.value, districtName.value)
  } else {
    success = await districtStore.addDistrict(districtName.value)
  }

  if (success) {
    alertSuccess(isEditing.value ? 'បានធ្វើបច្ចុប្បន្នភាពខណ្ឌ!' : 'បានបន្ថែមខណ្ឌ!')
    showModal.value = false
    await districtStore.fetchDistricts()
  } else {
    alertError('រក្សាទុកខណ្ឌបរាជ័យ។')
  }

  isSaving.value = false
}

const handleDelete = async (id, name) => {
  const result = await Swal.fire({
    title: 'លុបខណ្ឌនេះ?',
    html: `អ្នកកំពុងនឹងលុប <strong>"${name}"</strong><br><span style="font-size:.9rem;color:#888">សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។</span>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'លុប',
    cancelButtonText: 'បោះបង់',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    reverseButtons: true,
    customClass: {
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn',
    },
  })

  if (!result.isConfirmed) return

  deletingId.value = id
  const success = await districtStore.deleteDistrict(id)

  if (success) {
    alertSuccess('បានលុបខណ្ឌជោគជ័យ!')
    await districtStore.fetchDistricts()
  } else {
    alertError('សកម្មភាពបរាជ័យ។')
  }

  deletingId.value = null
}
</script>

<style scoped>
.text-navy {
  color: #031c36;
}

.bg-navy-header th {
  background-color: #031c36 !important;
  color: white !important;
  padding: 15px;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.location-icon {
  width: 35px;
  height: 35px;
  background: rgba(255, 95, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5f00;
}

.btn-main {
  background: #031c36;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-main:hover {
  background: #052d5a;
  color: #fff;
  transform: translateY(-1px);
}

.btn-orange {
  background: #ff5f00;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-orange:hover:not(:disabled) {
  background: #e65600;
}
.btn-orange:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-outline-navy {
  border: 1px solid #031c36;
  color: #031c36;
}
.btn-outline-navy:hover {
  background: #031c36;
  color: white;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(3, 28, 54, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-box {
  background: white;
  width: 420px;
  border-radius: 20px;
}
.shadow-orange {
  box-shadow: 0 4px 15px rgba(255, 95, 0, 0.25);
}

.error-message {
  color: #dc3545;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  animation: slideDown 0.2s ease-out;
}

.input-error {
  border-color: #dc3545 !important;
  background-color: rgba(220, 53, 69, 0.05) !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style>
.swal-custom-popup {
  border-radius: 20px !important;
  font-family: inherit !important;
  padding: 2rem !important;
}
.swal-custom-title {
  color: #031c36 !important;
  font-weight: 700 !important;
  font-size: 1.2rem !important;
}
.swal-confirm-btn,
.swal-cancel-btn {
  border-radius: 10px !important;
  font-weight: 700 !important;
  padding: 10px 28px !important;
  font-size: 0.9rem !important;
}
</style>
