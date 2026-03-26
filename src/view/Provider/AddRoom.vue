<template>
  <div class="container-fluid py-3 px-md-4">
    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header-navy p-3 text-white d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0">Post a New Room</h4>
            <span class="badge bg-orange px-3 py-2">Full Details Mode</span>
          </div>

          <div class="card-body p-4 bg-white">
            <form @submit.prevent="handleSubmit">
              <div class="row g-4">
                
                <div class="col-xl-7 col-lg-6">
                  <div class="section-container">
                    <h5 class="section-title mb-4">General Information</h5>
                    
                    <div class="mb-4">
                      <label class="form-label fw-bold">Room Title</label>
                      <input 
                        v-model="form.title" 
                        type="text" 
                        class="form-control custom-input" 
                        :class="{'is-invalid': errors.title}"
                        placeholder="e.g. Modern Studio near RUPP" 
                      />
                      <div class="invalid-feedback">{{ errors.title }}</div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-4">
                        <label class="form-label fw-bold">Price ($)</label>
                        <input 
                          v-model="form.price" 
                          type="number" 
                          class="form-control custom-input" 
                          :class="{'is-invalid': errors.price}"
                          placeholder="0.00" 
                        />
                        <div class="invalid-feedback">{{ errors.price }}</div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold">Promotion (%)</label>
                        <input 
                          v-model="form.percent_promotion" 
                          type="number" 
                          class="form-control custom-input" 
                          :class="{'is-invalid': errors.percent_promotion}"
                          placeholder="0" 
                        />
                        <div class="invalid-feedback">{{ errors.percent_promotion }}</div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold">District</label>
                        <select 
                          v-model="form.district_id" 
                          class="form-select custom-input" 
                          :class="{'is-invalid': errors.district_id}"
                        >
                          <option value="" disabled>Select District</option>
                          <option v-for="dist in districtStore.districts" :key="dist.id" :value="dist.id">
                            {{ dist.name }}
                          </option>
                        </select>
                        <div class="invalid-feedback">{{ errors.district_id }}</div>
                      </div>
                    </div>

                    <h5 class="section-title mb-4">Bills & Specifications</h5>
                    <div class="row g-3 mb-4">
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">Water ($)</label>
                        <input v-model="form.pay_water" type="number" step="0.1" class="form-control custom-input" />
                      </div>
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">Electric ($)</label>
                        <input v-model="form.pay_electric" type="number" step="0.1" class="form-control custom-input" />
                      </div>
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">Parking ($)</label>
                        <input v-model="form.pay_parking" type="number" step="0.1" class="form-control custom-input" />
                      </div>
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">Trash ($)</label>
                        <input v-model="form.pay_trash" type="number" step="0.1" class="form-control custom-input" />
                      </div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-4">
                        <label class="small fw-bold text-muted">Beds</label>
                        <input v-model="form.bed" type="text" class="form-control custom-input" placeholder="e.g. 2 Beds" />
                      </div>
                      <div class="col-md-8">
                        <label class="small fw-bold text-muted">Room Size</label>
                        <input v-model="form.size_room" type="text" class="form-control custom-input" placeholder="e.g. 4m x 5m" />
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="form-label fw-bold">Google Maps URL</label>
                      <input 
                        v-model="form.map_url" 
                        type="url" 
                        class="form-control custom-input" 
                        :class="{'is-invalid': errors.map_url}"
                        placeholder="https://goo.gl/maps/..." 
                      />
                      <div class="invalid-feedback">{{ errors.map_url }}</div>
                    </div>

                    <div class="mb-0">
                      <label class="form-label fw-bold">Description</label>
                      <textarea v-model="form.description" class="form-control custom-input" rows="4" placeholder="describe detail the room..."></textarea>
                    </div>
                  </div>
                </div>

                <div class="col-xl-5 col-lg-6">
                  <div class="section-container h-100 d-flex flex-column">
                    <h5 class="section-title mb-4">Media & Amenities</h5>
                    
                    <div class="mb-4">
                      <label class="form-label fw-bold">Room Photo</label>
                      <div class="upload-box p-3 border rounded-3 text-center mb-3" :class="{'border-danger': errors.image}">
                        <input type="file" @change="handleFileUpload" class="form-control mb-2" accept="image/*" />
                        <div v-if="errors.image" class="text-danger small">{{ errors.image }}</div>
                      </div>
                      
                      <div v-if="imagePreview" class="preview-full-box rounded-3 overflow-hidden shadow-sm border mb-4">
                        <img :src="imagePreview" class="img-fluid w-100" />
                        <div class="preview-overlay">Full Image Preview</div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="form-label fw-bold mb-3">Amenities / Facilities</label>
                      <div class="amenities-grid-full p-3 bg-light rounded-3 border">
                        <div v-for="opt in roomOptionStore.options" :key="opt.id" class="amenity-item-full">
                          <input class="form-check-input me-2" type="checkbox" :id="'opt'+opt.id" :value="opt.id" v-model="form.room_option_ids">
                          <label class="form-check-label fw-medium" :for="'opt'+opt.id">{{ opt.name }}</label>
                        </div>
                      </div>
                    </div>

                    <div class="mt-auto">
                      <button type="submit" class="btn btn-orange w-100 py-3 fw-bold shadow-orange" :disabled="roomStore.loading">
                        <i class="bi bi-cloud-arrow-up-fill me-2"></i>
                        {{ roomStore.loading ? 'Uploading Room...' : 'SUBMIT ROOM LISTING' }}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useDistrictStore } from '@/stores/DistrictStore'
import { useRoomOptionStore } from '@/stores/RoomOptionStore'
import { useRoomStore } from '@/stores/RoomStore'
import { useRouter } from 'vue-router'

const districtStore = useDistrictStore()
const roomOptionStore = useRoomOptionStore()
const roomStore = useRoomStore()
const router = useRouter()

const errors = reactive({})
const form = reactive({
  title: '',
  price: '',
  percent_promotion: 0,
  district_id: '',
  room_option_ids: [],
  description: '',
  image: null,
  pay_water: 0,
  pay_electric: 0,
  pay_parking: 0,
  pay_trash: 0,
  bed: '',
  size_room: '',
  map_url: '',
})

const imagePreview = ref(null)

onMounted(() => {
  districtStore.fetchDistricts()
  roomOptionStore.fetchOptions()
})

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.image = file
    imagePreview.value = URL.createObjectURL(file)
    delete errors.image // Clear error when file is selected
  }
}

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (!form.title || form.title.length < 5) {
    errors.title = "Title must be at least 5 characters long."
    isValid = false
  }
  if (!form.price || form.price <= 0) {
    errors.price = "Please enter a valid price."
    isValid = false
  }
  if (form.percent_promotion < 0 || form.percent_promotion > 100) {
    errors.percent_promotion = "Promotion must be between 0 and 100."
    isValid = false
  }
  if (!form.district_id) {
    errors.district_id = "Please select a district."
    isValid = false
  }
  if (!form.image) {
    errors.image = "Please upload at least one room photo."
    isValid = false
  }
  if (form.map_url && !form.map_url.startsWith('http')) {
    errors.map_url = "Map URL must start with http:// or https://"
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  const formData = new FormData()
  formData.append('title', form.title)
  formData.append('district_id', form.district_id)
  formData.append('price', form.price)
  formData.append('percent_promotion', form.percent_promotion || 0)
  formData.append('description', form.description || 'StayFinder Listing')
  formData.append('image', form.image)
  formData.append('pay_water', form.pay_water || 0)
  formData.append('pay_electric', form.pay_electric || 0)
  formData.append('pay_parking', form.pay_parking || 0)
  formData.append('pay_trash', form.pay_trash || 0)
  formData.append('bed', form.bed || '1')
  formData.append('size_room', form.size_room || 'N/A')
  formData.append('map_url', form.map_url || '')
  formData.append('room_option_ids', JSON.stringify(form.room_option_ids))

  const success = await roomStore.addRoom(formData)
  if (success) router.push('/provider/my-rooms')
}
</script>

<style scoped>
.card-header-navy { background: #031c36; border-bottom: 4px solid #ff5f00; }
.section-title { font-size: 1.1rem; font-weight: 700; color: #031c36; border-left: 5px solid #ff5f00; padding-left: 12px; }
.custom-input { border-radius: 10px; border: 1.5px solid #e9ecef; padding: 10px 15px; background-color: #fbfcfd; }
.custom-input:focus { border-color: #ff5f00; box-shadow: 0 0 0 0.25rem rgba(255, 95, 0, 0.1); }
.preview-full-box img { display: block; max-height: 400px; object-fit: contain; background: #eee; width: 100%; }
.preview-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(3, 28, 54, 0.7); color: white; padding: 5px; font-size: 12px; text-align: center; }
.amenities-grid-full { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.btn-orange { background: #ff5f00; color: white; border: none; border-radius: 12px; }
.btn-orange:hover { background: #e65600; transform: translateY(-2px); }
.shadow-orange { box-shadow: 0 8px 20px rgba(255, 95, 0, 0.25); }
.invalid-feedback { font-size: 0.85rem; }
</style>