<template>
  <div class="container py-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <h3 class="fw-bold text-navy mb-4">Edit Room Listing</h3>
          
          <div v-if="loadingFetch" class="text-center py-5">
            <div class="spinner-border text-orange" role="status"></div>
            <p class="mt-2 text-muted">Loading room data...</p>
          </div>

          <form v-else @submit.prevent="handleUpdate">
            <div class="mb-3">
              <label class="form-label fw-bold">Room Title</label>
              <input v-model="form.title" type="text" class="form-control" required placeholder="e.g. Modern Condo near RUPP">
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Price ($/mo)</label>
                <input v-model="form.price" type="number" class="form-control" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Room Size</label>
                <input v-model="form.size_room" type="text" class="form-control" placeholder="e.g. Big, 4x5m">
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Description</label>
              <textarea v-model="form.description" class="form-control" rows="4"></textarea>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Room Image</label>
              <div v-if="imagePreview" class="mb-3">
                <img :src="imagePreview" class="img-thumbnail rounded-3" style="max-height: 200px;">
              </div>
              <input type="file" @change="onFileChange" class="form-control" accept="image/*">
              <small class="text-muted">Leave empty to keep the current image.</small>
            </div>

            <div class="d-flex gap-2">
              <button type="button" @click="$router.back()" class="btn btn-light px-4 rounded-pill">Cancel</button>
              <button type="submit" class="btn btn-orange px-5 rounded-pill shadow-sm" :disabled="loadingSubmit">
                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2"></span>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/http'; //

const route = useRoute();
const router = useRouter();
const roomId = route.params.id;

const loadingFetch = ref(true);
const loadingSubmit = ref(false);
const imagePreview = ref('');
const selectedFile = ref<File | null>(null);

const form = reactive({
  title: '',
  price: '',
  description: '',
  size_room: '',
  district_id: 1, 
});


const fetchRoomDetail = async () => {
  try {
    const res = await api.get(`/rooms/${roomId}`); 
    if (res.data.result) {
      const room = res.data.data;
      form.title = room.title;
      form.price = room.price;
      form.description = room.description;
      form.size_room = room.size_room;
      form.district_id = room.district_id;
      imagePreview.value = room.image; 
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Could not load room data.");
  } finally {
    loadingFetch.value = false;
  }
};

const onFileChange = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleUpdate = async () => {
  loadingSubmit.value = true;
  try {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', form.title);
    formData.append('price', form.price.toString());
    formData.append('description', form.description);
    formData.append('size_room', form.size_room);
    formData.append('district_id', form.district_id.toString());
    
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    const res = await api.post(`/rooms/${roomId}`, formData); 
    
    if (res.data.result) {
      alert("Room updated successfully!");
      router.push('/provider/manage-rooms');
    }
  } catch (err: any) {
    console.error("Update error:", err.response?.data);
    alert(err.response?.data?.message || "Update failed.");
  } finally {
    loadingSubmit.value = false;
  }
};

onMounted(fetchRoomDetail);
</script>

<style scoped>
.text-navy { color: #032142; }
.btn-orange { background-color: #FF5F00; color: white; border: none; transition: 0.3s; }
.btn-orange:hover { background-color: #e65600; color: white; }
.form-control:focus { border-color: #FF5F00; box-shadow: 0 0 0 0.25rem rgba(255, 95, 0, 0.1); }
</style>