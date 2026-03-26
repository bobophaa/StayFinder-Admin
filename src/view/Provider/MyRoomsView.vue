<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">My Properties</h3>
      <router-link to="/provider/add-room" class="btn btn-orange px-4 rounded-pill fw-bold">
        + Post New Room
      </router-link>
    </div>

    <div v-if="roomStore.loading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status"></div>
      <p class="mt-2 text-muted">Loading your properties...</p>
    </div>

    <div v-else-if="roomStore.myRooms.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
      <i class="bi bi-house-exclamation fs-1 text-muted"></i>
      <h5 class="mt-3">No rooms posted yet</h5>
      <p class="text-muted">Start by adding your first rental property.</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="room in roomStore.myRooms" :key="room.id" class="col-12">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden property-card">
          <div class="row g-0">
            <div class="col-md-3">
              <img :src="room.image_url" class="img-fluid h-100 w-100 object-fit-cover" :alt="room.title">
            </div>
            <div class="col-md-9">
              <div class="card-body p-4 d-flex flex-column h-100">
                <div class="d-flex justify-content-between">
                  <h5 class="fw-bold text-navy">{{ room.title }}</h5>
                  <div class="text-orange fw-bold fs-5">${{ room.price }}/mo</div>
                </div>
                
                <p class="text-muted small mb-3">
                  <i class="bi bi-geo-alt-fill me-1"></i> {{ room.district?.name || 'Phnom Penh' }}
                </p>

                <div class="mt-auto d-flex justify-content-between align-items-center">
                  <div class="stats-icons d-flex gap-3">
                    <span class="small text-muted"><i class="bi bi-bed me-1"></i> {{ room.bed }} Beds</span>
                    <span class="small text-muted"><i class="bi bi-arrows-fullscreen me-1"></i> {{ room.size_room }}</span>
                  </div>
                  
                  <div class="action-buttons">
                    <button @click="editRoom(room.id)" class="btn btn-outline-navy btn-sm me-2">
                      <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button @click="confirmDelete(room.id)" class="btn btn-outline-danger btn-sm">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoomStore } from '@/stores/RoomStore';

const roomStore = useRoomStore();

onMounted(() => {
 
  roomStore.fetchMyRooms(); 
});

const editRoom = (id) => {
  
};

const confirmDelete = (id) => {
  if(confirm("Are you sure you want to delete this listing?")) {
    roomStore.deleteRoom(id);
  }
};
</script>

<style scoped>
.text-navy { color: #031c36; }
.text-orange { color: #ff5f00; }
.btn-orange { background: #ff5f00; color: white; border: none; }
.btn-outline-navy { color: #031c36; border-color: #031c36; }
.btn-outline-navy:hover { background: #031c36; color: white; }
.property-card { transition: transform 0.2s; }
.property-card:hover { transform: translateY(-5px); }
</style>