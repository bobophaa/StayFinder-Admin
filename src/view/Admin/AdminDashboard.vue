<template>
  <div class="admin-dashboard p-4">


    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-navy mb-1">Welcome back, {{ user?.name || 'Admin' }}</h2>
        <p class="text-muted mb-0">
          Here's what's happening with
          <span class="fw-bold text-navy">StayFinder</span> today —
          <span class="text-muted small">{{ todayDate }}</span>
        </p>
      </div>
      <!-- <button class="btn btn-orange px-4 fw-bold" @click="refreshAll" :disabled="loading">
        <i class="bi me-2" :class="loading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'"></i>
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button> -->
    </div>


    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3" v-for="(stat, i) in statCards" :key="i">
        <div class="stat-card card border-0 shadow-sm rounded-4 p-3 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div :class="['icon-shape', stat.bgClass]">
              <i :class="['bi', stat.icon]"></i>
            </div>
            <span :class="['trend-badge', stat.trend >= 0 ? 'trend-up' : 'trend-down']">
              <i class="bi me-1" :class="stat.trend >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
              {{ Math.abs(stat.trend) }}%
            </span>
          </div>
          <div v-if="loading" class="skeleton-line mt-1" style="width:70px;height:28px;border-radius:8px"></div>
          <template v-else>
            <h3 class="fw-bold mb-0 text-navy">{{ stat.value }}</h3>
            <small class="text-muted fw-semibold text-uppercase" style="letter-spacing:.05em;font-size:.68rem">{{ stat.title }}</small>
          </template>
        </div>
      </div>
    </div>

    
    <div class="row g-3 mb-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h5 class="fw-bold text-navy mb-0">
              <i class="bi bi-bar-chart-fill me-2 text-orange"></i>Booking Activity
            </h5>
            <div class="d-flex gap-1">
              <button v-for="p in ['7d','30d','90d']" :key="p" class="btn btn-xs"
                :class="chartPeriod === p ? 'btn-orange' : 'btn-outline-secondary'"
                @click="chartPeriod = p">{{ p }}</button>
            </div>
          </div>
          <div class="chart-bars d-flex align-items-end gap-1 gap-md-2">
            <div v-for="(bar, i) in chartData" :key="i" class="chart-bar-wrap flex-fill text-center">
              <div class="chart-bar-value">{{ bar.value }}</div>
              <div class="chart-bar" :style="{ height: barHeight(bar.value) + 'px' }" :title="bar.label + ': ' + bar.value"></div>
              <div class="chart-bar-label">{{ bar.label }}</div>
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
                <circle class="donut-ring" cx="18" cy="18" r="15.9"/>
                <circle class="donut-segment seg-available" cx="18" cy="18" r="15.9"
                  :stroke-dasharray="`${roomStats.available} ${100-roomStats.available}`" stroke-dashoffset="25"/>
                <circle class="donut-segment seg-regular" cx="18" cy="18" r="15.9"
                  :stroke-dasharray="`${roomStats.regular} ${100-roomStats.regular}`"
                  :stroke-dashoffset="`${125 - roomStats.available}`"/>
                <circle class="donut-segment seg-promo" cx="18" cy="18" r="15.9"
                  :stroke-dasharray="`${roomStats.promo} ${100-roomStats.promo}`"
                  :stroke-dashoffset="`${125 - roomStats.available - roomStats.regular}`"/>
              </svg>
              <div class="donut-center">
                <div class="fw-bold text-navy" style="font-size:1.1rem">{{ roomStore.rooms?.length || 0 }}</div>
                <div class="text-muted" style="font-size:.65rem">Rooms</div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column gap-2">
            <div class="d-flex justify-content-between align-items-center">
              <span class="d-flex align-items-center gap-2 small"><span class="legend-dot" style="background:#198754"></span>High-priced</span>
              <span class="fw-bold text-navy small">{{ roomStats.available }}%</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="d-flex align-items-center gap-2 small"><span class="legend-dot" style="background:#0d6efd"></span>Mid-range</span>
              <span class="fw-bold text-navy small">{{ roomStats.regular }}%</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="d-flex align-items-center gap-2 small"><span class="legend-dot" style="background:#ff5f00"></span>Promo</span>
              <span class="fw-bold text-navy small">{{ roomStats.promo }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tables Row ── -->
    <div class="row g-3 mb-4">
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
          <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-white"><i class="bi bi-house-door me-2"></i>Recent Rooms</span>
            <router-link to="/admin/rooms" class="btn btn-xs btn-outline-light">View All</router-link>
          </div>
          <div v-if="loading" class="p-4">
            <div v-for="i in 5" :key="i" class="skeleton-line mb-3"></div>
          </div>
          <div class="table-responsive" v-else>
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4 small fw-bold text-muted">#</th>
                  <th class="small fw-bold text-muted">Title</th>
                  <th class="small fw-bold text-muted">District</th>
                  <th class="small fw-bold text-muted">Price</th>
                  <th class="small fw-bold text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="room in recentRooms" :key="room.id">
                  <td class="ps-4 text-muted small">{{ room.id }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="room-thumb">
                        <img v-if="room.image" :src="room.image" class="room-thumb-img"/>
                        <i v-else class="bi bi-building text-muted" style="font-size:.9rem"></i>
                      </div>
                      <span class="fw-semibold small text-navy text-truncate" style="max-width:130px">{{ room.title }}</span>
                    </div>
                  </td>
                  <td class="small text-muted">{{ room.district?.name || '–' }}</td>
                  <td class="fw-bold small text-orange">${{ room.price }}</td>
                  <td>
                    <span v-if="room.percent_promotion > 0" class="status-pill pill-promo">-{{ room.percent_promotion }}% Promo</span>
                    <span v-else class="status-pill pill-active">Active</span>
                  </td>
                </tr>
                <tr v-if="recentRooms.length === 0">
                  <td colspan="5" class="text-center text-muted py-4 small">No rooms yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
          <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-white"><i class="bi bi-calendar-check me-2"></i>Recent Bookings</span>
            <router-link to="/admin/bookings" class="btn btn-xs btn-outline-light">View All</router-link>
          </div>
          <div v-if="loading" class="p-4">
            <div v-for="i in 5" :key="i" class="skeleton-line mb-3"></div>
          </div>
          <div class="table-responsive" v-else>
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4 small fw-bold text-muted">Room</th>
                  <th class="small fw-bold text-muted">Date</th>
                  <th class="small fw-bold text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in recentBookings" :key="b.id">
                  <td class="ps-4 fw-semibold small text-navy text-truncate" style="max-width:130px">{{ b.room?.title || '–' }}</td>
                  <td class="text-muted small">{{ formatDate(b.checkin_date) }}</td>
                  <td><span :class="['status-pill', statusClass(b.status)]">{{ statusLabel(b.status) }}</span></td>
                </tr>
                <tr v-if="recentBookings.length === 0">
                  <td colspan="3" class="text-center py-5">
                    <i class="bi bi-calendar-x d-block mb-2" style="font-size:1.8rem;opacity:.2"></i>
                    <span class="text-muted small">No bookings yet</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div> -->
    </div>

    <!-- ── District Breakdown ── -->
    <div class="row g-3 mb-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-navy mb-0">
              <i class="bi bi-geo-alt-fill me-2 text-orange"></i>Rooms by District
            </h5>
            <router-link to="/admin/districts" class="small fw-bold text-decoration-none text-orange">Manage</router-link>
          </div>
          <div v-if="loading">
            <div v-for="i in 4" :key="i" class="skeleton-line mb-3"></div>
          </div>
          <div v-else class="row g-3">
            <div class="col-md-6" v-for="d in districtBreakdown" :key="d.id">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small fw-semibold text-navy">{{ d.name }}</span>
                <span class="small text-muted">{{ d.count }} room{{ d.count !== 1 ? 's' : '' }}</span>
              </div>
              <div class="progress" style="height:7px;border-radius:10px;background:#f0f2f5">
                <div class="progress-bar" style="background:linear-gradient(90deg,#ff5f00,#ff9a5c);border-radius:10px;transition:width .6s ease"
                  :style="{ width: d.pct + '%' }"></div>
              </div>
            </div>
            <div v-if="districtBreakdown.length === 0" class="col-12 text-center text-muted small py-3">
              No district data available
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Bottom Row ── -->
    <div class="row g-3">

      <!-- Quick Actions -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <h5 class="fw-bold text-navy mb-4">
            <i class="bi bi-lightning-fill me-2 text-orange"></i>Quick Actions
          </h5>
          <div class="d-flex flex-column gap-2">
            <router-link v-for="action in quickActions" :key="action.to" :to="action.to" class="action-box text-decoration-none">
              <div :class="['action-icon', action.bg]">
                <i :class="['bi', action.icon]" :style="{ color: action.color }"></i>
              </div>
              <div>
                <div class="fw-bold small text-navy">{{ action.title }}</div>
                <div class="text-muted" style="font-size:.72rem">{{ action.sub }}</div>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted small"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Top Promo Rooms -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-navy mb-0">
              <i class="bi bi-tag-fill me-2 text-orange"></i>Top Promotions
            </h5>
            <span class="badge-count">{{ promoRooms.length }}</span>
          </div>
          <div v-if="loading">
            <div v-for="i in 4" :key="i" class="d-flex gap-2 mb-3">
              <div class="skeleton-circle" style="width:40px;height:40px;border-radius:10px;flex-shrink:0"></div>
              <div class="flex-fill"><div class="skeleton-line mb-1"></div><div class="skeleton-line" style="width:60%"></div></div>
            </div>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <div v-for="room in promoRooms.slice(0,5)" :key="room.id" class="d-flex align-items-center gap-3">
              <div class="room-thumb" style="width:42px;height:42px;border-radius:10px;flex-shrink:0;overflow:hidden">
                <img v-if="room.image" :src="room.image" style="width:42px;height:42px;object-fit:cover"/>
                <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                  <i class="bi bi-building text-muted"></i>
                </div>
              </div>
              <div class="flex-fill overflow-hidden">
                <div class="fw-semibold small text-navy text-truncate">{{ room.title }}</div>
                <div class="text-muted" style="font-size:.72rem">${{ room.price }}/mo · {{ room.district?.name || '–' }}</div>
              </div>
              <span class="promo-pill">-{{ room.percent_promotion }}%</span>
            </div>
            <div v-if="promoRooms.length === 0" class="text-center py-4">
              <i class="bi bi-tag d-block mb-2" style="font-size:1.8rem;opacity:.2"></i>
              <span class="text-muted small">No promotions active</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Status + Activity Feed -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100  text-black">
          <h5 class="fw-bold mb-4">
            <i class="bi bi-hdd-network-fill me-2" style="color:#ff9a5c"></i>System Status
          </h5>

          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="small opacity-75">API Response</span>
            <span class="badge" :class="apiMs < 200 ? 'bg-success' : 'bg-warning'">{{ apiMs }}ms</span>
          </div>
          <div class="progress mb-4" style="height:5px;background:rgba(255,255,255,.12);border-radius:10px">
            <div class="progress-bar border-radius-10" :class="apiMs < 200 ? 'bg-success' : 'bg-warning'"
              :style="{ width: Math.min((apiMs/500)*100, 100) + '%', borderRadius:'10px' }"></div>
          </div>

          <div class="d-flex justify-content-between mb-3">
            <span class="small opacity-75">Database</span>
            <span class="small text-success"><i class="bi bi-check-circle-fill me-1"></i>Connected</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="small opacity-75">Total Rooms</span>
            <span class="fw-bold">{{ roomStore.rooms?.length || 0 }}</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="small opacity-75">Districts</span>
            <span class="fw-bold">{{ districtStore.districts?.length || 0 }}</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="small opacity-75">Avg. Room Price</span>
            <span class="fw-bold">{{ avgPrice }}</span>
          </div>
          <div class="d-flex justify-content-between mb-4">
            <span class="small opacity-75">Active Promos</span>
            <span class="fw-bold" style="color:#ff9a5c">{{ promoRooms.length }}</span>
          </div>

          <hr style="border-color:rgba(255,255,255,.1)"/>

          <p class="small fw-bold mb-3 opacity-75 text-uppercase" style="letter-spacing:.06em;font-size:.68rem">Recent Activity</p>
          <div class="d-flex flex-column gap-3">
            <div v-for="act in activityFeed" :key="act.id" class="d-flex gap-2 align-items-start">
              <div :class="['act-dot flex-shrink-0', act.dotClass]" style="margin-top:5px"></div>
              <div>
                <div class="small" style="opacity:.9;line-height:1.3">{{ act.text }}</div>
                <div class="small opacity-50" style="font-size:.7rem">{{ act.time }}</div>
              </div>
            </div>
          </div>

       
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoomStore } from '@/stores/RoomStore'
import { useDistrictStore } from '@/stores/DistrictStore'

const roomStore      = useRoomStore()
const districtStore  = useDistrictStore()

const loading      = ref(false)
const chartPeriod  = ref('7d')
const apiMs        = ref(0)
const lastRefresh  = ref('')
const recentBookings = ref([]) // replace with bookingStore.bookings when ready

// ── Derived from stores ────────────────────────────────────
const recentRooms = computed(() => (roomStore.rooms || []).slice(0, 6))
const promoRooms  = computed(() => (roomStore.rooms || []).filter(r => r.percent_promotion > 0))

const avgPrice = computed(() => {
  const rooms = roomStore.rooms || []
  if (!rooms.length) return '$0'
  const avg = rooms.reduce((s, r) => s + Number(r.price || 0), 0) / rooms.length
  return '$' + Math.round(avg)
})

// ── District breakdown ─────────────────────────────────────
const districtBreakdown = computed(() => {
  const rooms = roomStore.rooms || []
  const total = rooms.length || 1
  return (districtStore.districts || [])
    .map(d => {
      const count = rooms.filter(r => r.district_id == d.id || r.district?.id == d.id).length
      return { id: d.id, name: d.name, count, pct: Math.round((count / total) * 100) }
    })
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})

// ── Donut stats ────────────────────────────────────────────
const roomStats = computed(() => {
  const total  = roomStore.rooms?.length || 1
  const promo  = promoRooms.value.length
  const promoP = Math.round((promo / total) * 100)
  const regular = Math.round(((total - promo) / total) * 55)
  const avail   = Math.max(0, 100 - promoP - regular)
  return { available: avail, regular, promo: promoP }
})

// ── Stat cards ─────────────────────────────────────────────
const statCards = computed(() => [
  { title: 'Total Rooms',  value: roomStore.rooms?.length || 0,       icon: 'bi-house-door-fill', bgClass: 'bg-orange-light', trend: 8  },
  { title: 'Districts',    value: districtStore.districts?.length || 0, icon: 'bi-geo-alt-fill',  bgClass: 'bg-primary-light', trend: 2  },
  { title: 'Promo Rooms',  value: promoRooms.value.length,            icon: 'bi-tag-fill',        bgClass: 'bg-success-light', trend: 12 },
  { title: 'Avg. Price',   value: avgPrice.value,                     icon: 'bi-wallet2',         bgClass: 'bg-purple-light',  trend: -3 },
])

// ── Quick actions ──────────────────────────────────────────
const quickActions = [
  { to: '/admin/Manage',        title: 'Manage Users',  sub: 'View & set roles',       icon: 'bi-people-fill',      bg: 'bg-primary-light', color: '#0d6efd' },
  { to: '/admin/room-options', title: 'Room Options',  sub: 'Amenities & facilities', icon: 'bi-ui-checks',        bg: 'bg-orange-light',  color: '#ff5f00' },
  { to: '/admin/locations',    title: 'Districts',     sub: 'Manage locations',       icon: 'bi-geo-alt-fill',     bg: 'bg-success-light', color: '#198754' },
  { to: '/provider/add-room',  title: 'Post New Room', sub: 'Add a listing',          icon: 'bi-plus-circle-fill', bg: 'bg-purple-light',  color: '#8b5cf6' },
  { to: '/admin/bookings',     title: 'All Bookings',  sub: 'Approve or reject',      icon: 'bi-calendar-check',   bg: 'bg-orange-light',  color: '#ff5f00' },
]

// ── Activity feed (replace with real events from API) ──────
const activityFeed = ref([
  { id: 1, text: 'New room listed in Chamkar Mon', time: '2 mins ago',  dotClass: 'dot-orange' },
  { id: 2, text: 'Booking #42 approved',           time: '14 mins ago', dotClass: 'dot-green'  },
  { id: 3, text: 'New user registered',            time: '1 hr ago',    dotClass: 'dot-blue'   },
  { id: 4, text: 'Booking #38 rejected',           time: '3 hrs ago',   dotClass: 'dot-red'    },
  { id: 5, text: 'District "Sen Sok" added',       time: 'Yesterday',   dotClass: 'dot-blue'   },
])

// ── Chart ──────────────────────────────────────────────────
const chartData = computed(() => {
  const map = {
    '7d':  { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], values: [4,7,5,9,12,8,6]    },
    '30d': { labels: ['W1','W2','W3','W4'],                       values: [32,45,38,52]        },
    '90d': { labels: ['Jan','Feb','Mar'],                          values: [120,145,98]         },
  }
  const { labels, values } = map[chartPeriod.value]
  return labels.map((label, i) => ({ label, value: values[i] }))
})

const maxBarValue = computed(() => Math.max(...chartData.value.map(b => b.value)))
const barHeight   = (val) => Math.max(8, Math.round((val / maxBarValue.value) * 150))

// ── Helpers ────────────────────────────────────────────────
const todayDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

const formatDate = (dt) => {
  if (!dt) return '–'
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const statusClass = (s) => ({ 1: 'pill-pending', 2: 'pill-approved', 3: 'pill-rejected' })[s] || 'pill-pending'
const statusLabel = (s) => ({ 1: 'Pending', 2: 'Approved', 3: 'Rejected' })[s] || 'Pending'

// ── Refresh ────────────────────────────────────────────────
async function refreshAll() {
  loading.value = true
  const t0 = Date.now()
  await Promise.all([roomStore.fetchRooms(), districtStore.fetchDistricts()])
  apiMs.value       = Date.now() - t0
  lastRefresh.value = new Date().toLocaleTimeString()
  loading.value     = false
}

onMounted(refreshAll)
</script>

<style scoped>
.text-navy   { color: #031c36; }
.bg-navy     { background-color: #031c36; }
.text-orange { color: #ff5f00; }

.btn-orange { background:#ff5f00;color:#fff;border:none;border-radius:10px;transition:background .2s,transform .15s; }
.btn-orange:hover { background:#e65600;color:#fff;transform:translateY(-1px); }
.btn-orange:disabled { opacity:.65;transform:none; }
.btn-xs { font-size:.72rem;padding:4px 10px;border-radius:20px; }
.card-header-navy { background:#031c36;border-bottom:3px solid #ff5f00; }

/* ── Stat cards ── */
.stat-card { transition:transform .25s,box-shadow .25s;border-top:3px solid transparent; }
.stat-card:hover { transform:translateY(-4px);box-shadow:0 12px 30px rgba(3,28,54,.12)!important;border-top-color:#ff5f00; }
.icon-shape { width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:12px;font-size:1.2rem;flex-shrink:0; }
.bg-primary-light { background:#e7f1ff;color:#0d6efd; }
.bg-orange-light  { background:#fff4ed;color:#ff5f00; }
.bg-success-light { background:#e9faf1;color:#198754; }
.bg-purple-light  { background:#f3e8ff;color:#8b5cf6; }
.trend-badge { font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:20px; }
.trend-up    { background:#e9faf1;color:#198754; }
.trend-down  { background:#ffebee;color:#e53935; }

/* ── Chart ── */
.chart-bars { height:190px; }
.chart-bar-wrap { min-width:0; }
.chart-bar { background:linear-gradient(to top,#ff5f00,#ff9a5c);border-radius:6px 6px 0 0;width:100%;transition:height .4s cubic-bezier(.4,0,.2,1),background .2s;cursor:pointer; }
.chart-bar:hover { background:linear-gradient(to top,#031c36,#0d4a8f); }
.chart-bar-value { font-size:.68rem;font-weight:700;color:#031c36;line-height:1.4; }
.chart-bar-label { font-size:.65rem;color:#888;margin-top:4px; }

/* ── Donut ── */
.donut-wrap { width:140px;height:140px; }
.donut-svg  { width:100%;height:100%;transform:rotate(-90deg); }
.donut-ring { fill:none;stroke:#f0f2f5;stroke-width:3.8; }
.donut-segment { fill:none;stroke-width:3.8;stroke-linecap:round;transition:stroke-dasharray .6s ease; }
.seg-available { stroke:#198754; }
.seg-regular   { stroke:#0d6efd; }
.seg-promo     { stroke:#ff5f00; }
.donut-center  { position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center; }
.legend-dot    { width:10px;height:10px;border-radius:50%;flex-shrink:0; }

/* ── Table ── */
.room-thumb { width:36px;height:36px;border-radius:8px;overflow:hidden;background:#f0f3f6;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.room-thumb-img { width:36px;height:36px;object-fit:cover; }

/* ── Pills ── */
.status-pill  { font-size:.68rem;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap; }
.pill-pending  { background:#fff8e1;color:#f59e0b; }
.pill-approved { background:#e9faf1;color:#198754; }
.pill-rejected { background:#ffebee;color:#e53935; }
.pill-active   { background:#e9faf1;color:#198754; }
.pill-promo    { background:#fff4ed;color:#ff5f00; }
.promo-pill    { font-size:.68rem;font-weight:800;padding:3px 9px;border-radius:20px;background:#fff4ed;color:#ff5f00;white-space:nowrap; }
.badge-count   { width:24px;height:24px;border-radius:50%;background:#ff5f00;color:#fff;font-size:.72rem;font-weight:700;display:flex;align-items:center;justify-content:center; }

/* ── Action box ── */
.action-box { display:flex;align-items:center;gap:12px;padding:11px 14px;background:#f8f9fa;border-radius:12px;color:#031c36;border:1.5px solid transparent;transition:all .2s; }
.action-box:hover { background:#fff;border-color:#ff5f00;transform:translateX(4px);box-shadow:0 4px 16px rgba(255,95,0,.1);color:#031c36; }
.action-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0; }

/* ── Activity feed ── */
.act-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
.dot-orange { background:#ff9a5c; }
.dot-green  { background:#4ade80; }
.dot-blue   { background:#60a5fa; }
.dot-red    { background:#f87171; }

/* ── Skeleton ── */
.skeleton-line   { height:14px;border-radius:6px;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite; }
.skeleton-circle { border-radius:50%;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }

.spin { animation:spin .7s linear infinite;display:inline-block; }
@keyframes spin { to{transform:rotate(360deg)} }
</style>