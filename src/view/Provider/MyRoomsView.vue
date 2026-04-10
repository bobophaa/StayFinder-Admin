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

  
    <div v-if="roomStore.error" class="alert alert-danger rounded-3 mb-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ roomStore.error }}
    </div>

   
    <div v-if="roomStore.loading" class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="p-4">
        <div v-for="i in 6" :key="i" class="d-flex gap-3 align-items-center py-3"
          :style="{ borderBottom: i < 6 ? '1px solid #f5f5f5' : 'none' }">
          <div class="skel-line" style="width:56px;height:56px;border-radius:10px;flex-shrink:0"></div>
          <div class="flex-fill">
            <div class="skel-line mb-2" style="width:55%;height:14px;border-radius:4px"></div>
            <div class="skel-line"      style="width:30%;height:12px;border-radius:4px"></div>
          </div>
          <div class="skel-line d-none d-md-block" style="width:80px;height:14px;border-radius:4px"></div>
          <div class="skel-line" style="width:60px;height:22px;border-radius:20px"></div>
          <div class="skel-line" style="width:90px;height:32px;border-radius:8px"></div>
        </div>
      </div>
    </div>

  
    <div v-else-if="roomStore.myRooms.length === 0" class="empty-state text-center py-5 mt-4">
      <div class="empty-icon mb-4"><i class="bi bi-house-slash"></i></div>
      <h5 class="fw-bold text-navy mb-2">No rooms posted yet</h5>
      <p class="text-muted mb-4">Start earning by listing your first room today.</p>
      <router-link to="/provider/add-room" class="btn btn-orange px-5 py-2 fw-bold">
        <i class="bi bi-plus-circle-fill me-2"></i>Post Your First Room
      </router-link>
    </div>

   
    <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">

          <thead>
            <tr class="tbl-head">
              <th class="ps-4 py-3 small fw-bold">#</th>
              <th class="py-3 small fw-bold">Room</th>
              <th class="py-3 small fw-bold d-none d-md-table-cell">District</th>
              <th class="py-3 small fw-bold">Price</th>
              <th class="py-3 small fw-bold d-none d-lg-table-cell">Beds / Size</th>
              <th class="py-3 small fw-bold d-none d-lg-table-cell">Bills</th>
              <th class="py-3 small fw-bold">Status</th>
              <th class="py-3 small fw-bold pe-4 text-end">Actions</th>
            </tr>
          </thead>

      
          <tbody>
            <tr v-for="(room, idx) in roomStore.myRooms" :key="room.id" class="tbl-row">

             
              <td class="ps-4 text-muted small fw-semibold">{{ idx + 1 }}</td>

              
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="room-thumb" @click="openDetail(room)">
                    <img v-if="room.image" :src="room.image" class="room-thumb-img" />
                    <i v-else class="bi bi-building text-muted" style="font-size:1rem"></i>
                  </div>
                  <div>
                    <div class="room-name" @click="openDetail(room)">{{ room.title }}</div>
                    <!-- District visible only on small screens -->
                    <div class="text-muted d-md-none" style="font-size:.72rem">
                      <i class="bi bi-geo-alt me-1 text-orange"></i>{{ room.district?.name || '–' }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- District -->
              <td class="d-none d-md-table-cell small text-muted">
                <i class="bi bi-geo-alt-fill me-1 text-orange"></i>{{ room.district?.name || '–' }}
              </td>

              <!-- Price -->
              <td>
                <span class="fw-bold text-orange">${{ room.price }}</span>
                <span class="text-muted small">/mo</span>
              </td>

              <!-- Beds / Size -->
              <td class="d-none d-lg-table-cell">
                <div class="d-flex flex-wrap gap-1">
                  <span class="spec-chip" v-if="room.bed">
                    <i class="bi bi-person-fill me-1"></i>{{ room.bed }}
                  </span>
                  <span class="spec-chip" v-if="room.size_room">
                    <i class="bi bi-aspect-ratio me-1"></i>{{ room.size_room }}
                  </span>
                  <span v-if="!room.bed && !room.size_room" class="text-muted small">–</span>
                </div>
              </td>

              <!-- Bills -->
              <td class="d-none d-lg-table-cell">
                <div class="d-flex flex-wrap gap-1">
                  <span class="bill-chip" v-if="room.pay_water">
                    <i class="bi bi-droplet-fill text-info me-1"></i>${{ room.pay_water }}
                  </span>
                  <span class="bill-chip" v-if="room.pay_electric">
                    <i class="bi bi-lightning-fill text-warning me-1"></i>${{ room.pay_electric }}
                  </span>
                  <span v-if="!room.pay_water && !room.pay_electric" class="text-muted small">–</span>
                </div>
              </td>

              <!-- Status -->
              <td>
                <span v-if="room.percent_promotion > 0" class="status-pill pill-promo">
                  <i class="bi bi-tag-fill me-1"></i>-{{ room.percent_promotion }}%
                </span>
                <span v-else class="status-pill pill-active">
                  <i class="bi bi-circle-fill me-1" style="font-size:.4rem"></i>Active
                </span>
              </td>

              <!-- Actions -->
              <td class="pe-4 text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <!-- Eye — opens card detail -->
                  <button class="tbl-btn tbl-btn-view" @click="openDetail(room)" title="View card">
                    <i class="bi bi-eye-fill"></i>
                  </button>
                  <!-- Edit -->
                  <router-link :to="`/provider/edit-room/${room.id}`" class="tbl-btn tbl-btn-edit" title="Edit">
                    <i class="bi bi-pencil-fill"></i>
                  </router-link>
                  <!-- Delete -->
                  <button class="tbl-btn tbl-btn-del" @click="confirmDelete(room)"
                    :disabled="deletingId === room.id" title="Delete">
                    <span v-if="deletingId === room.id" class="spinner-border spinner-border-sm"></span>
                    <i v-else class="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table footer -->
      <div class="tbl-footer px-4 py-3 d-flex justify-content-between align-items-center">
        <small class="text-muted">
          Showing <strong>{{ roomStore.myRooms.length }}</strong>
          room{{ roomStore.myRooms.length !== 1 ? 's' : '' }}
        </small>
        <router-link to="/provider/add-room" class="btn btn-orange btn-sm fw-bold px-3">
          <i class="bi bi-plus-circle-fill me-1"></i>Add Room
        </router-link>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         CARD DETAIL MODAL
    ══════════════════════════════════════ -->
    <transition name="modal-fade">
      <div v-if="selectedRoom" class="detail-overlay" @click.self="selectedRoom = null">
        <div class="detail-modal">

          <!-- Modal header -->
          <div class="detail-header">
            <div class="flex-fill overflow-hidden">
              <h5 class="fw-bold text-white mb-0 text-truncate">{{ selectedRoom.title }}</h5>
              <small class="opacity-75 text-white">
                <i class="bi bi-geo-alt me-1"></i>{{ selectedRoom.district?.name || '–' }}, Phnom Penh
              </small>
            </div>
            <button class="detail-close" @click="selectedRoom = null">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Modal body (scrollable) -->
          <div class="detail-body">

            <!-- Image -->
            <div class="detail-img-wrap mb-4">
              <img v-if="selectedRoom.image" :src="selectedRoom.image" class="detail-img" :alt="selectedRoom.title" />
              <div v-else class="detail-img-placeholder d-flex align-items-center justify-content-center">
                <i class="bi bi-building" style="font-size:3rem;color:#ccc"></i>
              </div>
              <span v-if="selectedRoom.percent_promotion > 0" class="detail-promo-badge">
                <i class="bi bi-tag-fill me-1"></i>-{{ selectedRoom.percent_promotion }}% OFF
              </span>
            </div>

            <!-- Price + status -->
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span class="detail-price">${{ selectedRoom.price }}</span>
                <span class="text-muted small"> /month</span>
              </div>
              <span class="status-pill pill-active">
                <i class="bi bi-circle-fill me-1" style="font-size:.4rem"></i>Active
              </span>
            </div>

            <!-- Info grid -->
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="info-card">
                  <i class="bi bi-geo-alt-fill text-orange mb-1 d-block"></i>
                  <div class="info-label">District</div>
                  <div class="info-value">{{ selectedRoom.district?.name || '–' }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="info-card">
                  <i class="bi bi-person-fill text-orange mb-1 d-block"></i>
                  <div class="info-label">Beds</div>
                  <div class="info-value">{{ selectedRoom.bed || '–' }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="info-card">
                  <i class="bi bi-aspect-ratio text-orange mb-1 d-block"></i>
                  <div class="info-label">Room Size</div>
                  <div class="info-value">{{ selectedRoom.size_room || '–' }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="info-card">
                  <i class="bi bi-tag-fill text-orange mb-1 d-block"></i>
                  <div class="info-label">Promotion</div>
                  <div class="info-value">
                    {{ selectedRoom.percent_promotion > 0 ? `-${selectedRoom.percent_promotion}%` : 'None' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Bills -->
            <div class="detail-section mb-4">
              <div class="section-title">
                <i class="bi bi-receipt me-2 text-orange"></i>Monthly Bills
              </div>
              <div class="bills-card">
                <div class="bill-row">
                  <span><i class="bi bi-droplet-fill text-info me-2"></i>Water</span>
                  <strong>${{ selectedRoom.pay_water || '0' }}</strong>
                </div>
                <div class="bill-row">
                  <span><i class="bi bi-lightning-fill text-warning me-2"></i>Electric</span>
                  <strong>${{ selectedRoom.pay_electric || '0' }}</strong>
                </div>
                <div class="bill-row">
                  <span><i class="bi bi-trash3-fill text-success me-2"></i>Trash</span>
                  <strong>{{ selectedRoom.pay_trash ? '$' + selectedRoom.pay_trash : 'Free' }}</strong>
                </div>
                <div class="bill-row border-0">
                  <span><i class="bi bi-car-front-fill text-secondary me-2"></i>Parking</span>
                  <strong>{{ selectedRoom.pay_parking ? '$' + selectedRoom.pay_parking : 'Free' }}</strong>
                </div>
              </div>
            </div>

            <!-- Amenities -->
            <div class="detail-section mb-4" v-if="selectedRoom.room_options?.length">
              <div class="section-title">
                <i class="bi bi-check-circle-fill me-2 text-orange"></i>Amenities
              </div>
              <div class="d-flex flex-wrap gap-2 mt-2">
                <span class="amenity-tag" v-for="opt in selectedRoom.room_options" :key="opt.id">
                  {{ opt.name }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="detail-section mb-4" v-if="selectedRoom.description">
              <div class="section-title">
                <i class="bi bi-file-text me-2 text-orange"></i>Description
              </div>
              <p class="text-muted small mt-2 mb-0" style="line-height:1.7">
                {{ selectedRoom.description }}
              </p>
            </div>

            <!-- Map -->
            <div v-if="selectedRoom.map_url">
              <a :href="selectedRoom.map_url" target="_blank"
                class="btn btn-outline-navy btn-sm w-100">
                <i class="bi bi-geo-alt-fill me-2"></i>View on Google Maps
              </a>
            </div>

          </div>

          <!-- Modal footer -->
          <div class="detail-footer">
            <button class="btn btn-light rounded-3 px-4" @click="selectedRoom = null">Close</button>
            <router-link :to="`/provider/edit-room/${selectedRoom.id}`"
              class="btn btn-orange px-4 fw-bold">
              <i class="bi bi-pencil-fill me-2"></i>Edit This Room
            </router-link>
          </div>

        </div>
      </div>
    </transition>

    <!-- ── Delete Confirm Modal ── -->
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
            <div class="d-flex align-items-center gap-3 p-3 rounded-3 mb-3"
              style="background:#f8f9fa;border:1.5px solid #e9ecef">
              <div class="room-thumb">
                <img v-if="roomToDelete.image" :src="roomToDelete.image" class="room-thumb-img" />
                <i v-else class="bi bi-building text-muted"></i>
              </div>
              <div>
                <div class="fw-bold text-navy small">{{ roomToDelete.title }}</div>
                <div class="text-orange fw-bold">${{ roomToDelete.price }}/month</div>
              </div>
            </div>
            <div class="alert alert-warning py-2 small rounded-3">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              This action <strong>cannot be undone</strong>.
            </div>
          </div>
          <div class="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
            <button class="btn btn-light rounded-3 px-4" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-danger rounded-3 px-4 fw-bold" @click="executeDelete"
              :disabled="deletingId !== null">
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
const selectedRoom = ref(null)   // card detail modal
let deleteModalInstance = null

onMounted(async () => {
  if (!authStore.user) await authStore.fetchMe()
  await roomStore.fetchMyRooms()
  const { Modal } = await import('bootstrap')
  deleteModalInstance = new Modal(document.getElementById('deleteModal'))
})

// ── Open card detail ───────────────────────────────────────
function openDetail(room) {
  selectedRoom.value = room
}

// ── Delete flow ────────────────────────────────────────────
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
  deletingId.value  = null
  roomToDelete.value = null
}
</script>

<style scoped>
/* ── Base ── */
.text-navy   { color: #031c36; }
.text-orange { color: #ff5f00; }
.card-header-navy { background: #031c36; border-bottom: 3px solid #ff5f00; }

/* ── Table head ── */
.tbl-head th { background: #031c36; color: #fff; border: none; font-size: .75rem; letter-spacing: .04em; }

/* ── Table rows ── */
.tbl-row { transition: background .15s; }
.tbl-row:hover { background: #fdf8f4 !important; }
.tbl-row td { border-color: #f5f5f5; padding-top: 12px; padding-bottom: 12px; }

/* ── Table footer ── */
.tbl-footer { background: #fafbfc; border-top: 1px solid #f0f0f0; }

/* ── Thumbnail ── */
.room-thumb {
  width: 56px; height: 56px; border-radius: 10px;
  overflow: hidden; background: #f0f3f6;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; cursor: pointer;
  transition: box-shadow .2s, transform .2s;
}
.room-thumb:hover { box-shadow: 0 4px 12px rgba(255,95,0,.3); transform: scale(1.04); }
.room-thumb-img { width: 56px; height: 56px; object-fit: cover; }

/* ── Room name ── */
.room-name {
  font-size: .88rem; font-weight: 700; color: #031c36;
  cursor: pointer; max-width: 180px;
  overflow: hidden; display: -webkit-box;
  -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  transition: color .15s;
}
.room-name:hover { color: #ff5f00; }

/* ── Chips ── */
.spec-chip { background: #f0f3f6; color: #031c36; font-size: .7rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; white-space: nowrap; }
.bill-chip { background: #fafafa; border: 1px solid #eee; color: #666; font-size: .68rem; padding: 2px 7px; border-radius: 20px; white-space: nowrap; }
.amenity-tag { background: rgba(255,95,0,.08); color: #ff5f00; border: 1px solid rgba(255,95,0,.2); font-size: .68rem; font-weight: 600; padding: 2px 8px; border-radius: 20px; }

/* ── Status pills ── */
.status-pill { font-size: .7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; white-space: nowrap; display: inline-flex; align-items: center; }
.pill-active { background: #e9faf1; color: #198754; }
.pill-promo  { background: #fff4ed; color: #ff5f00; }

/* ── Action buttons ── */
.tbl-btn {
  width: 32px; height: 32px; border: none; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: .82rem; cursor: pointer; transition: all .18s;
  text-decoration: none;
}
.tbl-btn-view { background: rgba(3,28,54,.07); color: #031c36; }
.tbl-btn-view:hover { background: #031c36; color: #fff; }
.tbl-btn-edit { background: #e7f1ff; color: #0d6efd; }
.tbl-btn-edit:hover { background: #0d6efd; color: #fff; }
.tbl-btn-del  { background: #fff0f0; color: #dc3545; }
.tbl-btn-del:hover:not(:disabled) { background: #dc3545; color: #fff; }
.tbl-btn:disabled { opacity: .5; cursor: not-allowed; }

/* ── Buttons ── */
.btn-orange { background: #ff5f00; color: #fff; border: none; border-radius: 10px; font-weight: 600; transition: background .2s, transform .15s; }
.btn-orange:hover { background: #e65600; color: #fff; transform: translateY(-1px); }
.btn-outline-navy { border: 1.5px solid #031c36; color: #031c36; border-radius: 8px; background: transparent; font-weight: 600; transition: all .2s; }
.btn-outline-navy:hover { background: #031c36; color: #fff; }

/* ── Empty ── */
.empty-state .empty-icon { font-size: 5rem; color: #031c36; opacity: .1; }

/* ── Skeleton ── */
.skel-line { display: block; background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Delete modal thumb ── */
.room-thumb-modal     { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; background: #f0f3f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.room-thumb-modal-img { width: 44px; height: 44px; object-fit: cover; }

/* ══════════════════════════════════════
   CARD DETAIL MODAL
══════════════════════════════════════ */
.detail-overlay {
  position: fixed; inset: 0;
  background: rgba(3,28,54,.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; padding: 16px;
}

.detail-modal {
  width: 100%; max-width: 500px;
  max-height: 90vh;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 64px rgba(3,28,54,.3);
  animation: modalPop .25s cubic-bezier(.4,0,.2,1);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(.96) translateY(14px); }
  to   { opacity: 1; transform: scale(1)  translateY(0); }
}

/* Header */
.detail-header {
  background: #031c36; border-bottom: 3px solid #ff5f00;
  padding: 18px 22px;
  display: flex; align-items: center; gap: 12px; flex-shrink: 0;
}
.detail-close {
  background: rgba(255,255,255,.12); color: #fff; border: none;
  border-radius: 8px; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: .85rem; flex-shrink: 0;
  transition: background .2s;
}
.detail-close:hover { background: rgba(255,255,255,.24); }

/* Body */
.detail-body { flex: 1; overflow-y: auto; padding: 24px; }
.detail-body::-webkit-scrollbar { width: 4px; }
.detail-body::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

/* Image */
.detail-img-wrap { border-radius: 14px; overflow: hidden; position: relative; height: 220px; }
.detail-img { width: 100%; height: 220px; object-fit: cover; }
.detail-img-placeholder { width: 100%; height: 220px; background: linear-gradient(135deg,#e8edf2,#f5f8fb); }
.detail-promo-badge { position: absolute; top: 12px; left: 12px; background: #ff5f00; color: #fff; font-size: .72rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; }

/* Price */
.detail-price { font-size: 1.9rem; font-weight: 900; color: #ff5f00; line-height: 1; }

/* Info cards */
.info-card { background: #f8f9fa; border: 1px solid #eee; border-radius: 12px; padding: 12px 14px; height: 100%; }
.info-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #999; margin-bottom: 2px; }
.info-value { font-size: .9rem; font-weight: 700; color: #031c36; }

/* Section */
.section-title { font-size: .78rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #031c36; display: flex; align-items: center; }

/* Bills */
.bills-card { background: #f8f9fa; border-radius: 12px; border: 1px solid #eee; overflow: hidden; margin-top: 8px; }
.bill-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px dashed #eee; font-size: .85rem; color: #555; }
.bill-row strong { color: #031c36; }

/* Footer */
.detail-footer { padding: 16px 22px; border-top: 1px solid #f0f0f0; background: #fafbfc; display: flex; justify-content: space-between; gap: 10px; flex-shrink: 0; }

/* Transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s; }
.modal-fade-enter-from, .modal-fade-leave-to       { opacity: 0; }
</style>