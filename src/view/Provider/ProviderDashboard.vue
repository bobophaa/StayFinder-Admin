<template>
  <div class="container-fluid py-3 px-md-4">
    <!-- ── Header ── -->
    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-navy mb-1">
          Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'Provider' }}
        </h2>
        <p class="text-muted mb-0">
          Manage your listings on <span class="fw-bold text-navy">StayFinder</span> —
          <span class="small">{{ todayDate }}</span>
        </p>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <router-link to="/provider/add-room" class="btn btn-orange fw-bold px-4">
          <i class="bi bi-plus-circle-fill me-2"></i>Post New Room
        </router-link>
        <!-- <button class="btn btn-outline-navy fw-bold px-3" @click="refreshAll" :disabled="loading">
          <i class="bi me-1" :class="loading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'"></i>
          Refresh
        </button> -->
      </div>
    </div>

    <!-- ── Stat Cards ── -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="stat-card card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="icon-shape bg-orange-light"><i class="bi bi-house-door-fill"></i></div>
            <span class="trend-badge trend-up"><i class="bi bi-arrow-up me-1"></i>8%</span>
          </div>
          <div v-if="loading">
            <div class="skel-line" style="width: 60px; height: 28px; border-radius: 8px"></div>
          </div>
          <template v-else>
            <h3 class="fw-bold mb-0 text-navy">{{ myRooms.length }}</h3>
            <small class="text-muted fw-semibold stat-label">My Rooms</small>
          </template>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="stat-card card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="icon-shape bg-primary-light"><i class="bi bi-calendar-check-fill"></i></div>
            <span class="trend-badge trend-up"><i class="bi bi-arrow-up me-1"></i>5%</span>
          </div>
          <div v-if="loading">
            <div class="skel-line" style="width: 60px; height: 28px; border-radius: 8px"></div>
          </div>
          <template v-else>
            <h3 class="fw-bold mb-0 text-navy">{{ bookings.length }}</h3>
            <small class="text-muted fw-semibold stat-label">Total Bookings</small>
          </template>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="stat-card card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="icon-shape bg-success-light"><i class="bi bi-house-check-fill"></i></div>
            <span class="trend-badge trend-up"><i class="bi bi-arrow-up me-1"></i>3%</span>
          </div>
          <div v-if="loading">
            <div class="skel-line" style="width: 60px; height: 28px; border-radius: 8px"></div>
          </div>
          <template v-else>
            <h3 class="fw-bold mb-0 text-navy">{{ approvedRents }}</h3>
            <small class="text-muted fw-semibold stat-label">Rented Rooms</small>
          </template>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="stat-card card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="icon-shape bg-purple-light"><i class="bi bi-hourglass-split"></i></div>
            <span
              class="trend-badge"
              :class="pendingBookings + pendingRents > 0 ? 'trend-warn' : 'trend-up'"
            >
              <i class="bi bi-clock me-1"></i>{{ pendingBookings + pendingRents }}
            </span>
          </div>
          <div v-if="loading">
            <div class="skel-line" style="width: 60px; height: 28px; border-radius: 8px"></div>
          </div>
          <template v-else>
            <h3 class="fw-bold mb-0 text-navy">{{ pendingBookings + pendingRents }}</h3>
            <small class="text-muted fw-semibold stat-label">Needs Action</small>
          </template>
        </div>
      </div>
    </div>

    <!-- ── Overview bars + Room donut ── -->
    <div class="row g-3 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <h5 class="fw-bold text-navy mb-4">
            <i class="bi bi-bar-chart-fill me-2 text-orange"></i>Booking & Rent Overview
          </h5>
          <div v-if="loading">
            <div
              v-for="i in 4"
              :key="i"
              class="skel-line mb-3"
              style="height: 36px; border-radius: 10px"
            ></div>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold text-navy"
                  ><i class="bi bi-clock-fill me-2 text-warning"></i>Pending Bookings</span
                >
                <span class="small fw-bold text-navy">{{ pendingBookings }}</span>
              </div>
              <div class="progress" style="height: 8px; border-radius: 10px; background: #f0f2f5">
                <div
                  class="progress-bar"
                  style="background: #f59e0b; border-radius: 10px"
                  :style="{ width: barPct(pendingBookings, bookings.length) + '%' }"
                ></div>
              </div>
            </div>
            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold text-navy"
                  ><i class="bi bi-check-circle-fill me-2 text-success"></i>Approved Bookings</span
                >
                <span class="small fw-bold text-navy">{{ approvedBookings }}</span>
              </div>
              <div class="progress" style="height: 8px; border-radius: 10px; background: #f0f2f5">
                <div
                  class="progress-bar bg-success"
                  style="border-radius: 10px"
                  :style="{ width: barPct(approvedBookings, bookings.length) + '%' }"
                ></div>
              </div>
            </div>
            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold text-navy"
                  ><i class="bi bi-clock-fill me-2" style="color: #8b5cf6"></i>Pending Rents</span
                >
                <span class="small fw-bold text-navy">{{ pendingRents }}</span>
              </div>
              <div class="progress" style="height: 8px; border-radius: 10px; background: #f0f2f5">
                <div
                  class="progress-bar"
                  style="background: #8b5cf6; border-radius: 10px"
                  :style="{ width: barPct(pendingRents, rents.length) + '%' }"
                ></div>
              </div>
            </div>
            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="small fw-semibold text-navy"
                  ><i class="bi bi-house-check-fill me-2 text-info"></i>Approved Rents</span
                >
                <span class="small fw-bold text-navy">{{ approvedRents }}</span>
              </div>
              <div class="progress" style="height: 8px; border-radius: 10px; background: #f0f2f5">
                <div
                  class="progress-bar bg-info"
                  style="border-radius: 10px"
                  :style="{ width: barPct(approvedRents, rents.length) + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="row g-2 mt-4">
            <div class="col-4">
              <div class="summary-chip">
                <div class="fw-bold text-navy">{{ bookings.length }}</div>
                <div class="text-muted" style="font-size: 0.7rem">Total Bookings</div>
              </div>
            </div>
            <div class="col-4">
              <div class="summary-chip">
                <div class="fw-bold text-navy">{{ rents.length }}</div>
                <div class="text-muted" style="font-size: 0.7rem">Total Rents</div>
              </div>
            </div>
            <div class="col-4">
              <div class="summary-chip">
                <div class="fw-bold text-orange">{{ pendingBookings + pendingRents }}</div>
                <div class="text-muted" style="font-size: 0.7rem">Needs Action</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <h5 class="fw-bold text-navy mb-4">
            <i class="bi bi-pie-chart-fill me-2 text-orange"></i>Room Split
          </h5>
          <div class="d-flex justify-content-center mb-3">
            <div class="donut-wrap position-relative">
              <svg viewBox="0 0 36 36" class="donut-svg">
                <circle class="donut-ring" cx="18" cy="18" r="15.9" />
                <circle
                  class="donut-segment seg-active"
                  cx="18"
                  cy="18"
                  r="15.9"
                  :stroke-dasharray="`${roomStats.active} ${100 - roomStats.active}`"
                  stroke-dashoffset="25"
                />
                <circle
                  class="donut-segment seg-promo"
                  cx="18"
                  cy="18"
                  r="15.9"
                  :stroke-dasharray="`${roomStats.promo} ${100 - roomStats.promo}`"
                  :stroke-dashoffset="`${125 - roomStats.active}`"
                />
              </svg>
              <div class="donut-center">
                <div class="fw-bold text-navy" style="font-size: 1.1rem">{{ myRooms.length }}</div>
                <div class="text-muted" style="font-size: 0.65rem">Total</div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column gap-2 mb-4">
            <div class="d-flex justify-content-between">
              <span class="d-flex align-items-center gap-2 small"
                ><span class="legend-dot" style="background: #198754"></span>Active</span
              >
              <span class="fw-bold text-navy small">{{ roomStats.active }}%</span>
            </div>
            <div class="d-flex justify-content-between">
              <span class="d-flex align-items-center gap-2 small"
                ><span class="legend-dot" style="background: #ff5f00"></span>On Promo</span
              >
              <span class="fw-bold text-navy small">{{ roomStats.promo }}%</span>
            </div>
          </div>
          <div class="avg-price-box">
            <div class="text-muted small mb-1">Average Room Price</div>
            <div class="fw-bold text-orange" style="font-size: 1.4rem">{{ avgPrice }}</div>
            <div class="text-muted" style="font-size: 0.72rem">per month</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Recent Bookings + Rents ── -->
    <div class="row g-3 mb-4">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
          <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-white"
              ><i class="bi bi-calendar-check me-2"></i>Recent Bookings</span
            >
            <div class="d-flex gap-2 align-items-center">
              <span v-if="pendingBookings > 0" class="badge-count"
                >{{ pendingBookings }} pending</span
              >
              <router-link to="/provider/booking-check" class="btn btn-xs btn-outline-light"
                >View All</router-link
              >
            </div>
          </div>
          <div v-if="loading" class="p-4">
            <div v-for="i in 4" :key="i" class="skel-line mb-3"></div>
          </div>
          <div class="table-responsive" v-else>
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4 small fw-bold text-muted">Room / Tenant</th>
                  <th class="small fw-bold text-muted">Date</th>
                  <th class="small fw-bold text-muted">Status</th>
                  <th class="small fw-bold text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in recentBookings" :key="b.id">
                  <td class="ps-4">
                    <div class="fw-semibold small text-navy text-truncate" style="max-width: 120px">
                      {{ b.room?.title || '–' }}
                    </div>
                    <div class="text-muted" style="font-size: 0.72rem">
                      {{ b.buyer?.name || b.user?.name || '–' }}
                    </div>
                  </td>
                  <td class="small text-muted">{{ formatDate(b.created_at) }}</td>
                  <td>
                    <span :class="['status-pill', statusClass(b.status)]">{{
                      statusLabel(b.status)
                    }}</span>
                  </td>
                  <td>
                    <div class="d-flex gap-1" v-if="isPending(b.status)">
                      <button
                        class="btn-action approve"
                        @click="approveBooking(b.id)"
                        :disabled="actionId === b.id"
                        title="Approve"
                      >
                        <i class="bi bi-check-lg"></i>
                      </button>
                      <button
                        class="btn-action reject"
                        @click="rejectBooking(b.id)"
                        :disabled="actionId === b.id"
                        title="Reject"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                    <span v-else class="text-muted small">–</span>
                  </td>
                </tr>
                <tr v-if="recentBookings.length === 0">
                  <td colspan="4" class="text-center py-5">
                    <i
                      class="bi bi-calendar-x d-block mb-2"
                      style="font-size: 1.8rem; opacity: 0.2"
                    ></i>
                    <span class="text-muted small">No bookings yet</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
          <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-white"
              ><i class="bi bi-house-check me-2"></i>Recent Rents</span
            >
            <div class="d-flex gap-2 align-items-center">
              <span v-if="pendingRents > 0" class="badge-count">{{ pendingRents }} pending</span>
              <router-link to="/provider/rent-check" class="btn btn-xs btn-outline-light"
                >View All</router-link
              >
            </div>
          </div>
          <div v-if="loading" class="p-4">
            <div v-for="i in 4" :key="i" class="skel-line mb-3"></div>
          </div>
          <div class="table-responsive" v-else>
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4 small fw-bold text-muted">Room / Tenant</th>
                  <th class="small fw-bold text-muted">Date</th>
                  <th class="small fw-bold text-muted">Status</th>
                  <th class="small fw-bold text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in recentRents" :key="r.id">
                  <td class="ps-4">
                    <div class="fw-semibold small text-navy text-truncate" style="max-width: 120px">
                      {{ r.room?.title || '–' }}
                    </div>
                    <div class="text-muted" style="font-size: 0.72rem">
                      {{ r.buyer?.name || r.user?.name || '–' }}
                    </div>
                  </td>
                  <td class="small text-muted">{{ formatDate(r.created_at) }}</td>
                  <td>
                    <span :class="['status-pill', statusClass(r.status)]">{{
                      statusLabel(r.status)
                    }}</span>
                  </td>
                  <td>
                    <div class="d-flex gap-1" v-if="isPending(r.status)">
                      <button
                        class="btn-action approve"
                        @click="approveRent(r.id)"
                        :disabled="actionId === r.id"
                        title="Approve"
                      >
                        <i class="bi bi-check-lg"></i>
                      </button>
                      <button
                        class="btn-action reject"
                        @click="rejectRent(r.id)"
                        :disabled="actionId === r.id"
                        title="Reject"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                    <span v-else class="text-muted small">–</span>
                  </td>
                </tr>
                <tr v-if="recentRents.length === 0">
                  <td colspan="4" class="text-center py-5">
                    <i
                      class="bi bi-house-slash d-block mb-2"
                      style="font-size: 1.8rem; opacity: 0.2"
                    ></i>
                    <span class="text-muted small">No rent requests yet</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ── My Rooms + Quick Actions ── -->
    <div class="row g-3">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-white"><i class="bi bi-house-door me-2"></i>My Rooms</span>
            <router-link to="/provider/my-rooms" class="btn btn-xs btn-outline-light"
              >View All</router-link
            >
          </div>
          <div v-if="loading" class="p-4">
            <div v-for="i in 4" :key="i" class="skel-line mb-3"></div>
          </div>
          <div class="table-responsive" v-else>
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4 small fw-bold text-muted">Room</th>
                  <th class="small fw-bold text-muted">District</th>
                  <th class="small fw-bold text-muted">Price</th>
                  <th class="small fw-bold text-muted">Status</th>
                  <th class="small fw-bold text-muted">Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="room in myRooms.slice(0, 6)" :key="room.id">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-2">
                      <div class="room-thumb">
                        <img v-if="room.image" :src="room.image" class="room-thumb-img" />
                        <i v-else class="bi bi-building text-muted" style="font-size: 0.8rem"></i>
                      </div>
                      <span
                        class="fw-semibold small text-navy text-truncate"
                        style="max-width: 120px"
                        >{{ room.title }}</span
                      >
                    </div>
                  </td>
                  <td class="small text-muted">{{ room.district?.name || '–' }}</td>
                  <td class="fw-bold small text-orange">${{ room.price }}</td>
                  <td>
                    <span v-if="room.percent_promotion > 0" class="status-pill pill-promo"
                      >-{{ room.percent_promotion }}%</span
                    >
                    <span v-else class="status-pill pill-active">Active</span>
                  </td>
                  <td>
                    <router-link
                      :to="`/provider/edit-room/${room.id}`"
                      class="btn-action edit"
                      title="Edit"
                    >
                      <i class="bi bi-pencil-fill"></i>
                    </router-link>
                  </td>
                </tr>
                <tr v-if="myRooms.length === 0">
                  <td colspan="5" class="text-center py-5">
                    <i
                      class="bi bi-house-slash d-block mb-2"
                      style="font-size: 1.8rem; opacity: 0.2"
                    ></i>
                    <span class="text-muted small">No rooms posted yet</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-lg-4 d-flex flex-column gap-3">
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <h5 class="fw-bold text-navy mb-3">
            <i class="bi bi-lightning-fill me-2 text-orange"></i>Quick Actions
          </h5>
          <div class="d-flex flex-column gap-2">
            <router-link
              v-for="a in quickActions"
              :key="a.to"
              :to="a.to"
              class="action-box text-decoration-none"
            >
              <div :class="['action-icon', a.bg]">
                <i :class="['bi', a.icon]" :style="{ color: a.color }"></i>
              </div>
              <div>
                <div class="fw-bold small text-navy">{{ a.title }}</div>
                <div class="text-muted" style="font-size: 0.72rem">{{ a.sub }}</div>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted small"></i>
            </router-link>
          </div>
        </div>

        <div
          class="card border-0 shadow-sm rounded-4 p-4 flex-fill"
          style="border: 1.5px solid #eee"
        >
          <h5 class="fw-bold text-navy mb-4">
            <i class="bi bi-hdd-network-fill me-2 text-orange"></i>Account Status
          </h5>
          <div class="d-flex justify-content-between mb-3">
            <span class="small text-muted">Role</span>
            <span
              class="badge"
              style="
                background: rgba(255, 95, 0, 0.12);
                color: #ff5f00;
                font-size: 0.7rem;
                font-weight: 800;
              "
              >Service Provider</span
            >
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="small text-muted">My Rooms</span>
            <span class="fw-bold text-navy">{{ myRooms.length }}</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="small text-muted">Avg. Price</span>
            <span class="fw-bold text-navy">{{ avgPrice }}</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="small text-muted">Pending Actions</span>
            <span class="fw-bold" style="color: #f59e0b">{{ pendingBookings + pendingRents }}</span>
          </div>
          <div class="d-flex justify-content-between mb-4">
            <span class="small text-muted">Total Approved</span>
            <span class="fw-bold text-success">{{ approvedBookings + approvedRents }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <transition name="toast-slide">
    <div v-if="toast.show" class="provider-toast" :class="toast.type">
      <i
        class="bi me-2"
        :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"
      ></i>
      {{ toast.message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoomStore } from '@/stores/RoomStore'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/http'

const roomStore = useRoomStore()
const authStore = useAuthStore()
const loading = ref(false)
const actionId = ref(null)
const lastRefresh = ref('')
const bookings = ref([])
const rents = ref([])
const toast = reactive({ show: false, message: '', type: 'success' })

const showToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => (toast.show = false), 3000)
}

// ── My rooms — delegate to the store which filters by creator.id ──
const myRooms = computed(() => roomStore.myRooms)

const promoRooms = computed(() => myRooms.value.filter((r) => r.percent_promotion > 0))

const avgPrice = computed(() => {
  if (!myRooms.value.length) return '$0'
  const avg = myRooms.value.reduce((s, r) => s + Number(r.price || 0), 0) / myRooms.value.length
  return '$' + Math.round(avg)
})

const roomStats = computed(() => {
  const total = myRooms.value.length || 1
  const promo = promoRooms.value.length
  const promoP = Math.round((promo / total) * 100)
  return { active: Math.max(0, 100 - promoP), promo: promoP }
})

// ── Status helpers ─────────────────────────────────────────
const getStatusKey = (s) => {
  if (s == 2 || s === 'approved') return 'approved'
  if (s == 3 || s === 'rejected') return 'rejected'
  return 'pending'
}

const pendingBookings = computed(
  () => bookings.value.filter((b) => getStatusKey(b.status) === 'pending').length,
)
const approvedBookings = computed(
  () => bookings.value.filter((b) => getStatusKey(b.status) === 'approved').length,
)
const pendingRents = computed(
  () => rents.value.filter((r) => getStatusKey(r.status) === 'pending').length,
)
const approvedRents = computed(
  () => rents.value.filter((r) => getStatusKey(r.status) === 'approved').length,
)

const recentBookings = computed(() => bookings.value.slice(0, 6))
const recentRents = computed(() => rents.value.slice(0, 6))

const isPending = (s) => getStatusKey(s) === 'pending'
const barPct = (val, total) => (total ? Math.round((val / total) * 100) : 0)
const statusClass = (s) =>
  ({ pending: 'pill-pending', approved: 'pill-approved', rejected: 'pill-rejected' })[
    getStatusKey(s)
  ]
const statusLabel = (s) =>
  ({ pending: 'Pending', approved: 'Approved', rejected: 'Rejected' })[getStatusKey(s)]

const todayDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const formatDate = (dt) => {
  if (!dt) return '–'
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const quickActions = [
  {
    to: '/provider/my-rooms',
    title: 'My Rooms',
    sub: 'View & manage listings',
    icon: 'bi-house-door-fill',
    bg: 'bg-orange-light',
    color: '#ff5f00',
  },
  {
    to: '/provider/add-room',
    title: 'Post New Room',
    sub: 'Add a listing',
    icon: 'bi-plus-circle-fill',
    bg: 'bg-success-light',
    color: '#198754',
  },
  {
    to: '/provider/booking-check',
    title: 'Booking Requests',
    sub: 'Approve or reject',
    icon: 'bi-calendar-check-fill',
    bg: 'bg-primary-light',
    color: '#0d6efd',
  },
  {
    to: '/provider/rent-check',
    title: 'Rent Requests',
    sub: 'Approve or reject',
    icon: 'bi-house-check-fill',
    bg: 'bg-purple-light',
    color: '#8b5cf6',
  },
  {
    to: '/provider/profile',
    title: 'My Profile',
    sub: 'Edit account info',
    icon: 'bi-person-fill',
    bg: 'bg-navy-light',
    color: '#031c36',
  },
]

// ── Actions (same as BookingCheckingList / RentCheckingList) ──
const approveBooking = async (id) => {
  actionId.value = id
  try {
    await api.put(`/books/approve/${id}`)
    const b = bookings.value.find((x) => x.id === id)
    if (b) b.status = 2
    showToast('Booking approved!')
  } catch (e) {
    showToast(e.response?.data?.message || 'Failed', 'error')
  } finally {
    actionId.value = null
  }
}

const rejectBooking = async (id) => {
  actionId.value = id
  try {
    await api.put(`/books/reject/${id}`)
    const b = bookings.value.find((x) => x.id === id)
    if (b) b.status = 3
    showToast('Booking rejected.')
  } catch (e) {
    showToast(e.response?.data?.message || 'Failed', 'error')
  } finally {
    actionId.value = null
  }
}

const approveRent = async (id) => {
  actionId.value = id
  try {
    await api.put(`/rents/approve/${id}`)
    const r = rents.value.find((x) => x.id === id)
    if (r) r.status = 2
    showToast('Rent approved!')
  } catch (e) {
    showToast(e.response?.data?.message || 'Failed', 'error')
  } finally {
    actionId.value = null
  }
}

const rejectRent = async (id) => {
  actionId.value = id
  try {
    await api.put(`/rents/reject/${id}`)
    const r = rents.value.find((x) => x.id === id)
    if (r) r.status = 3
    showToast('Rent rejected.')
  } catch (e) {
    showToast(e.response?.data?.message || 'Failed', 'error')
  } finally {
    actionId.value = null
  }
}

// ── Fetch — mirrors exact API calls from your related pages ──
async function refreshAll() {
  loading.value = true
  try {
    if (!authStore.user) await authStore.fetchMe()

    // Fetch MY rooms (filters by creator.id inside the store)
    await roomStore.fetchMyRooms()

    // BookingCheckingList.vue uses:  GET /profile/booking-check
    // RentCheckingList.vue uses:     GET /profile/rent-check
    // Dashboard mirrors the same endpoints
    const [bookRes, rentRes] = await Promise.all([
      api.get('/profile/booking-check', { params: { page: 1, per_page: 50 } }),
      api.get('/profile/rent-check', { params: { page: 1, per_page: 50 } }),
    ])

    // Match exact response parsing from your BookingCheckingList:
    // bookings.value = res.data.data || []
    bookings.value = bookRes.data?.data || bookRes.data || []
    rents.value = rentRes.data?.data || rentRes.data || []

    lastRefresh.value = new Date().toLocaleTimeString()
  } catch (err) {
    console.error('Dashboard refresh error:', err)
    showToast('Failed to load some data', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(refreshAll)
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

.btn-orange {
  background: #ff5f00;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 8px 18px;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-orange:hover {
  background: #e65600;
  color: #fff;
  transform: translateY(-1px);
}
.btn-outline-navy {
  border: 1.5px solid #031c36;
  color: #031c36;
  border-radius: 10px;
  background: transparent;
  font-weight: 600;
  padding: 8px 14px;
  transition: all 0.2s;
}
.btn-outline-navy:hover {
  background: #031c36;
  color: #fff;
}
.btn-xs {
  font-size: 0.72rem;
  padding: 4px 10px;
  border-radius: 20px;
}

.stat-card {
  transition:
    transform 0.25s,
    box-shadow 0.25s;
  border-top: 3px solid transparent;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(3, 28, 54, 0.12) !important;
  border-top-color: #ff5f00;
}
.stat-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.icon-shape {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.bg-orange-light {
  background: #fff4ed;
  color: #ff5f00;
}
.bg-primary-light {
  background: #e7f1ff;
  color: #0d6efd;
}
.bg-success-light {
  background: #e9faf1;
  color: #198754;
}
.bg-purple-light {
  background: #f3e8ff;
  color: #8b5cf6;
}
.bg-navy-light {
  background: rgba(3, 28, 54, 0.08);
  color: #031c36;
}
.trend-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
}
.trend-up {
  background: #e9faf1;
  color: #198754;
}
.trend-down {
  background: #ffebee;
  color: #e53935;
}
.trend-warn {
  background: #fff8e1;
  color: #f59e0b;
}

.summary-chip {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  border: 1px solid #eee;
}
.avg-price-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  border: 1px solid #eee;
}

.donut-wrap {
  width: 130px;
  height: 130px;
}
.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.donut-ring {
  fill: none;
  stroke: #f0f2f5;
  stroke-width: 3.8;
}
.donut-segment {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s;
}
.seg-active {
  stroke: #198754;
}
.seg-promo {
  stroke: #ff5f00;
}
.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.room-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f3f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.room-thumb-img {
  width: 36px;
  height: 36px;
  object-fit: cover;
}

.status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.pill-pending {
  background: #fff8e1;
  color: #f59e0b;
}
.pill-approved {
  background: #e9faf1;
  color: #198754;
}
.pill-rejected {
  background: #ffebee;
  color: #e53935;
}
.pill-active {
  background: #e9faf1;
  color: #198754;
}
.pill-promo {
  background: #fff4ed;
  color: #ff5f00;
}

.badge-count {
  background: rgba(255, 95, 0, 0.2);
  color: #ff9a5c;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 20px;
}

.btn-action {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-action.approve {
  background: #e9faf1;
  color: #198754;
}
.btn-action.approve:hover:not(:disabled) {
  background: #198754;
  color: #fff;
}
.btn-action.reject {
  background: #ffebee;
  color: #e53935;
}
.btn-action.reject:hover:not(:disabled) {
  background: #e53935;
  color: #fff;
}
.btn-action.edit {
  background: #e7f1ff;
  color: #0d6efd;
}
.btn-action.edit:hover {
  background: #0d6efd;
  color: #fff;
}
.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8f9fa;
  border-radius: 12px;
  color: #031c36;
  border: 1.5px solid transparent;
  transition: all 0.2s;
}
.action-box:hover {
  background: #fff;
  border-color: #ff5f00;
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(255, 95, 0, 0.1);
  color: #031c36;
}
.action-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.skel-line {
  display: block;
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
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

.spin {
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.provider-toast {
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
.provider-toast.success {
  background: #031c36;
}
.provider-toast.error {
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
