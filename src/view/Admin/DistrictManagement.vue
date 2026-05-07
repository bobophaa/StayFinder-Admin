<template>
  <div class="district-management p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-navy">District Management</h2>
        <p class="text-muted small">Manage city areas for the room rental listings</p>
      </div>
      <button @click="openModal()" class="btn btn-main px-4 py-2 shadow-orange">
        <i class="bi bi-geo-alt-fill me-2"></i>Add New District
      </button>
    </div>

    <div v-if="districtStore.loading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status"></div>
      <p class="mt-2 text-muted">Fetching districts...</p>
    </div>

    <div v-else class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive p-3">
        <table class="table table-hover align-middle">
          <thead class="bg-navy-header">
            <tr>
              <th width="120">ID</th>
              <th>District Name (Location)</th>
              <th width="200" class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dist in districtStore.districts" :key="dist.id">
              <td><span class="fw-bold text-muted">#{{ dist.id }}</span></td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="location-icon me-3"><i class="bi bi-geo-fill"></i></div>
                  <span class="fw-semibold text-navy">{{ dist.name }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button @click="openModal(dist)" class="btn btn-sm btn-outline-navy rounded-pill px-3">
                    Edit
                  </button>
                  <button @click="handleDelete(dist.id)" class="btn btn-sm btn-outline-danger rounded-pill px-3">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content p-4 shadow-lg border-0">
        <h4 class="fw-bold mb-3 text-navy">{{ isEdit ? 'Edit District' : 'New District' }}</h4>
        
        <div class="mb-4">
          <label class="form-label fw-semibold">District Name</label>
          <input 
            v-model="districtName" 
            type="text" 
            class="form-control form-control-lg rounded-3" 
            placeholder="e.g. Chamkarmon"
            @keyup.enter="handleSubmit"
          >
        </div>

        <div class="d-flex gap-2">
          <button @click="showModal = false" class="btn btn-light flex-grow-1 py-2 rounded-3">Cancel</button>
          <button @click="handleSubmit" :disabled="isSaving" class="btn btn-orange flex-grow-1 py-2 rounded-3">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDistrictStore } from '@/stores/DistrictStore'
// import { alertSuccess, alertError, confirmDelete } from '@/utils/alert'
// import { alertError, confirmDelete, alertSuccess, } from '@/utils/alert'

const districtStore = useDistrictStore()

const showModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const districtName = ref('')
const selectedId = ref(null)

onMounted(() => {
  districtStore.fetchDistricts()
})

const openModal = (dist = null) => {
  if (dist) {
    isEdit.value = true
    selectedId.value = dist.id
    districtName.value = dist.name
  } else {
    isEdit.value = false
    districtName.value = ''
  }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!districtName.value.trim()) return alertError('Please enter a district name')
  
  isSaving.value = true
  let success = false

  if (isEdit.value) {
    success = await districtStore.updateDistrict(selectedId.value, districtName.value)
  } else {
    success = await districtStore.addDistrict(districtName.value)
  }

  if (success) {
    alertSuccess(isEdit.value ? 'District updated!' : 'District added!')
    showModal.value = false
    districtStore.fetchDistricts()
  } else {
    alertError('Failed to save district.')
  }
  isSaving.value = false
}

const handleDelete = async (id) => {
  const confirmed = await confirmDelete('Are you sure you want to delete this district?')
  if (confirmed) {
    const success = await districtStore.deleteDistrict(id)
    if (success) {
      alertSuccess('District removed successfully')
      districtStore.fetchDistricts()
    } else {
      alertError('Action failed.')
    }
  }
}
</script>

<style scoped>
.text-navy { color: #031c36; }
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
.btn-orange { background: #ff5f00; color: white; border: none; }
.btn-orange:hover { background: #e65600; }

.btn-outline-navy {
  border: 1px solid #031c36;
  color: #031c36;
}
.btn-outline-navy:hover {
  background: #031c36;
  color: white;
}

.modal-backdrop {
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(3, 28, 54, 0.7);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}
.modal-content { background: white; width: 420px; border-radius: 20px; }
.shadow-orange { box-shadow: 0 4px 15px rgba(255, 95, 0, 0.25); }
</style>