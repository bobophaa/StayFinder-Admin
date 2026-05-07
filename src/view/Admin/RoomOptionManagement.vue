<template>
  <div class="room-option-management p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-navy">Room Options</h2>
        <p class="text-muted small">Manage amenities like WiFi, CCTV, and Bathrooms</p>
      </div>
      <button @click="openModal()" class="btn btn-main px-4 py-2 shadow-orange">
        <i class="bi bi-plus-circle me-2"></i>Add New Option
      </button>
    </div>

    <div v-if="roomOptionStore.loading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status"></div>
      <p class="mt-2 text-muted">Loading options...</p>
    </div>

    <div v-else class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive p-3">
        <table class="table table-hover align-middle">
          <thead class="bg-navy-header">
            <tr>
              <th width="100">ID</th>
              <th>Option Name</th>
              <th width="200" class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="option in roomOptionStore.options" :key="option.id">
              <td><span class="fw-bold text-muted">#{{ option.id }}</span></td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="icon-box me-3"><i class="bi bi-check2-square"></i></div>
                  <span class="fw-semibold text-navy">{{ option.name }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button @click="openModal(option)" class="btn btn-sm btn-outline-navy rounded-pill px-3">
                    Edit
                  </button>
                  <button @click="handleDelete(option.id)" class="btn btn-sm btn-outline-danger rounded-pill px-3">
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
        <h4 class="fw-bold mb-3 text-navy">{{ isEdit ? 'Update Option' : 'Add New Option' }}</h4>
        
        <div class="mb-4">
          <label class="form-label fw-semibold">Option Name</label>
          <input 
            v-model="optionName" 
            type="text" 
            class="form-control form-control-lg rounded-3" 
            placeholder="e.g. WiFi, Air Conditioner"
            @keyup.enter="handleSubmit"
          >
        </div>

        <div class="d-flex gap-2">
          <button @click="showModal = false" class="btn btn-light flex-grow-1 py-2 rounded-3">Cancel</button>
          <button @click="handleSubmit" :disabled="isSaving" class="btn btn-orange flex-grow-1 py-2 rounded-3">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEdit ? 'Save Changes' : 'Create Option' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoomOptionStore } from '@/stores/RoomOptionStore'

const roomOptionStore = useRoomOptionStore()

const showModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const optionName = ref('')
const selectedId = ref(null)

onMounted(() => {
  roomOptionStore.fetchOptions()
})

const openModal = (option = null) => {
  if (option) {
    isEdit.value = true
    selectedId.value = option.id
    optionName.value = option.name
  } else {
    isEdit.value = false
    optionName.value = ''
  }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!optionName.value.trim()) return alertError('Please enter an option name')
  
  isSaving.value = true
  let success = false

  if (isEdit.value) {
    success = await roomOptionStore.updateOption(selectedId.value, optionName.value)
  } else {
    success = await roomOptionStore.addOption(optionName.value)
  }

  if (success) {
    alertSuccess(isEdit.value ? 'Option updated!' : 'Option created!')
    showModal.value = false
    roomOptionStore.fetchOptions()
  } else {
    alertError('Something went wrong.')
  }
  isSaving.value = false
}

const handleDelete = async (id) => {
  const confirmed = await confirmDelete('Remove this option?')
  if (confirmed) {
    const success = await roomOptionStore.deleteOption(id)
    if (success) {
      alertSuccess('Option deleted successfully')
      roomOptionStore.fetchOptions()
    } else {
      alertError('Could not delete option')
    }
  }
}
</script>

<style scoped>
.text-navy { color: #031c36; }
.text-orange { color: #ff5f00; }
.bg-navy-header th {
  background-color: #031c36 !important;
  color: white !important;
  font-size: 0.85rem;
  text-transform: uppercase;
  padding: 15px;
}
.icon-box {
  width: 35px;
  height: 35px;
  background: rgba(3, 28, 54, 0.05);
  border-radius: 8px;
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
  background: rgba(3, 28, 54, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}
.modal-content { background: white; width: 400px; border-radius: 20px; }
.shadow-orange { box-shadow: 0 4px 15px rgba(255, 95, 0, 0.2); }
</style>