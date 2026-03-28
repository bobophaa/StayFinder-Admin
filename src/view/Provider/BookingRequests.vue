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
          <p class="text-muted">Manage and verify pending room reservations</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center py-5">
          <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;"></div>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- Cards Grid -->
        <div v-if="!loading && bookings.length > 0" class="row g-4">

          <div
            v-for="booking in bookings"
            :key="booking.id"
            class="col-12 col-sm-6 col-lg-4 col-xl-3"
          >
            <div class="card border-0 shadow-sm rounded-4 h-100">

              <!-- Image -->
              <div class="position-relative" style="height: 190px;">
                <img
                  v-if="booking.room?.image"
                  :src="booking.room.image"
                  class="card-img-top h-100 w-100"
                  style="object-fit: cover; border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                />

                <div
                  v-else
                  class="bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center text-muted h-100"
                  style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;"
                >
                  No Image
                </div>

                <!-- Status badge -->
                <span
                  class="badge bg-warning text-dark position-absolute top-0 end-0 m-2 px-3 py-2 shadow-sm"
                  style="border-radius: 10px;"
                >
                  Pending
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
                </div>

                <!-- Buttons -->
                <div class="d-flex gap-2 mt-4">
                  <button
                    @click="approveBooking(booking.id)"
                    :disabled="approving === booking.id"
                    class="btn btn-success w-100 fw-semibold"
                  >
                    {{ approving === booking.id ? 'Approving…' : 'Approve' }}
                  </button>

                  <button
                    @click="rejectBooking(booking.id)"
                    :disabled="rejecting === booking.id"
                    class="btn btn-outline-danger w-100 fw-semibold"
                  >
                    {{ rejecting === booking.id ? 'Rejecting…' : 'Reject' }}
                  </button>
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
            <button
              @click="currentPage > 1 && (currentPage -= 1)"
              class="btn btn-light border"
            >
              ‹
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="btn"
              :class="currentPage === page
                ? 'btn-primary text-white'
                : 'btn-outline-secondary'"
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
          style="background: rgba(0,0,0,0.5)"
          @click="showTransactionModal = false"
        >
          <div
            class="modal-dialog"
            @click.stop
          >
            <div class="modal-content p-3">
              <h4 class="fw-semibold mb-3">Payment Proof</h4>

              <img
                v-if="selectedBooking?.payment_proof_image"
                :src="selectedBooking.payment_proof_image"
                class="w-100 rounded mb-3"
              />

              <p v-else class="text-center text-muted py-4">No payment proof uploaded</p>

              <button
                class="btn btn-secondary w-100"
                @click="showTransactionModal = false"
              >
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

const totalPages = computed(() => Math.ceil(totalRequests.value / pageSize))

const setToken = () => {
  const token = '132|hIlRWz0JniA6EEJjwZRKMrk5tR8GIAPgkpqDWHhA5884a72b'
  localStorage.setItem('token', token)
}

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

const fetchBookings = async () => {
  try {
    loading.value = true
    error.value = null

    const res = await api.get('/profile/booking-check', {
      params: {
        page: currentPage.value,
        per_page: pageSize,
        status: 1,
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

const openTransactionModal = (booking) => {
  if (booking.payment_proof_image) {
    selectedBooking.value = booking
    showTransactionModal.value = true
  }
}

const approveBooking = async (id) => {
  try {
    approving.value = id
    await api.post(`/profile/booking-requests/${id}/approve`)
    fetchBookings()
  } finally {
    approving.value = null
  }
}

const rejectBooking = async (id) => {
  try {
    rejecting.value = id
    await api.post(`/profile/booking-requests/${id}/reject`)
    fetchBookings()
  } finally {
    rejecting.value = null
  }
}

watch(currentPage, () => fetchBookings())

onMounted(() => {
  setToken()
  fetchBookings()
})

// Aprrove/reject functions can be enhanced with confirmation dialogs if needed

</script>

<style>
/* Modal animation fix for manual modal */
.modal {
  backdrop-filter: blur(2px);
}
</style>