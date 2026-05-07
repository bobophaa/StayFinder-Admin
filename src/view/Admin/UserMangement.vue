<template>
  <div class="user-management">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-navy">User Management</h2>
      <span class="badge btn-main px-3 py-2">{{ users.length }} Total Users</span>
    </div>

    <div class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive p-3">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>User Info</th>
              <th>Current Job</th>
              <th>Role</th>
              <th>Created At</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>#{{ user.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <img
                    :src="user.avatar"
                    class="rounded-circle me-3"
                    width="45"
                    height="45"
                    alt="avatar"
                  />
                  <div>
                    <div class="fw-bold text-dark">{{ user.name }}</div>
                    <small class="text-muted">{{ user.email }}</small>
                  </div>
                </div>
              </td>
              <td>{{ user.current_job || 'N/A' }}</td>
              <td>
                <span :class="getRoleBadge(user.roles[0]?.name)">
                  {{ user.roles[0]?.name || 'No Role' }}
                </span>
              </td>
              <td class="small">
                <span class="date text-muted">
                  {{
                    new Date(user.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  }}
                </span>
              </td>
              <td class="text-center">
                <button
                  @click="openSetRoleModal(user)"
                  class="btn btn-sm border-navy rounded-pill px-3 text-navy"
                >
                  Set Role
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="user-management p-4">
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content p-4 shadow-lg border-0">
        <h4 class="fw-bold mb-3 text-navy">Change User Role</h4>
        <p class="text-muted">
          Updating role for: <strong class="text-navy">{{ selectedUser?.name }}</strong>
        </p>

        <div class="mb-4">
          <label class="form-label fw-semibold">Select New Role</label>
          <select v-model="newRoleId" class="form-select form-select-lg rounded-3">
            <option value="1">User</option>
            <option value="2">Provider (Owner)</option>
            <option value="3">System Admin</option>
          </select>
        </div>

        <div class="d-flex gap-2">
          <button @click="showModal = false" class="btn btn-light flex-grow-1 py-2 rounded-3">
            Cancel
          </button>
          <button
            @click="handleSetRole"
            :disabled="isUpdating"
            class="btn btn-primary flex-grow-1 py-2 rounded-3"
          >
            <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2"></span>
            Update Role Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api/http'
const users = ref([])
const showModal = ref(false)
const selectedUser = ref(null)
const newRoleId = ref('')
const isUpdating = ref(false)

const fetchUsers = async () => {
  try {
    const response = await api.get('/users?page=1&per_page=30')
    if (response.data.result) {
      users.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const getRoleBadge = (roleName) => {
  if (!roleName) return 'badge bg-secondary-subtle text-secondary px-3'
  const role = roleName.toLowerCase()
  if (role.includes('admin')) return 'badge bg-danger-subtle text-danger px-3'
  if (role.includes('provider')) return 'badge bg-primary-subtle text-primary px-3'
  return 'badge bg-secondary-subtle text-secondary px-3'
}

const openSetRoleModal = (user) => {
  selectedUser.value = user
  newRoleId.value = user.roles[0]?.id || '1'
  showModal.value = true
}

const handleSetRole = async () => {
  isUpdating.value = true
  try {
    const response = await api.put(`/users/set-role/${selectedUser.value.id}`, { 
      role_id: newRoleId.value 
    })

    if (response.data.result) {
      showModal.value = false
      Swal.fire('Success!', 'User role has been updated.', 'success')
      fetchUsers()
    }
  } catch (error) {
    console.error('Set Role Error:', error)
    Swal.fire('Error!', 'Failed to update role.', 'error')
  } finally {
    isUpdating.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.text-navy {
  color: #031c36;
}
.card {
  border-radius: 15px;
  overflow: hidden;
}
.table thead th {
    background-color: #031c36 !important; 
    color: #ffffff !important;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    padding: 15px;
    border: none;
}

.table thead th:first-child {
    border-top-left-radius: 15px;
}
.table thead th:last-child {
    border-top-right-radius: 15px;
}
.badge {
  font-weight: 500;
  border-radius: 8px;
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
  z-index: 9999;
}
.modal-content {
  background: white;
  width: 400px;
  border-radius: 20px;
}
.text-navy {
  color: #031c36;
}
.btn-primary {
  background-color: #ff5f00;
  border: none;
}
.btn-primary:hover {
  background-color: #e65600;
}
</style>
