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

        <div class="mb-4 d-flex flex-wrap gap-2 align-items-center">
          <span class="text-muted small">Categories:</span>
          <span
            v-for="category in statusCategories"
            :key="category.key"
            class="badge rounded-pill bg-light border text-dark py-2 px-3"
          >
            {{ category.label }} ({{ category.count }})
          </span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center py-5">
          <div class="spinner-border text-warning" style="width: 3rem; height: 3rem"></div>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- Cards Grid -->
        <div v-if="!loading && bookings.length > 0">
          <div v-for="group in groupedBookings" :key="group.key" class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="mb-0">{{ group.label }}</h4>
              <span class="text-muted small">{{ group.items.length }} request(s)</span>
            </div>

            <div v-if="group.items.length > 0" class="row g-4">
              <div
                v-for="booking in group.items"
                :key="booking.id"
                class="col-12 col-sm-6 col-lg-4 col-xl-3"
              >
                <div class="card border-0 shadow-sm rounded-4 h-100">
                  <!-- Image -->
                  <div class="position-relative" style="height: 190px">
                    <img
                      v-if="booking.room?.image"
                      :src="booking.room.image"
                      class="card-img-top h-100 w-100"
                      style="
                        object-fit: cover;
                        border-top-left-radius: 1rem;
                        border-top-right-radius: 1rem;
                      "
                    />

                    <div
                      v-else
                      class="bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center text-muted h-100"
                      style="border-top-left-radius: 1rem; border-top-right-radius: 1rem"
                    >
                      No Image
                    </div>

                    <!-- Status badge -->
                    <span
                      class="badge position-absolute top-0 end-0 m-2 px-3 py-2 shadow-sm"
                      :class="getStatusBadgeClasses(booking.status)"
                      style="border-radius: 10px"
                    >
                      {{ getStatusLabel(booking.status) }}
                    </span>
                  </div>

                  <!-- Body -->
                  <div class="card-body">
                    <!-- Name -->
                    <h5 class="fw-semibold text-dark mb-1">
                      {{ booking.buyer?.name }}
                    </h5>
                    <p class="text-muted small">{{ booking.buyer?.email }}</p>

                    <!-- Check-in -->
                    <div class="bg-light border rounded-3 p-3 mt-3">
                      <p class="small text-secondary fw-bold mb-1">CHECK-IN</p>

                      <p class="fw-semibold small text-dark">
                        {{ formatDate(booking.created_at) }},
                        {{ formatTime(booking.created_at) }}
                      </p>

                      <div class="d-flex justify-content-between align-items-center mt-3">
                        <p class="small text-secondary fw-bold mb-0">PAYMENT</p>
                      </div>

                      <div class="mt-3">
                        <div
                          v-if="getPaymentProofUrl(booking)"
                          class="transaction-preview rounded overflow-hidden border"
                          :style="{
                            width: '100px',
                            height: '100px',
                            cursor: canViewTransaction(booking) ? 'pointer' : 'not-allowed',
                          }"
                          @click="canViewTransaction(booking) && openTransactionModal(booking)"
                        >
                          <img
                            :src="getPaymentProofUrl(booking)"
                            class="w-100 h-100"
                            style="object-fit: cover"
                            alt="Payment proof"
                          />
                        </div>
                        <p v-else class="small text-muted mb-0">No payment proof uploaded</p>
                      </div>
                    </div>

                    <!-- Buttons -->
                    <div class="d-flex gap-2 mt-4">
                      <button
                        @click="approveBooking(booking.id)"
                        :disabled="approving === booking.id || !isPendingStatus(booking.status)"
                        class="btn btn-success w-100 fw-semibold"
                      >
                        {{ approving === booking.id ? 'Approving…' : 'Approve' }}
                      </button>

                      <button
                        @click="rejectBooking(booking.id)"
                        :disabled="rejecting === booking.id || !isPendingStatus(booking.status)"
                        class="btn btn-outline-danger w-100 fw-semibold"
                      >
                        {{ rejecting === booking.id ? 'Rejecting…' : 'Reject' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && bookings.length === 0" class="text-center py-5">
          <p class="text-muted fs-5">No booking requests found</p>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && totalRequests > pageSize"
          class="d-flex justify-content-between align-items-center bg-white shadow-sm border rounded-3 p-3 mt-4"
        >
          <p class="text-muted small mb-0">
            Showing
            <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> –
            <strong>{{ Math.min(currentPage * pageSize, totalRequests) }}</strong>
            of <strong>{{ totalRequests }}</strong> requests
          </p>

          <div class="d-flex gap-2">
            <button @click="currentPage > 1 && (currentPage -= 1)" class="btn btn-light border">
              ‹
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="btn"
              :class="currentPage === page ? 'btn-primary text-white' : 'btn-outline-secondary'"
            >
              {{ page }}
            </button>

            <button
              @click="currentPage < totalPages && (currentPage += 1)"
              class="btn btn-light border"
            >
              ›
            </button>
          </div>
        </div>

        <!-- Modal -->
        <div
          v-if="showTransactionModal"
          class="modal fade show d-block"
          style="background: rgba(0, 0, 0, 0.5)"
          @click="showTransactionModal = false"
        >
          <div class="modal-dialog" @click.stop>
            <div class="modal-content p-3">
              <h4 class="fw-semibold mb-3">Payment Proof</h4>

              <img
                v-if="getPaymentProofUrl(selectedBooking)"
                :src="getPaymentProofUrl(selectedBooking)"
                class="w-100 rounded mb-3"
              />

              <p v-else class="text-center text-muted py-4">No payment proof uploaded</p>

              <button class="btn btn-secondary w-100" @click="showTransactionModal = false">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SidebarProvider from '@/components/layout/SidebarProvider.vue'
import api from '@/api/http.js'

const bookings = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const pageSize = 12
const totalRequests = ref(0)
const showTransactionModal = ref(false)
const selectedBooking = ref(null)
const approving = ref(null)
const rejecting = ref(null)

const setToken = () => {
  const token = localStorage.getItem('token')

  // Set the Authorization header for all requests if token exists
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

const totalPages = computed(() => Math.ceil(totalRequests.value / pageSize))

const getStatusKey = (status) => {
  if (status === 2 || status === '2' || status === 'approved') return 'approved'
  if (status === 3 || status === '3' || status === 'rejected') return 'rejected'
  return 'pending'
}

const pendingCount = computed(
  () => bookings.value.filter((booking) => getStatusKey(booking.status) === 'pending').length,
)
const approvedCount = computed(
  () => bookings.value.filter((booking) => getStatusKey(booking.status) === 'approved').length,
)
const rejectedCount = computed(
  () => bookings.value.filter((booking) => getStatusKey(booking.status) === 'rejected').length,
)

const groupedBookings = computed(() => [
  {
    key: 'pending',
    label: 'Pending',
    items: bookings.value.filter((booking) => getStatusKey(booking.status) === 'pending'),
  },
  {
    key: 'approved',
    label: 'Approved',
    items: bookings.value.filter((booking) => getStatusKey(booking.status) === 'approved'),
  },
  {
    key: 'rejected',
    label: 'Rejected',
    items: bookings.value.filter((booking) => getStatusKey(booking.status) === 'rejected'),
  },
])

const statusCategories = computed(() => [
  { key: 'pending', label: 'Pending', count: pendingCount.value },
  { key: 'approved', label: 'Approved', count: approvedCount.value },
  { key: 'rejected', label: 'Rejected', count: rejectedCount.value },
])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const getStatusLabel = (status) => {
  if (status === 2 || status === '2' || status === 'approved') return 'Approved'
  if (status === 3 || status === '3' || status === 'rejected') return 'Rejected'
  return 'Pending'
}

const getStatusBadgeClasses = (status) => {
  if (status === 2 || status === '2' || status === 'approved') return 'bg-success text-white'
  if (status === 3 || status === '3' || status === 'rejected') return 'bg-danger text-white'
  return 'bg-warning text-dark'
}

const isPendingStatus = (status) => {
  return !(
    status === 2 ||
    status === '2' ||
    status === 'approved' ||
    status === 3 ||
    status === '3' ||
    status === 'rejected'
  )
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
        // remove status filter so approved/rejected cards are also fetched
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

const canViewTransaction = (booking) => {
  return getPaymentProofUrl(booking) && isPendingStatus(booking.status)
}

const openTransactionModal = (booking) => {
  if (!canViewTransaction(booking)) return
  selectedBooking.value = booking
  showTransactionModal.value = true
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

<style>
/* Modal animation fix for manual modal */
.modal {
  backdrop-filter: blur(2px);
}

.modal-dialog {
  transform: translateY(-20px);
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
  opacity: 0;
}

.modal.fade.show .modal-dialog {
  transform: translateY(0);
  opacity: 1;
}
</style>
