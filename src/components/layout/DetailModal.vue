<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="detail-overlay" @click.self="$emit('close')">
        <div class="detail-modal">
          <!-- Header -->
          <div class="modal-header-bar">
            <div class="header-left">
              <h3 class="modal-title">{{ title }}</h3>
              <span class="status-pill" :class="'pill-' + statusKey">
                {{ statusLabel }}
              </span>
            </div>
            <button class="close-btn" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="modal-body-scroll">

            <!-- ===== Guest Info ===== -->
            <div class="info-section">
              <div class="section-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Guest Information
              </div>
              <div class="profile-card">
                <img
                  :src="item.buyer?.avatar || 'https://via.placeholder.com/80'"
                  class="profile-avatar"
                  alt="avatar"
                />
                <div class="profile-info">
                  <h4 class="profile-name">{{ item.buyer?.name || '—' }}</h4>
                  <span class="profile-job">{{ item.buyer?.current_job || '—' }}</span>
                </div>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ item.buyer?.email || '—' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone</span>
                  <span class="info-value">{{ item.buyer?.phone || '—' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Gender</span>
                  <span class="info-value">{{ genderText(item.buyer?.gender) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ID Card</span>
                  <span class="info-value">{{ item.buyer?.id_card || 'Not provided' }}</span>
                </div>
              </div>
            </div>

            <!-- ===== Room Details ===== -->
            <div class="info-section">
              <div class="section-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Room Details
              </div>
              <div class="room-hero" v-if="item.room?.image">
                <img :src="item.room.image" class="room-image" alt="room" />
                <div class="room-overlay">
                  <h4 class="room-title-overlay">{{ item.room?.title || '—' }}</h4>
                  <span class="room-district">{{ item.room?.district?.name || '—' }}</span>
                </div>
              </div>
              <div class="info-grid three-col">
                <div class="info-item">
                  <span class="info-label">Room Title</span>
                  <span class="info-value fw">{{ item.room?.title || '—' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Size</span>
                  <span class="info-value">{{ item.room?.size_room || '—' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Beds</span>
                  <span class="info-value">{{ item.room?.bed || '—' }}</span>
                </div>
              </div>

              <!-- Pricing breakdown -->
              <div class="pricing-card">
                <div class="pricing-title">Monthly Pricing</div>
                <div class="pricing-rows">
                  <div class="pricing-row">
                    <span>Room Rent</span>
                    <span class="pricing-amount main">${{ item.room?.price ?? '—' }}</span>
                  </div>
                  <div class="pricing-row">
                    <span>Water</span>
                    <span class="pricing-amount">${{ item.room?.pay_water ?? '—' }}</span>
                  </div>
                  <div class="pricing-row">
                    <span>Electric</span>
                    <span class="pricing-amount">${{ item.room?.pay_electric ?? '—' }}</span>
                  </div>
                  <div class="pricing-row">
                    <span>Parking</span>
                    <span class="pricing-amount">${{ item.room?.pay_parking ?? '—' }}</span>
                  </div>
                  <div class="pricing-row">
                    <span>Trash</span>
                    <span class="pricing-amount">${{ item.room?.pay_trash ?? '—' }}</span>
                  </div>
                  <div v-if="item.room?.percent_promotion > 0" class="pricing-row promo">
                    <span>Promotion</span>
                    <span class="pricing-amount promo-text">-{{ item.room.percent_promotion }}%</span>
                  </div>
                  <div class="pricing-divider"></div>
                  <div class="pricing-row total">
                    <span>Estimated Total</span>
                    <span class="pricing-amount total-amount">${{ estimatedTotal }}</span>
                  </div>
                </div>
              </div>

              <!-- Amenities -->
              <div v-if="item.room?.options?.length" class="amenities-row">
                <span class="info-label" style="margin-bottom: 8px; display: block">Amenities</span>
                <div class="amenities-list">
                  <span v-for="opt in item.room.options" :key="opt.id" class="amenity-tag">
                    {{ opt.name }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div v-if="item.room?.description" class="room-description">
                <span class="info-label">Description</span>
                <p class="desc-text">{{ item.room.description }}</p>
              </div>

              <!-- Map -->
              <div v-if="item.room?.map_url" class="info-item" style="margin-top: 8px">
                <span class="info-label">Map</span>
                <a :href="item.room.map_url" target="_blank" class="map-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Open in Maps
                </a>
              </div>
            </div>

            <!-- ===== Booking / Rent Info ===== -->
            <div class="info-section">
              <div class="section-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ title }} Info
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Check-in Date</span>
                  <span class="info-value fw">{{ formatDate(item.checkin_date) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Check-in Time</span>
                  <span class="info-value">{{ formatTime(item.checkin_date) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Created At</span>
                  <span class="info-value">{{ formatDate(item.created_at) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status</span>
                  <span class="status-pill small" :class="'pill-' + statusKey">{{ statusLabel }}</span>
                </div>
              </div>

              <!-- Payment proof -->
              <div class="payment-section">
                <span class="info-label">Payment Proof</span>
                <div v-if="paymentUrl" class="payment-preview-box" @click="showPaymentFull = !showPaymentFull">
                  <img :src="paymentUrl" class="payment-preview-img" alt="Payment proof" />
                  <span class="payment-hint">Click to {{ showPaymentFull ? 'collapse' : 'enlarge' }}</span>
                </div>
                <Transition name="expand">
                  <div v-if="showPaymentFull && paymentUrl" class="payment-full">
                    <img :src="paymentUrl" class="payment-full-img" alt="Payment proof full" />
                  </div>
                </Transition>
                <p v-if="!paymentUrl" class="no-data-text">No payment proof uploaded</p>
              </div>
            </div>

            <!-- ===== Seller / Owner Info ===== -->
            <div class="info-section" v-if="item.seller">
              <div class="section-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Room Owner
              </div>
              <div class="profile-card compact">
                <img
                  :src="item.seller?.avatar || 'https://via.placeholder.com/48'"
                  class="profile-avatar small"
                  alt="seller avatar"
                />
                <div class="profile-info">
                  <h4 class="profile-name small">{{ item.seller?.name || '—' }}</h4>
                  <span class="profile-job">{{ item.seller?.current_job || '—' }}</span>
                </div>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ item.seller?.email || '—' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone</span>
                  <span class="info-value">{{ item.seller?.phone || '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) },
  title: { type: String, default: 'Booking' },
  paymentUrlGetter: { type: Function, default: null },
})

defineEmits(['close'])

const showPaymentFull = ref(false)

const getStatusKey = (status) => {
  if (status === 2 || status === '2' || status === 'approved') return 'approved'
  if (status === 3 || status === '3' || status === 'rejected') return 'rejected'
  return 'pending'
}

const statusKey = computed(() => getStatusKey(props.item?.status))
const statusLabel = computed(() => {
  if (statusKey.value === 'approved') return 'Approved'
  if (statusKey.value === 'rejected') return 'Rejected'
  return 'Pending'
})

const genderText = (g) => {
  if (g === 1 || g === '1') return 'Male'
  if (g === 2 || g === '2') return 'Female'
  return 'Unknown'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (dateString) => {
  if (!dateString) return 'N/A'
  const d = new Date(dateString)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const paymentUrl = computed(() => {
  if (props.paymentUrlGetter) return props.paymentUrlGetter(props.item)
  const file = props.item?.transaction_file
  if (!file) return null
  if (typeof file === 'string') return file
  if (file.url) return file.url
  const base64 = file.data || file.base64
  if (base64) {
    const mime = file.type || file.mime || 'image/jpeg'
    return `data:${mime};base64,${base64}`
  }
  return null
})

const estimatedTotal = computed(() => {
  const r = props.item?.room
  if (!r) return '—'
  const price = Number(r.price) || 0
  const water = Number(r.pay_water) || 0
  const electric = Number(r.pay_electric) || 0
  const parking = Number(r.pay_parking) || 0
  const trash = Number(r.pay_trash) || 0
  let total = price + water + electric + parking + trash
  if (r.percent_promotion > 0) {
    total = total * (1 - r.percent_promotion / 100)
  }
  return total.toFixed(2)
})
</script>

<style scoped>
/* ===== Overlay ===== */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* ===== Modal ===== */
.detail-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* ===== Header ===== */
.modal-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}

/* ===== Status Pill ===== */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.status-pill.small {
  padding: 3px 10px;
  font-size: 0.72rem;
}
.pill-pending  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.pill-approved { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
.pill-rejected { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

/* ===== Scrollable Body ===== */
.modal-body-scroll {
  overflow-y: auto;
  padding: 24px;
  flex: 1;
}

/* ===== Section ===== */
.info-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}
.info-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6366f1;
  margin-bottom: 16px;
}

/* ===== Profile Card ===== */
.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 16px;
}
.profile-card.compact {
  padding: 12px;
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}
.profile-avatar.small {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.profile-name {
  font-size: 1rem;
  font-weight: 650;
  color: #1e293b;
  margin: 0 0 2px;
}
.profile-name.small {
  font-size: 0.9rem;
}

.profile-job {
  font-size: 0.8rem;
  color: #64748b;
}

/* ===== Info Grid ===== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.info-grid.three-col {
  grid-template-columns: 1fr 1fr 1fr;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
}

.info-value {
  font-size: 0.875rem;
  color: #1e293b;
}
.info-value.fw {
  font-weight: 600;
}

/* ===== Room Hero ===== */
.room-hero {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 180px;
  margin-bottom: 16px;
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: #fff;
}

.room-title-overlay {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 2px;
}

.room-district {
  font-size: 0.78rem;
  opacity: 0.85;
}

/* ===== Pricing Card ===== */
.pricing-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.pricing-title {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 12px;
}

.pricing-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #475569;
}

.pricing-amount {
  font-weight: 600;
  color: #1e293b;
}
.pricing-amount.main {
  color: #6366f1;
  font-size: 0.9rem;
}

.pricing-row.promo {
  color: #047857;
}
.promo-text {
  color: #047857 !important;
  font-weight: 700;
}

.pricing-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
}

.pricing-row.total {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
}
.total-amount {
  color: #6366f1;
  font-size: 1.05rem;
}

/* ===== Amenities ===== */
.amenities-row {
  margin-top: 16px;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.amenity-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  background: #eef2ff;
  color: #6366f1;
  border: 1px solid #c7d2fe;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
}

/* ===== Room Description ===== */
.room-description {
  margin-top: 16px;
}

.desc-text {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.6;
  margin: 6px 0 0;
}

/* ===== Map Link ===== */
.map-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6366f1;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.map-link:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* ===== Payment Section ===== */
.payment-section {
  margin-top: 16px;
}

.payment-preview-box {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  cursor: pointer;
}

.payment-preview-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  transition: border-color 0.2s, transform 0.2s;
}
.payment-preview-box:hover .payment-preview-img {
  border-color: #6366f1;
  transform: scale(1.05);
}

.payment-hint {
  font-size: 0.7rem;
  color: #94a3b8;
}

.payment-full {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.payment-full-img {
  width: 100%;
  display: block;
}

.no-data-text {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 8px;
}

/* ===== Transitions ===== */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .detail-modal,
.modal-leave-active .detail-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .detail-modal {
  transform: translateY(20px) scale(0.97);
  opacity: 0;
}
.modal-leave-to .detail-modal {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 600px;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .detail-modal {
    max-height: 95vh;
    border-radius: 12px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .info-grid.three-col {
    grid-template-columns: 1fr 1fr;
  }
  .room-hero {
    height: 140px;
  }
}
</style>
