<template>
  <div class="d-flex min-vh-100 bg-light">
    <!-- Sidebar -->
    <SidebarProvider />

    <!-- Main content -->
    <div class="flex-grow-1">
      <div class="container py-5">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="fw-bold text-dark">Booking Checking List</h2>
          <p class="text-muted">Manage and verify room reservation requests by category</p>
        </div>

        <!-- Table -->
        <UseTable
          :data="bookings"
          :columns="tableColumns"
          :loading="loading"
          :show-actions="true"
          :approving-id="approving"
          :rejecting-id="rejecting"
          :current-page="currentPage"
          :page-size="pageSize"
          :total-items="totalRequests"
          :active-filter="activeFilter"
          :empty-message="'No booking requests found'"
          :payment-url-getter="getPaymentProofUrl"
          @approve="approveBooking"
          @reject="rejectBooking"
          @view-detail="openDetailModal"
          @update:current-page="currentPage = $event"
          @update:active-filter="activeFilter = $event"
        />

        <!-- Detail Modal -->
        <DetailModal
          :show="showDetailModal"
          :item="selectedItem"
          title="Booking"
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

const bookings = ref([])
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
  { key: 'name', label: 'Guest Name', field: 'buyer.name' },
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

const getPaymentProofUrl = (booking) => {
  const file = booking?.transaction_file
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

const updateBookingStatus = (id, status) => {
  const booking = bookings.value.find((item) => item.id === id)
  if (booking) booking.status = status
}

const fetchBookings = async () => {
  try {
    loading.value = true
    error.value = null
    const res = await api.get('/profile/booking-check?', {
      params: {
        page: currentPage.value,
        per_page: pageSize,
      },
    })
    bookings.value = res.data.data || []
    totalRequests.value = res.data.total || 0
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch bookings'
  } finally {
    loading.value = false
  }
}

const approveBooking = async (id) => {
  try {
    approving.value = id
    await api.put(`/books/approve/${id}`)
    updateBookingStatus(id, 2)
  } finally {
    approving.value = null
  }
}

const rejectBooking = async (id) => {
  try {
    rejecting.value = id
    await api.put(`/books/reject/${id}`)
    updateBookingStatus(id, 3)
  } finally {
    rejecting.value = null
  }
}

watch(currentPage, () => fetchBookings())

onMounted(() => {
  setToken()
  fetchBookings()
})
</script>
