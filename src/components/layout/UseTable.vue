<template>
  <div class="use-table">
    <!-- Status Filter Tabs -->
    <div class="table-filter-bar">
      <button
        v-for="cat in statusCategories"
        :key="cat.key"
        class="filter-tab"
        :class="{ active: activeFilter === cat.key }"
        @click="$emit('update:activeFilter', cat.key)"
      >
        <span class="filter-dot" :class="'dot-' + cat.key"></span>
        {{ cat.label }}
        <span class="filter-count">{{ cat.count }}</span>
      </button>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="th-number">#</th>
            <th v-for="col in columns" :key="col.key" :class="'th-' + col.key">
              {{ col.label }}
            </th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>

        <tbody v-if="!loading && filteredData.length > 0">
          <tr
            v-for="(row, index) in paginatedData"
            :key="row.id || index"
            class="table-row"
          >
            <td class="td-number">{{ (currentPage - 1) * pageSize + index + 1 }}</td>

            <td v-for="col in columns" :key="col.key" :class="'td-' + col.key">
              <!-- Image column -->
              <template v-if="col.type === 'image'">
                <div class="cell-image-wrapper">
                  <img
                    v-if="getNestedValue(row, col.field)"
                    :src="getNestedValue(row, col.field)"
                    class="cell-image"
                    alt=""
                  />
                  <div v-else class="cell-image-placeholder">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                </div>
              </template>

              <!-- Status badge column -->
              <template v-else-if="col.type === 'status'">
                <span class="status-badge" :class="'status-' + getStatusKey(getNestedValue(row, col.field))">
                  {{ getStatusLabel(getNestedValue(row, col.field)) }}
                </span>
              </template>

              <!-- Date column -->
              <template v-else-if="col.type === 'date'">
                <div class="cell-date">
                  <span class="date-main">{{ formatDate(getNestedValue(row, col.field)) }}</span>
                  <span class="date-time">{{ formatTime(getNestedValue(row, col.field)) }}</span>
                </div>
              </template>

              <!-- Payment proof column -->
              <template v-else-if="col.type === 'payment'">
                <div
                  v-if="getPaymentUrl(row)"
                  class="cell-payment"
                  :class="{ clickable: canInteract(row) }"
                  @click="canInteract(row) && $emit('view-payment', row)"
                >
                  <img :src="getPaymentUrl(row)" class="payment-thumb" alt="Payment proof" />
                  <span class="payment-label">View</span>
                </div>
                <span v-else class="no-payment">—</span>
              </template>

              <!-- Default text column -->
              <template v-else>
                <span class="cell-text">{{ getNestedValue(row, col.field) || '—' }}</span>
              </template>
            </td>

            <!-- Action buttons -->
            <td class="td-actions">
              <div class="action-group">
                <button
                  class="action-btn detail-btn"
                  @click="$emit('view-detail', row)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Detail
                </button>
                <button
                  v-if="showActions"
                  class="action-btn approve-btn"
                  :disabled="approvingId === row.id || !isPending(row.status)"
                  @click="$emit('approve', row.id)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ approvingId === row.id ? 'Approving…' : 'Approve' }}
                </button>
                <button
                  v-if="showActions"
                  class="action-btn reject-btn"
                  :disabled="rejectingId === row.id || !isPending(row.status)"
                  @click="$emit('reject', row.id)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  {{ rejectingId === row.id ? 'Rejecting…' : 'Reject' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Loading state -->
      <div v-if="loading" class="table-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
        </div>
        <p class="state-text">Loading data…</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredData.length === 0" class="table-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
        <p class="state-text">{{ emptyMessage }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && effectiveTotalItems > pageSize" class="table-pagination">
      <p class="pagination-info">
        Showing
        <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong>–<strong>{{ Math.min(currentPage * pageSize, effectiveTotalItems) }}</strong>
        of <strong>{{ effectiveTotalItems }}</strong> entries
      </p>

      <nav aria-label="Table pages">
        <ul class="pg-list">
          <!-- Prev -->
          <li>
            <button class="pg-btn" :disabled="currentPage <= 1"
              @click="$emit('update:currentPage', currentPage - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>

          <!-- Page numbers with ellipsis -->
          <template v-for="page in displayedPages" :key="page">
            <li v-if="page === '...'">
              <span class="pg-btn pg-ellipsis">…</span>
            </li>
            <li v-else>
              <button class="pg-btn" :class="{ 'pg-active': currentPage === page }"
                @click="$emit('update:currentPage', page)">
                {{ page }}
              </button>
            </li>
          </template>

          <!-- Next -->
          <li>
            <button class="pg-btn" :disabled="currentPage >= totalPages"
              @click="$emit('update:currentPage', currentPage + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true },
  approvingId: { type: [Number, String, null], default: null },
  rejectingId: { type: [Number, String, null], default: null },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 12 },
  totalItems: { type: Number, default: 0 },
  activeFilter: { type: String, default: 'all' },
  emptyMessage: { type: String, default: 'No data found' },
  paymentUrlGetter: { type: Function, default: null },
})

defineEmits(['approve', 'reject', 'view-payment', 'view-detail', 'update:currentPage', 'update:activeFilter'])

// --- Helpers ---
const getNestedValue = (obj, path) => {
  if (!path) return obj
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

const getStatusKey = (status) => {
  if (status === 2 || status === '2' || status === 'approved') return 'approved'
  if (status === 3 || status === '3' || status === 'rejected') return 'rejected'
  return 'pending'
}

const getStatusLabel = (status) => {
  if (status === 2 || status === '2' || status === 'approved') return 'Approved'
  if (status === 3 || status === '3' || status === 'rejected') return 'Rejected'
  return 'Pending'
}

const isPending = (status) => {
  return !(
    status === 2 || status === '2' || status === 'approved' ||
    status === 3 || status === '3' || status === 'rejected'
  )
}

const canInteract = (row) => {
  return getPaymentUrl(row) && isPending(row.status)
}

const getPaymentUrl = (row) => {
  if (props.paymentUrlGetter) return props.paymentUrlGetter(row)
  const file = row?.transaction_file
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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// --- Computed ---
const filteredData = computed(() => {
  if (props.activeFilter === 'all') return props.data
  return props.data.filter((item) => getStatusKey(item.status) === props.activeFilter)
})

const paginatedData = computed(() => {
  return filteredData.value
})

// Fallback to the loaded data length when the API doesn't return a total
const effectiveTotalItems = computed(() =>
  props.totalItems > 0 ? props.totalItems : filteredData.value.length
)

const totalPages = computed(() => Math.ceil(effectiveTotalItems.value / props.pageSize))

const displayedPages = computed(() => {
  const total = totalPages.value
  const cur   = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (cur > 3) pages.push('...')
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const statusCategories = computed(() => {
  const pending = props.data.filter((item) => getStatusKey(item.status) === 'pending').length
  const approved = props.data.filter((item) => getStatusKey(item.status) === 'approved').length
  const rejected = props.data.filter((item) => getStatusKey(item.status) === 'rejected').length
  return [
    { key: 'all', label: 'All', count: props.data.length },
    { key: 'pending', label: 'Pending', count: pending },
    { key: 'approved', label: 'Approved', count: approved },
    { key: 'rejected', label: 'Rejected', count: rejected },
  ]
})
</script>

<style scoped>
/* ===== Root Variables ===== */
.use-table {
  --clr-bg: #f8fafc;
  --clr-surface: #ffffff;
  --clr-border: #e2e8f0;
  --clr-border-light: #f1f5f9;
  --clr-text: #1e293b;
  --clr-text-muted: #64748b;
  --clr-primary: #6366f1;
  --clr-primary-soft: #eef2ff;
  --clr-success: #10b981;
  --clr-success-soft: #ecfdf5;
  --clr-success-border: #a7f3d0;
  --clr-danger: #ef4444;
  --clr-danger-soft: #fef2f2;
  --clr-danger-border: #fecaca;
  --clr-warning: #f59e0b;
  --clr-warning-soft: #fffbeb;
  --clr-warning-border: #fde68a;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* ===== Filter Tabs ===== */
.table-filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: 1.5px solid var(--clr-border);
  border-radius: 50px;
  background: var(--clr-surface);
  color: var(--clr-text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}

.filter-tab:hover {
  border-color: var(--clr-primary);
  color: var(--clr-primary);
  background: var(--clr-primary-soft);
}

.filter-tab.active {
  border-color: var(--clr-primary);
  background: var(--clr-primary);
  color: #fff;
}

.filter-tab.active .filter-count {
  background: rgba(255,255,255,0.25);
  color: #fff;
}

.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-all       { background: var(--clr-primary); }
.dot-pending   { background: var(--clr-warning); }
.dot-approved  { background: var(--clr-success); }
.dot-rejected  { background: var(--clr-danger); }

.filter-tab.active .filter-dot {
  background: rgba(255,255,255,0.7);
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 50px;
  background: var(--clr-bg);
  color: var(--clr-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
}

/* ===== Table Wrapper ===== */
.table-wrapper {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

/* ===== Table ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.data-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.data-table th {
  padding: 14px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--clr-text-muted);
  text-align: left;
  border-bottom: 2px solid var(--clr-border);
  white-space: nowrap;
}

.data-table td {
  padding: 14px 16px;
  font-size: 0.875rem;
  color: var(--clr-text);
  border-bottom: 1px solid var(--clr-border-light);
  vertical-align: middle;
}

.table-row {
  transition: background var(--transition);
}

.table-row:hover {
  background: #fafbff;
}

.table-row:last-child td {
  border-bottom: none;
}

.th-number, .td-number {
  width: 50px;
  text-align: center;
  color: var(--clr-text-muted);
  font-weight: 600;
  font-size: 0.8rem;
}

/* ===== Cell: Image ===== */
.cell-image-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid var(--clr-border-light);
  flex-shrink: 0;
}

.cell-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cell-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr-bg);
  color: var(--clr-text-muted);
}

/* ===== Cell: Status Badge ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.status-pending {
  background: var(--clr-warning-soft);
  color: #b45309;
  border: 1px solid var(--clr-warning-border);
}

.status-approved {
  background: var(--clr-success-soft);
  color: #047857;
  border: 1px solid var(--clr-success-border);
}

.status-rejected {
  background: var(--clr-danger-soft);
  color: #b91c1c;
  border: 1px solid var(--clr-danger-border);
}

/* ===== Cell: Date ===== */
.cell-date {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-main {
  font-weight: 500;
  color: var(--clr-text);
  font-size: 0.85rem;
}

.date-time {
  color: var(--clr-text-muted);
  font-size: 0.75rem;
}

/* ===== Cell: Payment ===== */
.cell-payment {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.cell-payment.clickable {
  cursor: pointer;
}

.cell-payment.clickable:hover {
  background: var(--clr-primary-soft);
}

.payment-thumb {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  border: 1.5px solid var(--clr-border);
}

.payment-label {
  font-size: 0.78rem;
  color: var(--clr-primary);
  font-weight: 600;
}

.no-payment {
  color: var(--clr-text-muted);
  font-size: 0.85rem;
}

/* ===== Cell: Text ===== */
.cell-text {
  color: var(--clr-text);
  font-size: 0.875rem;
}

/* ===== Action Buttons ===== */
.td-actions {
  width: 300px;
}

.action-group {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.detail-btn {
  background: var(--clr-primary-soft);
  color: var(--clr-primary);
  border-color: #c7d2fe;
}

.detail-btn:hover {
  background: var(--clr-primary);
  color: #fff;
  border-color: var(--clr-primary);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.approve-btn {
  background: var(--clr-success-soft);
  color: #047857;
  border-color: var(--clr-success-border);
}

.approve-btn:hover:not(:disabled) {
  background: var(--clr-success);
  color: #fff;
  border-color: var(--clr-success);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.reject-btn {
  background: var(--clr-danger-soft);
  color: #b91c1c;
  border-color: var(--clr-danger-border);
}

.reject-btn:hover:not(:disabled) {
  background: var(--clr-danger);
  color: #fff;
  border-color: var(--clr-danger);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ===== Table States (Loading / Empty) ===== */
.table-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: var(--clr-text-muted);
}

.state-text {
  font-size: 0.95rem;
  color: var(--clr-text-muted);
  margin: 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  position: relative;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid var(--clr-border);
  border-top-color: var(--clr-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Pagination ===== */
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-info {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.pagination-info strong { color: #031c36; }

/* Nav list */
.pg-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Individual page button — matches MyRoomsView style */
.pg-btn {
  min-width: 32px;
  height: 32px;
  border: 1.5px solid #e8edf2;
  border-radius: 8px;
  background: #fff;
  color: #031c36;
  font-size: 0.78rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  cursor: pointer;
  transition: all 0.18s;
  line-height: 1;
  text-decoration: none;
}

.pg-btn:hover:not(:disabled) {
  background: #031c36;
  color: #fff;
  border-color: #031c36;
}

.pg-btn.pg-active {
  background: #ff5f00 !important;
  color: #fff !important;
  border-color: #ff5f00 !important;
  box-shadow: 0 2px 6px rgba(255, 95, 0, 0.35);
}

.pg-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pg-ellipsis {
  border: none;
  background: transparent;
  cursor: default;
  pointer-events: none;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .table-wrapper {
    overflow-x: auto;
  }
  .data-table {
    min-width: 700px;
  }
  .table-pagination {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  .table-filter-bar {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }
}
</style>
