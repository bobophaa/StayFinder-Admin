<template>
  <div class="pp-page">


    <div class="hero-banner">
      <div class="hero-geo hero-geo-1"></div>
      <div class="hero-geo hero-geo-2"></div>
      <div class="hero-dots"></div>

   

      <div class="hero-text">
        <h1 class="hero-name">{{ user?.name || 'Provider Name' }}</h1>
        <p class="hero-role">{{ user?.current_job || 'Service Provider' }}</p>
        <div class="hero-actions">
          <button class="ha-btn" @click="enableEdit">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            Edit profile
          </button>
          <button class="ha-btn ha-btn-outline" @click="showPassForm = !showPassForm">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
            Password
          </button>
          <button class="ha-btn ha-btn-ghost">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            My listings
          </button>
        </div>
      </div>

      <div class="hero-avatar-wrap" @click="triggerUpload" title="Change photo">
        <div class="hero-avatar">
          <img v-if="avatarPreview || user?.avatar" :src="avatarPreview || user?.avatar" alt="avatar" />
          <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'P' }}</span>
          <div v-if="loading && uploadingAvatar" class="ava-loading"><span class="spin"></span></div>
        </div>
        <div class="ava-cam">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 13.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2z"/></svg>
        </div>
      </div>
      <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />
    </div>

    <!-- ════════════════════════════════
         IDENTITY ROW
    ════════════════════════════════ -->
    <div class="identity-row">
      <div class="identity-left">
        <h2 class="id-name">{{ user?.name || '—' }}</h2>
        <p class="id-email">{{ user?.email || '—' }}</p>
        <div class="id-meta">
          <span class="id-tag">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Cambodia
          </span>
          <span class="id-dot">·</span>
          <a href="#contact" class="id-tag id-tag-link">Contact info</a>
          <span class="id-dot">·</span>
          <span class="id-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Service Provider
          </span>
          <span class="id-badge id-badge-id">#{{ user?.id || '001' }}</span>
        </div>
      </div>

      <div class="id-stats">
        <div class="stat-box">
          <span class="stat-n">142</span>
          <span class="stat-l">Bookings</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-box">
          <span class="stat-n">96%</span>
          <span class="stat-l">Rating</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-box">
          <span class="stat-n">3.8y</span>
          <span class="stat-l">Tenure</span>
        </div>
      </div>
    </div>


    <div class="body-wrap">

      <!-- LEFT SIDEBAR -->
      <aside class="body-aside">

        <div class="pp-card">
          <div class="pp-card-hd">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Account details
          </div>
          <div class="detail-rows">
            <div class="drow">
              <div class="drow-ico"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div>
              <div><div class="drow-lbl">Email</div><div class="drow-val">{{ user?.email || '—' }}</div></div>
            </div>
            <div class="drow">
              <div class="drow-ico"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></div>
              <div><div class="drow-lbl">Phone</div><div class="drow-val">{{ user?.phone || 'Not set' }}</div></div>
            </div>
            <div class="drow">
              <div class="drow-ico"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/></svg></div>
              <div><div class="drow-lbl">Gender</div><div class="drow-val">{{ user?.gender == 1 ? 'Male' : user?.gender == 2 ? 'Female' : 'Not set' }}</div></div>
            </div>
            <div class="drow" style="border:none">
              <div class="drow-ico"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.86.18-1 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 .14.11.56.18 1H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-3c1.1 0 2 .9 2 2 0 .14-.11.56-.18 1h-3.64c-.07-.44-.18-.86-.18-1 0-1.1.9-2 2-2z"/></svg></div>
              <div><div class="drow-lbl">Job title</div><div class="drow-val">{{ user?.current_job || 'Not set' }}</div></div>
            </div>
          </div>
        </div>

        <div class="pp-card">
          <div class="pp-card-hd">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
            Quick links
          </div>
          <nav class="qnav">
            <router-link v-for="lnk in quickLinks" :key="lnk.to" :to="lnk.to" class="qnav-item">
              <span class="qnav-ico" :style="{ background: lnk.bg }"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" v-html="lnk.icon"></svg></span>
              <span class="qnav-lbl">{{ lnk.label }}</span>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="opacity:.3"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </router-link>
          </nav>
        </div>

        <div class="pp-card">
          <div class="pp-card-hd">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            Profile photo
          </div>
          <div class="photo-row">
            <div class="photo-thumb">
              <img v-if="avatarPreview || user?.avatar" :src="avatarPreview || user?.avatar" alt="avatar" />
              <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'P' }}</span>
            </div>
            <div><p class="photo-ttl">Update photo</p><p class="photo-sub">JPG/PNG · max 2 MB</p></div>
          </div>
          <div class="photo-btns">
            <button class="btn-solid" @click="triggerUpload" :disabled="loading">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
              Upload
            </button>
            <button v-if="user?.avatar" class="btn-danger" @click="removeAvatar" :disabled="loading">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              Remove
            </button>
          </div>
        </div>

      </aside>

      <!-- RIGHT: FORMS -->
      <section class="body-main">

        <div class="pp-card form-card">
          <div class="fcard-hd">
            <div class="fcard-title">
              <div class="fcard-ico">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              Profile information
            </div>
            <div>
              <button v-if="!isEditing" class="btn-ghost" @click="enableEdit">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                Edit
              </button>
              <button v-else class="btn-ghost" @click="cancelEdit">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                Cancel
              </button>
            </div>
          </div>

          <div v-if="isEditing" class="edit-notice">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Editing mode active — save your changes when ready
          </div>

          <form class="pp-form" @submit.prevent="updateProfile">
            <div class="fg-grid">
              <div class="fg" :class="{ 'fg-has-err': errors.name }">
                <label class="fg-lbl">Full name</label>
                <div class="fg-field" :class="{ 'fg-ro': !isEditing, 'fg-invalid': errors.name }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <input v-model="form.name" :readonly="!isEditing" placeholder="Your full name" />
                </div>
                <p v-if="errors.name" class="fg-errmsg">{{ errors.name }}</p>
              </div>

              <div class="fg" :class="{ 'fg-has-err': errors.email }">
                <label class="fg-lbl">Email address</label>
                <div class="fg-field" :class="{ 'fg-ro': !isEditing, 'fg-invalid': errors.email }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <input v-model="form.email" type="email" :readonly="!isEditing" placeholder="email@example.com" />
                </div>
                <p v-if="errors.email" class="fg-errmsg">{{ errors.email }}</p>
              </div>

              <div class="fg">
                <label class="fg-lbl">Phone number</label>
                <div class="fg-field" :class="{ 'fg-ro': !isEditing }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <input v-model="form.phone" :readonly="!isEditing" placeholder="Phone number" />
                </div>
              </div>

              <div class="fg">
                <label class="fg-lbl">Gender</label>
                <div class="fg-field" :class="{ 'fg-ro': !isEditing }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/></svg>
                  <select v-model="form.gender" :disabled="!isEditing">
                    <option :value="1">Male</option>
                    <option :value="2">Female</option>
                  </select>
                </div>
              </div>

              <div class="fg fg-full">
                <label class="fg-lbl">Job title / role</label>
                <div class="fg-field" :class="{ 'fg-ro': !isEditing }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.86.18-1 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 .14.11.56.18 1H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-3c1.1 0 2 .9 2 2 0 .14-.11.56-.18 1h-3.64c-.07-.44-.18-.86-.18-1 0-1.1.9-2 2-2z"/></svg>
                  <input v-model="form.current_job" :readonly="!isEditing" placeholder="e.g. Property Manager" />
                </div>
              </div>
            </div>

            <Transition name="fade-up">
              <div v-if="isEditing" class="form-foot">
                <button type="button" class="btn-ghost" @click="cancelEdit">Discard</button>
                <button type="submit" class="btn-solid" :disabled="loading">
                  <span v-if="loading" class="spin"></span>
                  <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Save changes
                </button>
              </div>
            </Transition>
          </form>
        </div>

        <div class="pp-card form-card">
          <div class="fcard-hd">
            <div class="fcard-title">
              <div class="fcard-ico fcard-ico-amber">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </div>
              Change password
            </div>
            <button class="btn-ghost" @click="showPassForm = !showPassForm">{{ showPassForm ? 'Cancel' : 'Update' }}</button>
          </div>

          <Transition name="expand">
            <div v-if="showPassForm" class="pp-form" style="padding-top:0">
              <div class="fg-grid fg-grid-3">
                <div class="fg">
                  <label class="fg-lbl">Current password</label>
                  <div class="fg-field">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                    <input v-model="passForm.old_pass" type="password" placeholder="Current password" />
                  </div>
                </div>
                <div class="fg">
                  <label class="fg-lbl">New password</label>
                  <div class="fg-field">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                    <input v-model="passForm.new_pass" type="password" placeholder="New password" />
                  </div>
                </div>
                <div class="fg">
                  <label class="fg-lbl">Confirm password</label>
                  <div class="fg-field">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                    <input v-model="passForm.new_pass_confirmation" type="password" placeholder="Confirm password" />
                  </div>
                </div>
              </div>
              <div class="pass-rules">
                <span class="pr" v-for="r in passRules" :key="r">
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                  {{ r }}
                </span>
              </div>
              <div class="form-foot">
                <button class="btn-solid btn-amber" :disabled="passLoading" @click="changePassword">
                  <span v-if="passLoading" class="spin"></span>
                  <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Update password
                </button>
              </div>
            </div>
          </Transition>

          <p v-if="!showPassForm" class="pass-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            Minimum 8 characters including uppercase letters, numbers and special symbols.
          </p>
        </div>

      </section>
    </div>

    <!-- MODAL -->
    <Transition name="modal">
      <div v-if="showConfirmModal" class="modal-veil" @click.self="showConfirmModal = false">
        <div class="modal-box">
          <div class="modal-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
          <h3 class="modal-ttl">Confirm update</h3>
          <p class="modal-sub">Save changes to your profile information?</p>
          <div class="modal-foot">
            <button class="btn-ghost" @click="showConfirmModal = false">Cancel</button>
            <button class="btn-solid" @click="confirmUpdate" :disabled="loading">
              <span v-if="loading" class="spin"></span>
              <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <svg v-if="toast.type==='success'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

const user             = ref(null)
const loading          = ref(false)
const passLoading      = ref(false)
const uploadingAvatar  = ref(false)
const fileInput        = ref(null)
const avatarPreview    = ref(null)
const isEditing        = ref(false)
const showPassForm     = ref(false)
const showConfirmModal = ref(false)

const form     = reactive({ name:'', email:'', phone:'', gender:1, current_job:'' })
const errors   = reactive({ name:'', email:'' })
const passForm = reactive({ old_pass:'', new_pass:'', new_pass_confirmation:'' })
const toast    = reactive({ show:false, message:'', type:'success' })
const passRules = ['8+ characters','One uppercase','One number','Special symbol']

const quickLinks = [
  { to:'/provider',           label:'Dashboard',        bg:'rgba(83,74,183,.1)',  icon:'<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { to:'/provider/my-rooms',  label:'My rooms',         bg:'rgba(13,148,136,.1)', icon:'<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' },
  { to:'/provider/add-room',  label:'Post new room',    bg:'rgba(37,99,235,.1)',  icon:'<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>' },
  { to:'/provider/bookings',  label:'Booking requests', bg:'rgba(201,122,16,.1)', icon:'<path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v11zM7 10h5v5H7z"/>' },
]

const showToast = (msg, type='success') => {
  toast.message=msg; toast.type=type; toast.show=true
  setTimeout(()=>(toast.show=false),3500)
}
const fetchUser = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data?.data || res.data
    Object.assign(form,{ name:user.value.name||'', email:user.value.email||'', phone:user.value.phone||'', gender:user.value.gender||1, current_job:user.value.current_job||'' })
  } catch(e){ console.error(e) }
}
const enableEdit = () => { isEditing.value=true }
const cancelEdit = () => {
  isEditing.value=false; errors.name=errors.email=''
  Object.assign(form,{ name:user.value.name||'', email:user.value.email||'', phone:user.value.phone||'', gender:user.value.gender||1, current_job:user.value.current_job||'' })
}
const validate = () => {
  errors.name=errors.email=''; let ok=true
  if(!form.name?.trim()){ errors.name='Full name is required'; ok=false }
  if(!form.email){ errors.email='Email is required'; ok=false }
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){ errors.email='Invalid email'; ok=false }
  return ok
}
const updateProfile = () => { if(!validate()) return; showConfirmModal.value=true }
const confirmUpdate = async () => {
  showConfirmModal.value=false; loading.value=true
  try {
    await api.post('/profile/info',form); Object.assign(user.value,form); isEditing.value=false
    showToast('Profile updated successfully')
  } catch(e){ showToast(e.response?.data?.message||'Update failed','error') }
  finally { loading.value=false }
}
const changePassword = async () => {
  if(!passForm.old_pass||!passForm.new_pass||!passForm.new_pass_confirmation) return showToast('Fill in all password fields','error')
  if(passForm.new_pass!==passForm.new_pass_confirmation) return showToast('Passwords do not match','error')
  passLoading.value=true
  try {
    await api.put('/profile/pass',passForm); showToast('Password changed successfully')
    Object.assign(passForm,{old_pass:'',new_pass:'',new_pass_confirmation:''}); showPassForm.value=false
  } catch(e){ showToast(e.response?.data?.message||'Failed','error') }
  finally { passLoading.value=false }
}
const triggerUpload = () => fileInput.value?.click()
const handleFileUpload = async (e) => {
  const file=e.target.files[0]; if(!file) return
  if(file.size>2*1024*1024) return showToast('Max 2 MB','error')
  avatarPreview.value=URL.createObjectURL(file)
  const fd=new FormData(); fd.append('image',file)
  loading.value=true; uploadingAvatar.value=true
  try {
    await api.post('/profile/image',fd,{headers:{'Content-Type':'multipart/form-data'}})
    await fetchUser(); avatarPreview.value=null; showToast('Photo updated')
  } catch(e){ avatarPreview.value=null; showToast(e.response?.data?.message||'Upload failed','error') }
  finally { loading.value=false; uploadingAvatar.value=false; e.target.value='' }
}
const removeAvatar = async () => {
  if(!confirm('Remove profile photo?')) return; loading.value=true
  try {
    await api.delete('/profile/image'); user.value.avatar=null; avatarPreview.value=null; showToast('Photo removed')
  } catch(e){ showToast(e.response?.data?.message||'Failed','error') }
  finally { loading.value=false }
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
</style>