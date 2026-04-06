<template>
  <div class="container-fluid py-3 px-md-4">

    <!-- ── Header ── -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div class="card-header-navy p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 class="fw-bold mb-0 text-white">My Room Listings</h4>
          <small class="opacity-75 text-white">
            {{ roomStore.myRooms.length }} room{{ roomStore.myRooms.length !== 1 ? 's' : '' }} posted by you
          </small>
        </div>
        <router-link to="/provider/add-room" class="btn btn-orange fw-bold px-4">
          <i class="bi bi-plus-circle-fill me-2"></i>Post New Room
        </router-link>
      </div>
    </div>

    <!-- ── Error ── -->
    <div v-if="roomStore.error" class="alert alert-danger rounded-3 mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ roomStore.error }}
    </div>

    <!-- ── Loading ── -->
    <div v-if="roomStore.loading" class="row g-4">
      <div class="col-md-6 col-xl-4" v-for="i in 6" :key="i">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="skeleton-img"></div>
          <div class="p-3">
            <div class="skeleton-line mb-2" style="width:60%"></div>
            <div class="skeleton-line mb-2" style="width:40%"></div>
            <div class="skeleton-line" style="width:80%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="roomStore.myRooms.length === 0" class="empty-state text-center py-5 mt-4">
      <div class="empty-icon mb-4"><i class="bi bi-house-slash"></i></div>
      <h5 class="fw-bold text-navy mb-2">No rooms posted yet</h5>
      <p class="text-muted mb-4">Start earning by listing your first room today.</p>
      <router-link to="/provider/add-room" class="btn btn-orange px-5 py-2 fw-bold">
        <i class="bi bi-plus-circle-fill me-2"></i>Post Your First Room
      </router-link>
    </div>

    <!-- ── Cards ── -->
    <div v-else class="row g-4">
      <div class="col-md-6 col-xl-4" v-for="room in roomStore.myRooms" :key="room.id">
        <div class="room-card card border-0 shadow-sm rounded-4 overflow-hidden h-100">

          <div class="room-img-wrap position-relative">
            <img v-if="room.image" :src="room.image" :alt="room.title" class="room-img" />
            <div v-else class="room-img-placeholder d-flex align-items-center justify-content-center">
              <i class="bi bi-building" style="font-size:2.5rem;color:#ccc"></i>
            </div>
            <span v-if="room.percent_promotion > 0" class="badge-promo">
              <i class="bi bi-tag-fill me-1"></i>-{{ room.percent_promotion }}%
            </span>
            <span class="badge-status">
              <i class="bi bi-circle-fill me-1" style="font-size:.45rem"></i>Active
            </span>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="room-price">${{ room.price }}<small>/month</small></div>
              <span class="district-badge" v-if="room.district">
                <i class="bi bi-geo-alt-fill me-1"></i>{{ room.district.name }}
              </span>
            </div>

            <h6 class="fw-bold text-navy mb-2 room-title">{{ room.title }}</h6>

            <div class="d-flex flex-wrap gap-2 mb-2">
              <span class="spec-chip" v-if="room.bed"><i class="bi bi-person-fill me-1"></i>{{ room.bed }} bed</span>
              <span class="spec-chip" v-if="room.size_room"><i class="bi bi-aspect-ratio me-1"></i>{{ room.size_room }}</span>
            </div>

            <div class="d-flex flex-wrap gap-2 mb-3">
              <span class="bill-chip" v-if="room.pay_water"><i class="bi bi-droplet-fill text-info me-1"></i>${{ room.pay_water }} water</span>
              <span class="bill-chip" v-if="room.pay_electric"><i class="bi bi-lightning-fill text-warning me-1"></i>${{ room.pay_electric }} elec</span>
              <span class="bill-chip" v-if="room.pay_parking"><i class="bi bi-car-front-fill me-1"></i>${{ room.pay_parking }} park</span>
              <span class="bill-chip" v-if="room.pay_trash"><i class="bi bi-trash3-fill text-success me-1"></i>${{ room.pay_trash }} trash</span>
            </div>

            <div class="d-flex flex-wrap gap-1 mb-3" v-if="room.room_options?.length">
              <span class="amenity-tag" v-for="opt in room.room_options.slice(0,3)" :key="opt.id">{{ opt.name }}</span>
              <span class="amenity-tag text-muted" v-if="room.room_options.length > 3">+{{ room.room_options.length - 3 }}</span>
            </div>

            <div class="mt-auto"></div>

            <p class="text-muted small mb-3 room-desc" v-if="room.description">{{ room.description }}</p>

            <div class="d-flex gap-2">
              <router-link :to="`/provider/edit-room/${room.id}`" class="btn btn-edit flex-fill">
                <i class="bi bi-pencil-fill me-2"></i>Edit
              </router-link>
              <button class="btn btn-del" @click="confirmDelete(room)" :disabled="deletingId === room.id">
                <span v-if="deletingId === room.id" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Delete Modal ── -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 overflow-hidden">
          <div class="modal-header" style="background:#031c36;border-bottom:3px solid #ff5f00">
            <h5 class="modal-title fw-bold" style="color:#F4A25A">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Delete Room
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4" v-if="roomToDelete">
            <p class="mb-1 text-muted small">You are about to permanently delete:</p>
            <div class="d-flex align-items-center gap-3 p-3 rounded-3 mb-3" style="background:#f8f9fa;border:1.5px solid #e9ecef">
              <div class="room-thumb">
                <img v-if="roomToDelete.image" :src="roomToDelete.image" class="room-thumb-img" />
                <i v-else class="bi bi-building text-muted"></i>
              </div>
              <div>
                <div class="fw-bold text-navy small">{{ roomToDelete.title }}</div>
                <div class="text-orange fw-bold">${{ roomToDelete.price }}/month

                  
                </div>
              </div>
            </div>
            <div class="alert alert-warning py-2 small rounded-3">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              This action <strong>cannot be undone</strong>.
            </div>
          </div>
          <div class="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
            <button class="btn btn-light rounded-3 px-4" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-danger rounded-3 px-4 fw-bold" @click="executeDelete" :disabled="deletingId !== null">
              <span v-if="deletingId !== null" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-trash3-fill me-2"></i>Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoomStore } from '@/stores/RoomStore'
import { useAuthStore } from '@/stores/auth'
import { alertSuccess, alertError } from '@/Utils/alert'

const roomStore    = useRoomStore()
const authStore    = useAuthStore()
const deletingId   = ref(null)
const roomToDelete = ref(null)
let deleteModalInstance = null

onMounted(async () => {

  if (!authStore.user) await authStore.fetchMe()

  await roomStore.fetchMyRooms()

  const { Modal } = await import('bootstrap')
  deleteModalInstance = new Modal(document.getElementById('deleteModal'))
})

function confirmDelete(room) {
  roomToDelete.value = room
  deleteModalInstance?.show()
}

async function executeDelete() {
  if (!roomToDelete.value) return
  deletingId.value = roomToDelete.value.id
  const success = await roomStore.deleteRoom(roomToDelete.value.id)
  if (success) {
    deleteModalInstance?.hide()
    alertSuccess('Room deleted successfully.')
  } else {
    alertError('Failed to delete the room. Please try again.')
  }
  deletingId.value = null
  roomToDelete.value = null
}
</script>

<style scoped>
.card-header-navy { background:#031c36; border-bottom:3px solid #ff5f00; }
.text-navy   { color:#031c36; }
.text-orange { color:#ff5f00; }

.room-card { transition:box-shadow .25s,transform .25s; border:1.5px solid #f0f0f0 !important; }
.room-card:hover { box-shadow:0 12px 32px rgba(3,28,54,.13)!important; transform:translateY(-4px); }

.room-img-wrap       { height:200px; overflow:hidden; background:#f3f4f6; position:relative; }
.room-img            { width:100%; height:200px; object-fit:cover; transition:transform .35s; }
.room-card:hover .room-img { transform:scale(1.04); }
.room-img-placeholder { width:100%; height:200px; background:linear-gradient(135deg,#e8edf2,#f5f8fb); }

.badge-promo  { position:absolute; top:10px; left:10px; background:#ff5f00; color:#fff; font-size:.7rem; font-weight:700; padding:4px 10px; border-radius:20px; }
.badge-status { position:absolute; top:10px; right:10px; background:rgba(255,255,255,.9); color:#198754; font-size:.7rem; font-weight:700; padding:4px 10px; border-radius:20px; display:flex; align-items:center; backdrop-filter:blur(4px); }

.room-price       { font-size:1.35rem; font-weight:800; color:#ff5f00; line-height:1; }
.room-price small { font-size:.72rem; font-weight:500; color:#999; }
.room-title       { font-size:.92rem; color:#031c36; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
.district-badge   { background:rgba(3,28,54,.07); color:#031c36; font-size:.7rem; font-weight:600; padding:3px 9px; border-radius:20px; white-space:nowrap; }

.spec-chip    { background:#f0f3f6; color:#031c36; font-size:.72rem; font-weight:600; padding:3px 9px; border-radius:20px; }
.bill-chip    { background:#fafafa; border:1px solid #eee; color:#666; font-size:.68rem; font-weight:500; padding:2px 8px; border-radius:20px; }
.amenity-tag  { background:rgba(255,95,0,.08); color:#ff5f00; border:1px solid rgba(255,95,0,.2); font-size:.68rem; font-weight:600; padding:2px 8px; border-radius:20px; }
.room-desc    { font-size:.78rem; line-height:1.5; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }

.btn-edit { background:#031c36; color:#fff; border:none; border-radius:10px; font-size:.82rem; font-weight:600; padding:9px 14px; transition:background .2s,transform .15s; }
.btn-edit:hover { background:#0d3a6e; color:#fff; transform:translateY(-1px); }
.btn-del  { background:#fff0f0; color:#dc3545; border:1.5px solid #f8d7da; border-radius:10px; padding:9px 14px; font-size:.9rem; transition:background .2s,border-color .2s,transform .15s; flex-shrink:0; }
.btn-del:hover:not(:disabled) { background:#dc3545; color:#fff; border-color:#dc3545; transform:translateY(-1px); }
.btn-del:disabled { opacity:.6; }

.btn-orange { background:#ff5f00; color:#fff; border:none; border-radius:10px; transition:background .2s,transform .15s; }
.btn-orange:hover { background:#e65600; color:#fff; transform:translateY(-1px); }

.room-thumb     { width:44px; height:44px; border-radius:10px; overflow:hidden; background:#f0f3f6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.room-thumb-img { width:44px; height:44px; object-fit:cover; }

.empty-state .empty-icon { font-size:5rem; color:#031c36; opacity:.1; }

.skeleton-img  { height:200px; background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
.skeleton-line { height:14px; border-radius:6px; background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
</style>