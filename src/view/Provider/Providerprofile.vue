<template>
  <div class="container py-4">

    <div class="row g-4">

      <!-- LEFT -->
      <div class="col-lg-4">

        <!-- PROFILE CARD -->
        <div class="card clean-card text-center p-4">

          <!-- AVATAR -->
          <div class="avatar-wrapper mb-3" @click="triggerUpload">

            <div class="avatar">
              <img v-if="avatarPreview || user?.avatar" :src="avatarPreview || user.avatar" />
              <span v-else>{{ user?.name?.charAt(0) }}</span>
            </div>

            <div class="avatar-icon">
              <i class="bi bi-camera-fill"></i>
            </div>

            <!-- loading -->
            <div v-if="uploadingAvatar" class="avatar-loading">
              <div class="spinner-border spinner-border-sm text-white"></div>
            </div>

          </div>

          <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />

          <h5 class="fw-bold mb-1">{{ user?.name }}</h5>
          <p class="text-muted small mb-3">{{ user?.email }}</p>

          <span class="badge badge-role">Service Provider</span>
        </div>

        <!-- INFO -->
        <div class="card clean-card mt-4 p-3">
          <h6 class="section-title">Account Info</h6>

          <div class="info-item">
            <span>Email</span>
            <strong>{{ user?.email }}</strong>
          </div>

          <div class="info-item">
            <span>Phone</span>
            <strong>{{ user?.phone || 'Not set' }}</strong>
          </div>

          <div class="info-item">
            <span>Gender</span>
            <strong>{{ user?.gender == 1 ? 'Male' : 'Female' }}</strong>
          </div>

          <div class="info-item">
            <span>Job</span>
            <strong>{{ user?.current_job || 'Not set' }}</strong>
          </div>
        </div>

      </div>

      <!-- RIGHT -->
      <div class="col-lg-8">

        <!-- PROFILE FORM -->
        <div class="card clean-card p-4 mb-4">
          <div class="d-flex justify-content-between mb-3">
            <h6 class="section-title">Profile Information</h6>
            <button class="btn btn-orange btn-sm" @click="enableEdit">
              Edit
            </button>
          </div>

          <div class="row g-3">

            <div class="col-md-6">
              <label>Full Name</label>
              <input v-model="form.name" :readonly="!isEditing" />
            </div>

            <div class="col-md-6">
              <label>Email</label>
              <input v-model="form.email" :readonly="!isEditing" />
            </div>

            <div class="col-md-6">
              <label>Phone</label>
              <input v-model="form.phone" :readonly="!isEditing" />
            </div>

            <div class="col-md-6">
              <label>Gender</label>
              <select v-model="form.gender" :disabled="!isEditing">
                <option :value="1">Male</option>
                <option :value="2">Female</option>
              </select>
            </div>

            <div class="col-12">
              <label>Job</label>
              <input v-model="form.current_job" :readonly="!isEditing" />
            </div>

          </div>

          <div v-if="isEditing" class="text-end mt-3">
            <button class="btn btn-orange" @click="updateProfile">
              Save
            </button>
          </div>
        </div>

        <!-- PASSWORD -->
        <div class="card clean-card p-4">
          <div class="d-flex justify-content-between mb-3">
            <h6 class="section-title">Change Password</h6>
            <button class="btn btn-outline-secondary btn-sm" @click="showPassForm = !showPassForm">
              {{ showPassForm ? 'Cancel' : 'Change' }}
            </button>
          </div>

          <div v-if="showPassForm" class="row g-3">

            <div class="col-md-4">
              <input v-model="passForm.old_pass" placeholder="Current password" />
            </div>

            <div class="col-md-4">
              <input v-model="passForm.new_pass" placeholder="New password" />
            </div>

            <div class="col-md-4">
              <input v-model="passForm.new_pass_confirmation" placeholder="Confirm password" />
            </div>

            <div class="col-12">
              <button class="btn btn-orange" @click="changePassword">
                Update Password
              </button>
            </div>

          </div>

          <p v-else class="text-muted small">
            Use a strong password with at least 8 characters.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

const user = ref(null)
const loading = ref(false)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const isEditing = ref(false)
const showPassForm = ref(false)

const form = reactive({
  name: '', email: '', phone: '', gender: 1, current_job: ''
})

const passForm = reactive({
  old_pass: '', new_pass: '', new_pass_confirmation: ''
})

// fetch user
const fetchUser = async () => {
  const res = await api.get('/me')
  user.value = res.data?.data || res.data
  Object.assign(form, user.value)
}

// avatar upload
const triggerUpload = () => fileInput.value.click()

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarPreview.value = URL.createObjectURL(file)

  const fd = new FormData()
  fd.append('image', file)

  uploadingAvatar.value = true

  try {
    await api.post('/profile/image', fd)
    await fetchUser()
  } finally {
    uploadingAvatar.value = false
  }
}

// edit profile
const enableEdit = () => isEditing.value = true

const updateProfile = async () => {
  await api.post('/profile/info', form)
  isEditing.value = false
}

// change password
const changePassword = async () => {
  await api.put('/profile/pass', passForm)
  showPassForm.value = false
}
onMounted(fetchUser)
</script>

<style scoped>
:root {
  --navy:#0d2137; --navy2:#163352; --teal:#1a7a5e; --green:#4aab3e;
  --accent:#1a6bde; --amber:#c97a10; --danger:#c62828;
  --bg:#f2f5f9; --white:#fff; --border:rgba(0,0,0,.08);
  --t1:#0f172a; --t2:#475569; --t3:#94a3b8;
}
.pp-page { min-height:100vh; background:var(--bg); font-family:'DM Sans',ui-sans-serif,system-ui,sans-serif; }

/* ── HERO ── */
.hero-banner {
  position:relative; width:100%; height:220px;
  /* background: url('https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/i/s/iStock-509662042-1800.jpg?crop=0%2C72%2C1800%2C990&wid=1300&hei=715&scl=1.3846153846153846'); */
  background:linear-gradient(130deg,#0a1e38 0%,#0f3058 50%,#1a6b4a 100%);
  overflow:hidden; display:flex; align-items:center;
  justify-content:flex-end; padding:0 100px 0 0;
  /* object-fit:cover;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat; */
}
.hero-geo { position:absolute; border-radius:50%; opacity:.13; }
.hero-geo-1 { width:340px;height:340px; background:#3aab60; bottom:-100px;left:40px; }
.hero-geo-2 { width:200px;height:200px; background:#1a7a5e; top:-50px;left:300px; }
.hero-dots {
  position:absolute; inset:0;
  background-image:radial-gradient(rgba(255,255,255,.18) 1px,transparent 1px);
  background-size:24px 24px; opacity:.5;
}
.hero-chip {
  position:absolute; top:22px;left:22px;
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 14px; border:1.5px solid rgba(255,255,255,.5);
  border-radius:6px; font-size:11px;font-weight:700;
  color:#fff;letter-spacing:.05em;text-transform:uppercase;
}
.hero-text { position:relative;z-index:2;text-align:right;animation:hIn .5s ease both; }
@keyframes hIn { from{opacity:0;transform:translateX(20px)} }
.hero-name {
  font-size:clamp(1.5rem,3vw,2.5rem); font-weight:900; color:#fff;
  letter-spacing:-.01em; line-height:1.1; margin-bottom:6px;
  font-family:'DM Serif Display',Georgia,serif; text-transform:uppercase;
}
.hero-role { font-size:.87rem;color:rgba(255,255,255,.75);margin-bottom:18px;font-weight:500; }
.hero-actions { display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap; }
.ha-btn {
  display:inline-flex;align-items:center;gap:6px;padding:7px 15px;
  border-radius:6px;border:1.5px solid rgba(255,255,255,.85);
  background:rgba(255,255,255,.15);font-size:11px;font-weight:700;
  color:#fff;cursor:pointer;letter-spacing:.03em;transition:background .17s;
}
.ha-btn:hover{background:rgba(255,255,255,.28);}
.ha-btn-outline{background:transparent;border-color:rgba(255,255,255,.5);}
.ha-btn-ghost{background:transparent;border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.75);}

.hero-avatar-wrap {
  position: absolute;
  bottom: 10px;   
  left: 52px;
  z-index: 20;    
}
.hero-avatar {
  width:110px;height:110px;border-radius:50%;border:5px solid #fff;
  box-shadow:0 6px 28px rgba(0,0,0,.22);
  background:linear-gradient(135deg,#0d2137,#1a7a5e);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;position:relative;
}
.hero-avatar img{width:100%;height:100%;object-fit:cover;}
.hero-avatar span{font-size:2.5rem;font-weight:800;color:rgba(255,255,255,.9);font-family:'DM Serif Display',Georgia,serif;}
.ava-loading{position:absolute;inset:0;background:rgba(0,0,0,.45);border-radius:50%;display:flex;align-items:center;justify-content:center;}
.ava-cam {
  position:absolute;bottom:4px;right:4px;width:26px;height:26px;
  background:var(--accent);color:#fff;border:3px solid #fff;border-radius:50%;
  display:flex;align-items:center;justify-content:center;transition:transform .17s;
}
.hero-avatar-wrap:hover .ava-cam{transform:scale(1.15);}

/* ── IDENTITY ROW ── */
.identity-row {
  background:#fff;border-bottom:1px solid var(--border);
  padding:54px 52px 20px 52px;
    padding-top: 70px;
  display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;
}
.id-name{font-size:1.3rem;font-weight:800;color:var(--t1);margin-bottom:3px;}
.id-email{font-size:.83rem;color:var(--t2);margin-bottom:10px;}
.id-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.id-tag{display:inline-flex;align-items:center;gap:4px;font-size:.77rem;font-weight:600;color:var(--t2);}
.id-tag-link{color:var(--accent);cursor:pointer;}
.id-dot{color:var(--t3);font-size:.8rem;}
.id-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:.7rem;font-weight:700;background:rgba(26,107,222,.07);color:#1a5ab5;border:1px solid rgba(26,107,222,.13);}
.id-badge-id{background:rgba(0,0,0,.04);color:var(--t2);border-color:var(--border);}
.id-stats{display:flex;align-items:center;}
.stat-box{text-align:center;padding:0 22px;}
.stat-n{display:block;font-size:1.45rem;font-weight:800;color:var(--t1);line-height:1.2;}
.stat-l{display:block;font-size:.64rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.07em;margin-top:2px;}
.stat-sep{width:1px;height:36px;background:var(--border);}

/* ── BODY ── */
.body-wrap{display:grid;grid-template-columns:300px 1fr;gap:1.25rem;padding:1.25rem 52px;align-items:start;}
.body-aside{display:flex;flex-direction:column;}
.body-main{display:flex;flex-direction:column;}

/* ── CARDS ── */
.pp-card{background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:1rem;}
.pp-card-hd{display:flex;align-items:center;gap:7px;padding:12px 18px;border-bottom:1px solid var(--border);font-size:.7rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.07em;}
.pp-card-hd svg{fill:var(--t3);}
.detail-rows{padding:4px 0;}
.drow{display:flex;align-items:center;gap:11px;padding:10px 18px;border-bottom:1px solid rgba(0,0,0,.04);transition:background .13s;}
.drow:hover{background:rgba(26,107,222,.03);}
.drow-ico{width:26px;height:26px;border-radius:6px;background:rgba(26,107,222,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.drow-ico svg{fill:var(--accent);}
.drow-lbl{font-size:.65rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:1px;}
.drow-val{font-size:.82rem;font-weight:600;color:var(--t1);word-break:break-all;}
.qnav{padding:6px 8px;}
.qnav-item{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;text-decoration:none;color:var(--t1);transition:background .13s,transform .13s;}
.qnav-item:hover{background:rgba(26,107,222,.05);transform:translateX(3px);}
.qnav-ico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.qnav-ico svg{fill:var(--t2);}
.qnav-lbl{font-size:.82rem;font-weight:600;flex:1;}
.photo-row{display:flex;align-items:center;gap:12px;padding:14px 18px;}
.photo-thumb{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--navy),var(--teal));display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:rgba(255,255,255,.9);overflow:hidden;flex-shrink:0;border:2px solid rgba(26,107,222,.15);}
.photo-thumb img{width:100%;height:100%;object-fit:cover;}
.photo-ttl{font-size:.82rem;font-weight:700;color:var(--t1);margin-bottom:2px;}
.photo-sub{font-size:.72rem;color:var(--t3);}
.photo-btns{display:flex;gap:8px;padding:0 18px 16px;}

/* ── FORM CARDS ── */
.form-card{margin-bottom:1rem;}
.fcard-hd{display:flex;align-items:center;justify-content:space-between;padding:15px 22px;border-bottom:1px solid var(--border);}
.fcard-title{display:flex;align-items:center;gap:10px;font-size:.88rem;font-weight:700;color:var(--t1);}
.fcard-ico{width:29px;height:29px;background:rgba(26,107,222,.08);border-radius:8px;display:flex;align-items:center;justify-content:center;}
.fcard-ico svg{fill:var(--accent);}
.fcard-ico-amber{background:rgba(201,122,16,.08);}
.fcard-ico-amber svg{fill:var(--amber);}
.edit-notice{display:flex;align-items:center;gap:8px;padding:9px 22px;background:rgba(26,107,222,.05);border-bottom:1px solid rgba(26,107,222,.1);font-size:.79rem;font-weight:600;color:#1a5ab5;}
.edit-notice svg{fill:var(--accent);flex-shrink:0;}
.pp-form{padding:22px;}
.fg-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.fg-grid-3{grid-template-columns:repeat(3,1fr);}
.fg-full{grid-column:1/-1;}
.fg{display:flex;flex-direction:column;gap:5px;}
.fg-lbl{font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t3);}
.fg-field{display:flex;align-items:center;gap:9px;border:1.5px solid #dde3ea;border-radius:8px;background:#f8fafc;padding:0 12px;height:40px;transition:border-color .17s,box-shadow .17s;}
.fg-field svg{fill:var(--t3);flex-shrink:0;}
.fg-field:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(26,107,222,.1);background:#fff;}
.fg-field:focus-within svg{fill:var(--accent);}
.fg-ro{background:#f1f5f9;border-color:#eaf0f6;}
.fg-ro svg{opacity:.4;}
.fg-invalid{border-color:var(--danger);background:#fff6f6;}
.fg-field input,.fg-field select{flex:1;border:none;background:transparent;font-size:.84rem;color:var(--t1);outline:none;font-family:inherit;}
.fg-field input::placeholder{color:var(--t3);}
.fg-field input:read-only{cursor:default;color:var(--t2);}
.fg-field select{cursor:pointer;}
.fg-errmsg{font-size:.71rem;font-weight:600;color:var(--danger);margin:0;}
.form-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:1.25rem;}
.pass-rules{display:flex;flex-wrap:wrap;gap:5px 14px;margin-top:.75rem;}
.pr{display:inline-flex;align-items:center;gap:5px;font-size:.7rem;color:var(--t3);font-weight:600;}
.pr svg{fill:var(--t3);}
.pass-hint{display:flex;align-items:center;gap:8px;padding:13px 22px;font-size:.8rem;color:var(--t2);}
.pass-hint svg{fill:var(--t3);flex-shrink:0;}

/* ── BUTTONS ── */
.btn-solid{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:8px;border:none;background:var(--accent);color:#fff;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit;transition:background .17s,transform .12s,box-shadow .17s;}
.btn-solid:hover:not(:disabled){background:#1558c4;transform:translateY(-1px);box-shadow:0 6px 16px rgba(26,107,222,.25);}
.btn-solid:disabled{opacity:.65;cursor:not-allowed;}
.btn-amber{background:var(--amber);}
.btn-amber:hover:not(:disabled){background:#a8650b;box-shadow:0 6px 16px rgba(201,122,16,.25);}
.btn-ghost{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;border-radius:8px;border:1.5px solid #dde3ea;background:transparent;font-size:.82rem;font-weight:600;color:var(--t2);cursor:pointer;font-family:inherit;transition:background .14s;}
.btn-ghost:hover{background:#f1f5f9;border-color:#c8d4e0;}
.btn-danger{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:8px;border:1.5px solid rgba(198,40,40,.2);background:rgba(198,40,40,.06);font-size:.82rem;font-weight:600;color:var(--danger);cursor:pointer;font-family:inherit;transition:background .14s;}
.btn-danger:hover{background:rgba(198,40,40,.12);}
.spin{display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:sp .6s linear infinite;}
@keyframes sp{to{transform:rotate(360deg)}}

/* ── MODAL ── */
.modal-veil{position:fixed;inset:0;z-index:900;background:rgba(10,25,47,.5);display:flex;align-items:center;justify-content:center;}
.modal-box{background:#fff;border-radius:20px;padding:2rem;width:100%;max-width:360px;text-align:center;}
.modal-ico{width:50px;height:50px;border-radius:50%;background:rgba(26,107,222,.1);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;}
.modal-ico svg{fill:var(--accent);}
.modal-ttl{font-size:1rem;font-weight:800;color:var(--t1);margin-bottom:5px;}
.modal-sub{font-size:.84rem;color:var(--t2);margin-bottom:1.5rem;}
.modal-foot{display:flex;justify-content:center;gap:10px;}

/* ── TOAST ── */
.toast{position:fixed;bottom:22px;right:22px;z-index:999;display:inline-flex;align-items:center;gap:9px;padding:11px 18px;border-radius:40px;font-size:.82rem;font-weight:700;}
.toast.success{background:#0d2137;color:#fff;}
.toast.success svg{fill:#4ade80;}
.toast.error{background:var(--danger);color:#fff;}
.toast.error svg{fill:#fff;}

/* ── TRANSITIONS ── */
.fade-up-enter-active,.fade-up-leave-active{transition:all .22s ease;}
.fade-up-enter-from,.fade-up-leave-to{opacity:0;transform:translateY(6px);}
.expand-enter-active,.expand-leave-active{transition:all .3s ease;overflow:hidden;max-height:500px;}
.expand-enter-from,.expand-leave-to{opacity:0;max-height:0;}
.modal-enter-active,.modal-leave-active{transition:all .22s ease;}
.modal-enter-from,.modal-leave-to{opacity:0;}
.toast-enter-active,.toast-leave-active{transition:all .28s cubic-bezier(.4,0,.2,1);}
.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(12px) scale(.96);}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .hero-banner{height:auto;min-height:200px;padding:1rem;flex-direction:column;align-items:flex-start;justify-content:flex-end;}
  .hero-text{text-align:left;}
  .hero-actions{justify-content:flex-start;}
  .hero-avatar-wrap{position:relative;bottom:auto;left:auto;margin-bottom:12px;}
  .identity-row{padding:16px 20px;}
  .body-wrap{grid-template-columns:1fr;padding:1rem;}
  .fg-grid,.fg-grid-3{grid-template-columns:1fr;}
}

/* CARD */
.clean-card {
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

/* AVATAR */
.avatar-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  margin: auto;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ff5f00;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ICON */
.avatar-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #ff5f00;
  color: white;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper:hover .avatar-icon {
  transform: scale(1.1);
}

/* LOADING */
.avatar-loading {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* INPUT */
input, select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

input:focus {
  border-color: #ff5f00;
  outline: none;
}

/* BUTTON */
.btn-orange {
  background: #ff5f00;
  color: white;
  border-radius: 8px;
}

.badge-role {
  background: #fff3eb;
  color: #ff5f00;
  padding: 5px 12px;
  border-radius: 20px;
}

/* INFO */
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.section-title {
  font-weight: 600;
}

</style>