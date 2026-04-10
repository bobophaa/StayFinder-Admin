<template>
  <div class="d-flex min-vh-100 bg-light">
    <!-- Sidebar -->
    <SidebarProvider />

    <!-- Main content -->
    <div class="flex-grow-1">
      <div class="container py-5">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="fw-bold text-dark">Rent Checking List</h2>
          <p class="text-muted">Manage and verify room rent requests by category</p>
        </div>

        <!-- Table -->
        <UseTable
          :data="rents"
          :columns="tableColumns"
          :loading="loading"
          :show-actions="true"
          :approving-id="approving"
          :rejecting-id="rejecting"
          :current-page="currentPage"
          :page-size="pageSize"
          :total-items="totalRequests"
          :active-filter="activeFilter"
          :empty-message="'No rent requests found'"
          :payment-url-getter="getPaymentProofUrl"
          @approve="approveRent"
          @reject="rejectRent"
          @view-detail="openDetailModal"
          @update:current-page="currentPage = $event"
          @update:active-filter="activeFilter = $event"
        />

        <!-- Detail Modal -->
        <DetailModal
          :show="showDetailModal"
          :item="selectedItem"
          title="Rent"
          :payment-url-getter="getPaymentProofUrl"
          @close="showDetailModal = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import SidebarProvider from '@/components/layout/SidebarProvider.vue'
import UseTable from '@/components/layout/UseTable.vue'
import DetailModal from '@/components/layout/DetailModal.vue'
import api from '@/api/http.js'

const rents = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const pageSize = 12
const totalRequests = ref(0)
const approving = ref(null)
const rejecting = ref(null)
const activeFilter = ref('all')
const showDetailModal = ref(false)
const selectedItem = ref({})

const tableColumns = [
  { key: 'image', label: 'Room', field: 'room.image', type: 'image' },
  { key: 'name', label: 'Renter Name', field: 'buyer.name' },
  { key: 'status', label: 'Status', field: 'status', type: 'status' },
]

const setToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

const getPaymentProofUrl = (rent) => {
  const file = rent?.transaction_file
  if (!file) return null
  if (typeof file === 'string') return file
  if (file.url) return file.url
  const base64 = file.data || file.base64
  if (base64) {
    const mime = file.type || file.mime || 'image/jpeg'
    return `data:${mime};base64,${base64}`
  }
  return null
}

const openDetailModal = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const updateRentStatus = (id, status) => {
  const rent = rents.value.find((item) => item.id === id)
  if (rent) rent.status = status
}

const fetchRents = async () => {
  try {
    loading.value = true
    error.value = null
    const res = await api.get('/profile/rent-check', {
      params: {
        page: currentPage.value,
        per_page: pageSize,
      },
    })
    rents.value = res.data.data || []
    totalRequests.value = res.data.total || 0
    console.log(res.data);
    
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch rents'
  } finally {
    loading.value = false
  }
}

const approveRent = async (id) => {
  try {
    approving.value = id
    await api.put(`rents/approve/${id}`)
    updateRentStatus(id, 2)
  } finally {
    approving.value = null
  }
}

const rejectRent = async (id) => {
  try {
    rejecting.value = id
    await api.put(`/rents/reject/${id}`)
    updateRentStatus(id, 3)
  } finally {
    rejecting.value = null
  }
}

watch(currentPage, () => fetchRents())
onMounted(() => {
  setToken()
  fetchRents()


})

</script>
