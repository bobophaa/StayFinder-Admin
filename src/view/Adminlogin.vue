<template>
  <div class="admin-wrapper">
    <div class="bg-grid"></div>

    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="admin-card">
      <div class="visual-side d-none d-lg-flex">
        <div class="visual-inner text-center">
          <div class="admin-logo-mark mb-4">
            <img src="@/assets/images/image.png" alt="Logo" height="48" />
          </div>

          <h2 class="text-white fw-bold fs-3 mb-2">StayFinder</h2>
          <p class="text-blue-muted mb-5 small px-3">
            Management portal for admins and property providers.
          </p>

          <!-- Role cards -->
          <div class="role-cards">
            <div class="role-card">
              <i class="bi bi-speedometer2 role-icon" style="color: #ff5f00"></i>
              <div>
                <div class="role-title">System Admin</div>
                <div class="role-desc">Manage users, locations &amp; settings</div>
              </div>
            </div>
            <div class="role-card">
              <i class="bi bi-building role-icon" style="color: #2575fc"></i>
              <div>
                <div class="role-title">Provider</div>
                <div class="role-desc">Manage properties &amp; bookings</div>
              </div>
            </div>
          </div>

          <div class="security-note mt-5">
            <i class="bi bi-shield-lock-fill me-2"></i>
            Secured · Encrypted · Authorized Only
          </div>
        </div>
      </div>

      <!-- RIGHT: FORM SIDE -->
      <div class="form-side p-4 p-md-5">
        <!-- Top bar -->
        <div class="d-flex align-items-center justify-content-between mb-5">
          <div class="portal-badge">
            <i class="bi bi-shield-fill-check me-2"></i>Management Portal
          </div>
        
        </div>

        <div class="mb-4">
          <h1 class="fw-bold text-white mb-1" style="font-size: 1.85rem">Welcome Back</h1>
          <p class="text-muted-dim small">Sign in — you'll be redirected based on your role</p>
        </div>

        <form @submit.prevent="handleLogin">
          <!-- Error -->
          <transition name="alert-fade">
            <div v-if="authStore.error" class="error-box mb-4">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>{{ authStore.error }}
            </div>
          </transition>

          <!-- Email -->
          <div class="mb-4">
            <label class="field-label">Email Address</label>
            <div
              class="dark-group"
              :class="{ 'dark-group-error': submitted && !authStore.emailOrPhone }"
            >
              <span class="d-icon"><i class="bi bi-person-badge"></i></span>
              <input
                v-model="authStore.emailOrPhone"
                type="text"
                class="d-input"
                placeholder="your@email.com"
                autocomplete="username"
              />
            </div>
            <small v-if="submitted && !authStore.emailOrPhone" class="err-text"
              >Email is required.</small
            >
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="field-label">Password</label>
            <div
              class="dark-group"
              :class="{ 'dark-group-error': submitted && !authStore.password }"
            >
              <span class="d-icon"><i class="bi bi-key-fill"></i></span>
              <input
                v-model="authStore.password"
                :type="showPass ? 'text' : 'password'"
                class="d-input"
                placeholder="••••••••••"
                autocomplete="current-password"
              />
              <span class="d-toggle" @click="showPass = !showPass">
                <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && !authStore.password" class="err-text"
              >Password is required.</small
            >
          </div>

          <!-- Role indicator (shows after typing) -->
          <transition name="alert-fade">
            <div v-if="detectedRole" class="role-hint mb-3">
              <i class="bi bi-arrow-right-circle-fill me-2"></i>
              You'll be redirected to:
              <strong>{{
                detectedRole === 'System Admin' ? 'Admin Dashboard' : 'Provider Dashboard'
              }}</strong>
            </div>
          </transition>

          <!-- Submit -->
          <button
            type="submit"
            class="submit-btn w-100 py-3 fw-bold mt-2"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-box-arrow-in-right me-2"></i>
            {{ authStore.loading ? 'Authenticating...' : 'Sign In' }}
          </button>

          <div class="text-center mt-4">
            <p class="small text-muted-dim mb-0">
              <i class="bi bi-info-circle me-1"></i>
              Restricted to authorized admins and providers only.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { alertSuccess } from '@/Utils/alert'

const authStore = useAuthStore()
const router = useRouter()
const submitted = ref(false)
const showPass = ref(false)

const detectedRole = computed(() => {
  if (authStore.isLoggedIn) return authStore.userRole
  return null
})

const handleLogin = async () => {
  submitted.value = true

  const { success, role } = await authStore.login()

  if (success) {
    if (role === 'System Admin') {
      await router.push({ name: 'admin.dashboard' })
    } else if (role === 'Service Provider') {
      await router.push({ name: 'provider.dashboard' })
    }

    alertSuccess('Logged in successfully!')
  }
}
</script>

<style scoped>
/* ─── WRAPPER ─────────────────────────────────────────────── */
.admin-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #080c18;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(37, 117, 252, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 117, 252, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  z-index: 0;
  pointer-events: none;
}
.orb-1 {
  width: 420px;
  height: 420px;
  background: rgba(37, 117, 252, 0.15);
  top: -120px;
  left: -120px;
  animation: drift 12s ease-in-out infinite;
}
.orb-2 {
  width: 320px;
  height: 320px;
  background: rgba(255, 95, 0, 0.1);
  bottom: -80px;
  right: -80px;
  animation: drift 15s ease-in-out infinite reverse;
}
.orb-3 {
  width: 200px;
  height: 200px;
  background: rgba(106, 17, 203, 0.12);
  top: 40%;
  left: 55%;
  animation: drift 9s ease-in-out infinite;
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(18px, -18px);
  }
  66% {
    transform: translate(-12px, 12px);
  }
}

.admin-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 960px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(12, 17, 35, 0.9);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(37, 117, 252, 0.18);
  box-shadow:
    0 0 0 1px rgba(37, 117, 252, 0.06),
    0 30px 80px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(37, 117, 252, 0.07);
  animation: cardIn 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 992px) {
  .admin-card {
    grid-template-columns: 1fr;
    max-width: 460px;
  }
}

.visual-side {
  background: linear-gradient(160deg, #0b1228, #091020);
  border-right: 1px solid rgba(37, 117, 252, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  position: relative;
  overflow: hidden;
}

.visual-side::before {
  content: '';
  position: absolute;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(37, 117, 252, 0.12), transparent);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.visual-inner {
  position: relative;
  z-index: 1;
  width: 100%;
}

.admin-logo-mark {
  width: 76px;
  height: 76px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.text-blue-muted {
  color: rgba(147, 197, 253, 0.55);
}

/* Role cards */
.role-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 14px 16px;
  text-align: left;
  transition: background 0.2s;
}
.role-card:hover {
  background: rgba(255, 255, 255, 0.06);
}

.role-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}
.role-title {
  color: #fff;
  font-weight: 600;
  font-size: 0.88rem;
}
.role-desc {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.75rem;
  margin-top: 2px;
}

.security-note {
  display: inline-flex;
  align-items: center;
  background: rgba(37, 117, 252, 0.07);
  border: 1px solid rgba(37, 117, 252, 0.14);
  color: rgba(147, 197, 253, 0.6);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.73rem;
}

/* ─── FORM SIDE ───────────────────────────────────────────── */
.form-side {
  background: rgba(8, 12, 24, 0.75);
}

.portal-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(37, 117, 252, 0.1);
  border: 1px solid rgba(37, 117, 252, 0.22);
  color: #60a5fa;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
}

.portal-version {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.2);
  font-family: monospace;
}

.text-muted-dim {
  color: rgba(255, 255, 255, 0.38);
}
.field-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

/* ─── INPUTS ──────────────────────────────────────────────── */
.dark-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}
.dark-group:focus-within {
  border-color: #2575fc;
  background: rgba(37, 117, 252, 0.06);
  box-shadow: 0 0 0 3px rgba(37, 117, 252, 0.14);
}
.dark-group-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.d-icon {
  padding: 0 14px;
  color: #2575fc;
  font-size: 1rem;
  flex-shrink: 0;
}
.d-input {
  flex: 1;
  height: 54px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 0.93rem;
  outline: none;
  padding: 0;
}
.d-input::placeholder {
  color: rgba(255, 255, 255, 0.18);
}

.d-toggle {
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.28);
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
  transition: color 0.2s;
}
.d-toggle:hover {
  color: #2575fc;
}

.err-text {
  color: #fca5a5;
  font-size: 0.78rem;
}

/* ─── ERROR BOX ───────────────────────────────────────────── */
.error-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.22);
  color: #fca5a5;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

/* ─── ROLE HINT ───────────────────────────────────────────── */
.role-hint {
  background: rgba(37, 117, 252, 0.08);
  border: 1px solid rgba(37, 117, 252, 0.2);
  color: #93c5fd;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
}
.role-hint strong {
  color: #fff;
  margin-left: 4px;
}

/* ─── SUBMIT BUTTON ───────────────────────────────────────── */
.submit-btn {
  background: linear-gradient(135deg, #1d4ed8, #2575fc);
  border: none;
  color: white;
  border-radius: 14px;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  box-shadow: 0 8px 30px rgba(37, 117, 252, 0.35);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.submit-btn:hover:not(:disabled)::before {
  opacity: 1;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(37, 117, 252, 0.5);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ─── ANIMATIONS ──────────────────────────────────────────── */
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}
</style>
