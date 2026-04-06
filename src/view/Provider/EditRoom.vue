<template>
  <div class="container pb-5 mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Card -->
        <div class="card shadow-lg rounded-4 p-5 border-0">
          <!-- Header -->
          <h3 class="fw-bold text-navy mb-4 text-center">Edit Room Listing</h3>

          <!-- Loading -->
          <div v-if="loadingFetch" class="text-center py-5">
            <div class="spinner-border text-orange" role="status"></div>
            <p class="mt-3 text-muted">Fetching room details...</p>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleUpdate">
            <!-- Room Title -->
            <div class="mb-4">
              <label class="form-label fw-bold">Room Title</label>
              <input
                v-model="form.title"
                type="text"
                class="form-control form-control-lg"
                required
                placeholder="e.g. Modern Condo near RUPP"
              />
            </div>

            <!-- Price & Size -->
            <div class="row mb-4">
              <div class="col-md-6 mb-3 mb-md-0">
                <label class="form-label fw-bold">Price ($/mo)</label>
                <input
                  v-model="form.price"
                  type="number"
                  class="form-control form-control-lg"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Room Size</label>
                <input
                  v-model="form.size_room"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="e.g. Big, 4x5m"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="form-label fw-bold">Description</label>
              <textarea
                v-model="form.description"
                class="form-control form-control-lg"
                rows="5"
                placeholder="Describe your room..."
              ></textarea>
            </div>

            <!-- Image Upload -->
            <div class="mb-4">
              <label class="form-label fw-bold">Room Image</label>
              <div v-if="imagePreview" class="mb-3 d-flex justify-content-center">
                <img
                  :src="imagePreview"
                  class="img-thumbnail rounded-4 shadow-sm"
                  style="max-height: 250px"
                  alt="Room Preview"
                />
              </div>
              <input type="file" @change="onFileChange" class="form-control" accept="image/*" />
              <small class="text-muted">Leave empty to keep current image.</small>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-between mt-4">
              <button
                type="button"
                @click="$router.back()"
                class="btn btn-light px-4 rounded-pill shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-orange px-5 rounded-pill shadow-sm"
                :disabled="loadingSubmit"
              >
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/RoomStore'
import api from '@/api/http'

const route = useRoute()
const router = useRouter()
const roomStore = useRoomStore()
const roomId = route.params.id

const loadingFetch = ref(true)
const loadingSubmit = ref(false)
const imagePreview = ref('')
const selectedFile = ref<File | null>(null)

const form = reactive({
  title: '',
  price: 0,
  description: '',
  size_room: '',
  district_id: 1,
})

// Fetch room details
const fetchRoomDetail = async () => {
  try {
    const res = await api.get(`/rooms/${roomId}`)
    if (res.data.result) {
      const room = res.data.data
      form.title = room.title
      form.price = room.price
      form.description = room.description
      form.size_room = room.size_room
      // form.district_id = room.district_id
      imagePreview.value = room.image
    }
  } catch (err) {
    console.error(err)
    alert('Could not load room data.')
  } finally {
    loadingFetch.value = false
  }
}

// Handle image selection
const onFileChange = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Handle update
const handleUpdate = async () => {
  loadingSubmit.value = true
  try {
    const formData = new FormData()
    formData.append('_method', 'POST')
    formData.append('title', form.title)
    formData.append('price', form.price.toString())
    formData.append('description', form.description)
    formData.append('size_room', form.size_room)
    formData.append('district_id', form.district_id.toString())
    if (selectedFile.value) formData.append('image', selectedFile.value)

    const success = await roomStore.updateRoom(roomId, formData)
    if (success) {
      alert('Room updated successfully!')
      router.push('/provider/my-rooms')
    } else {
      alert('Update failed!')
    }
  } catch (err) {
    console.error(err)
    alert('An error occurred.')
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(fetchRoomDetail)
</script>

<style scoped>
.text-navy {
  color: #032142;
  font-weight: 600;
}
.btn-orange {
  background-color: #ff5f00;
  color: #fff;
  border: none;
  transition: 0.3s;
}
.btn-orange:hover {
  background-color: #e65600;
}
.form-control:focus {
  border-color: #ff5f00;
  box-shadow: 0 0 0 0.25rem rgba(255, 95, 0, 0.1);
}
.card {
  background-color: #fff;
}
</style>
