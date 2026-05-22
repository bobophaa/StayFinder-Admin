<template>
  <div class="room-option-management p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-navy">ជម្រើសបន្ទប់</h2>
        <p class="text-muted small">គ្រប់គ្រងបរិក្ខារ ដូចជា អ៊ីនធឺណិត និងកាមេរ៉ា</p>
      </div>
      <button @click="openModal()" class="btn btn-main px-4 py-2 shadow-orange">
        <i class="bi bi-plus-circle me-2"></i>បន្ថែមជម្រើសថ្មី
      </button>
    </div>

    <!-- Loading -->
    <div v-if="roomOptionStore.loading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status"></div>
      <p class="mt-2 text-muted">កំពុងផ្ទុកជម្រើស...</p>
    </div>

    <!-- Table -->
    <div v-else class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive p-3">
        <table class="table table-hover align-middle">
          <thead class="bg-navy-header">
            <tr>
              <th width="100">ID</th>
              <th>ឈ្មោះជម្រើស</th>
              <th width="200" class="text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="option in roomOptionStore.options" :key="option.id">
              <td>
                <span class="fw-bold text-muted">#{{ option.id }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="icon-box me-3"><i class="bi bi-check2-square"></i></div>
                  <span class="fw-semibold text-navy">{{ option.name }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button
                    @click="openModal(option)"
                    class="btn btn-sm btn-outline-navy rounded-pill px-3"
                  >
                    កែសម្រួល
                  </button>
                  <button
                    @click="handleDelete(option.id, option.name)"
                    :disabled="deletingId === option.id"
                    class="btn btn-sm btn-outline-danger rounded-pill px-3"
                  >
                    <span
                      v-if="deletingId === option.id"
                      class="spinner-border spinner-border-sm"
                    ></span>
                    <span v-else>លុប</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="roomOptionStore.options.length === 0">
              <td colspan="3" class="text-center py-4 text-muted small">មិនទាន់មានជម្រើស</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-box p-4 shadow-lg border-0">
        <h4 class="fw-bold mb-3 text-navy">
          {{ isEditing ? 'កែសម្រួលជម្រើស' : 'បន្ថែមជម្រើសថ្មី' }}
        </h4>

        <div class="mb-4">
          <label class="form-label fw-semibold">ឈ្មោះជម្រើស</label>
          <input
            v-model="optionName"
            type="text"
            class="form-control form-control-lg rounded-3"
            placeholder="ឧទាហរណ៍៖ អ៊ីនធឺណិត ឬ ម៉ាស៊ីនត្រជាក់"
            @keyup.enter="handleSubmit"
            autofocus
          />
        </div>

        <div class="d-flex gap-2">
          <button @click="showModal = false" class="btn btn-light flex-grow-1 py-2 rounded-3">
            បោះបង់
          </button>
          <button
            @click="handleSubmit"
            :disabled="isSaving"
            class="btn btn-orange flex-grow-1 py-2 rounded-3"
          >
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតជម្រើស' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoomOptionStore } from '@/stores/RoomOptionStore'
import { alertSuccess, alertError } from '@/Utils/alert'
import Swal from 'sweetalert2'

const roomOptionStore = useRoomOptionStore()

const showModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const deletingId = ref(null)
const optionName = ref('')
const selectedId = ref(null)

onMounted(() => {
  roomOptionStore.fetchOptions()
})

const openModal = (option = null) => {
  if (option) {
    isEditing.value = true
    selectedId.value = option.id
    optionName.value = option.name
  } else {
    isEditing.value = false
    selectedId.value = null
    optionName.value = ''
  }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!optionName.value.trim()) {
    alertError('សូមបញ្ចូលឈ្មោះជម្រើស')
    return
  }

  isSaving.value = true
  let success = false

  if (isEditing.value) {
    success = await roomOptionStore.updateOption(selectedId.value, optionName.value)
  } else {
    success = await roomOptionStore.addOption(optionName.value)
  }

  if (success) {
    alertSuccess(isEditing.value ? 'បានកែសម្រួលជម្រើស!' : 'បានបង្កើតជម្រើស!')
    showModal.value = false
    await roomOptionStore.fetchOptions()
  } else {
    alertError('មានបញ្ហាមួយកើតឡើង។')
  }

  isSaving.value = false
}

const handleDelete = async (id, name) => {
  const result = await Swal.fire({
    title: 'លុបជម្រើសនេះ?',
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
  const success = await roomOptionStore.deleteOption(id)

  if (success) {
    alertSuccess('លុបជម្រើសបានជោគជ័យ!')
    await roomOptionStore.fetchOptions()
  } else {
    alertError('មិនអាចលុបជម្រើសបានទេ')
  }

  deletingId.value = null
}
</script>

<style scoped>
.text-navy {
  color: #031c36;
}
.text-orange {
  color: #ff5f00;
}

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
  background: rgba(3, 28, 54, 0.6);
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
  box-shadow: 0 4px 15px rgba(255, 95, 0, 0.2);
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
