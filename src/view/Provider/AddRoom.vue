<template>
  <div class="container-fluid py-3 px-md-4">
    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-header-navy p-3 text-white d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0">បង្ហោះបន្ទប់ថ្មី</h4>
            <span class="badge bg-orange px-3 py-2">របៀបព័ត៌មានលម្អិតពេញលេញ</span>
          </div>

          <div class="card-body p-4 bg-white">
            <!-- API error banner -->
            <div v-if="roomStore.error" class="alert alert-danger rounded-3 mb-4 d-flex align-items-center gap-2">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <span>{{ roomStore.error }}</span>
            </div>
            <form @submit.prevent="handleSubmit">
              <div class="row g-4">
                <!-- ── Left Column ── -->
                <div class="col-xl-7 col-lg-6">
                  <div class="section-container">
                    <h5 class="section-title mb-4">ព័ត៌មានទូទៅ</h5>

                    <div class="mb-4">
                      <label class="form-label fw-bold">ចំណងជើងបន្ទប់</label>
                      <input
                        v-model="form.title"
                        type="text"
                        class="form-control custom-input"
                        :class="{ 'is-invalid': errors.title }"
                        placeholder="e.g. Modern Studio near RUPP"
                      />
                      <div class="invalid-feedback">{{ errors.title }}</div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-4">
                        <label class="form-label fw-bold">តម្លៃ ($)</label>
                        <input
                          v-model="form.price"
                          type="number"
                          class="form-control custom-input"
                          :class="{ 'is-invalid': errors.price }"
                          placeholder="0.00"
                        />
                        <div class="invalid-feedback">{{ errors.price }}</div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold">បញ្ចុះតម្លៃ (%)</label>
                        <input
                          v-model="form.percent_promotion"
                          type="number"
                          class="form-control custom-input"
                          :class="{ 'is-invalid': errors.percent_promotion }"
                          placeholder="0"
                        />
                        <div class="invalid-feedback">{{ errors.percent_promotion }}</div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label fw-bold">ខណ្ឌ</label>
                        <select
                          v-model="form.district_id"
                          class="form-select custom-input"
                          :class="{ 'is-invalid': errors.district_id }"
                        >
                          <option value="" disabled>Select ខណ្ឌ</option>
                          <option
                            v-for="dist in districtStore.districts"
                            :key="dist.id"
                            :value="dist.id"
                          >
                            {{ dist.name }}
                          </option>
                        </select>
                        <div class="invalid-feedback">{{ errors.district_id }}</div>
                      </div>
                    </div>

                    <h5 class="section-title mb-4">វិក្កយបត្រ និងលក្ខណៈបច្ចេកទេស</h5>
                    <div class="row g-3 mb-4">
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">ទឹក ($)</label>
                        <input
                          v-model="form.pay_water"
                          type="number"
                          step="0.1"
                          class="form-control custom-input"
                        />
                      </div>
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">អគ្គិសនី ($)</label>
                        <input
                          v-model="form.pay_electric"
                          type="number"
                          step="0.1"
                          class="form-control custom-input"
                        />
                      </div>
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">ចំណត ($)</label>
                        <input
                          v-model="form.pay_parking"
                          type="number"
                          step="0.1"
                          class="form-control custom-input"
                        />
                      </div>
                      <div class="col-md-3 col-6">
                        <label class="small fw-bold text-muted">សំរាម ($)</label>
                        <input
                          v-model="form.pay_trash"
                          type="number"
                          step="0.1"
                          class="form-control custom-input"
                        />
                      </div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-4">
                        <label class="small fw-bold text-muted">គ្រែ</label>
                        <input
                          v-model="form.bed"
                          type="text"
                          class="form-control custom-input"
                          placeholder="e.g. 2 គ្រែ"
                        />
                      </div>
                      <div class="col-md-8">
                        <label class="small fw-bold text-muted">ទំហំបន្ទប់</label>
                        <input
                          v-model="form.size_room"
                          type="text"
                          class="form-control custom-input"
                          placeholder="e.g. 4m x 5m"
                        />
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="form-label fw-bold">តំណ Google Maps</label>
                      <input
                        v-model="form.map_url"
                        type="url"
                        class="form-control custom-input"
                        :class="{ 'is-invalid': errors.map_url }"
                        placeholder="https://goo.gl/maps/..."
                      />
                      <div class="invalid-feedback">{{ errors.map_url }}</div>
                    </div>

                    <div class="mb-0">
                      <label class="form-label fw-bold">ពិពណ៌នា</label>
                      <textarea
                        v-model="form.description"
                        class="form-control custom-input"
                        :class="{ 'is-invalid': errors.description }"
                        rows="4"
                        placeholder="Describe the room in detail (min. 20 characters)..."
                        maxlength="1000"
                      ></textarea>
                      <div class="d-flex justify-content-between mt-1">
                        <!-- FIX: added v-if guard so invalid-feedback only shows when error exists -->
                        <div class="invalid-feedback d-block" v-if="errors.description">
                          {{ errors.description }}
                        </div>
                        <small
                          class="ms-auto"
                          :class="form.description.length < 20 ? 'text-danger' : 'text-muted'"
                        >
                          {{ form.description.length }} / 1000
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ── Right Column ── -->
                <div class="col-xl-5 col-lg-6">
                  <div class="section-container h-100 d-flex flex-column">
                    <h5 class="section-title mb-4">មេឌៀ និងបរិក្ខារ</h5>

                    <div class="mb-4">
                      <label class="form-label fw-bold">រូបថតបន្ទប់</label>
                      <div
                        class="upload-box p-3 border rounded-3 text-center mb-3"
                        :class="{ 'border-danger': errors.image }"
                      >
                        <input
                          type="file"
                          @change="handleFileUpload"
                          class="form-control mb-2"
                          accept="image/*"
                        />
                        <div v-if="errors.image" class="text-danger small">{{ errors.image }}</div>
                      </div>

                      <!-- FIX: added position-relative so .preview-overlay (absolute) positions correctly -->
                      <div
                        v-if="imagePreview"
                        class="preview-full-box position-relative rounded-3 overflow-hidden shadow-sm border mb-4"
                      >
                        <img :src="imagePreview" class="img-fluid w-100" alt="Room preview" />
                        <div class="preview-overlay">មើលរូបភាពពេញ</div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="form-label fw-bold mb-3">បរិក្ខារ / សេវាកម្ម</label>
                      <div class="amenities-grid-full p-3 bg-light rounded-3 border">
                        <div
                          v-for="opt in roomOptionStore.options"
                          :key="opt.id"
                          class="amenity-item-full"
                        >
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            :id="'opt' + opt.id"
                            :value="opt.id"
                            v-model="form.room_option_ids"
                          />
                          <label class="form-check-label fw-medium" :for="'opt' + opt.id">
                            {{ opt.name }}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="mt-auto">
                      <button
                        type="submit"
                        class="btn btn-orange w-100 py-3 fw-bold shadow-orange"
                        :disabled="roomStore.loading"
                      >
                        <i class="bi bi-cloud-arrow-up-fill me-2"></i>
                        {{ roomStore.loading ? 'កំពុងផ្ទុកបន្ទប់...' : 'បញ្ជូនបញ្ជីបន្ទប់' }}
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
import { alertSuccess, alertError } from '@/Utils/alert'

const districtStore = useDistrictStore()
const roomOptionStore = useRoomOptionStore()
const roomStore = useRoomStore()
const router = useRouter()

const imagePreview = ref(null)
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

onMounted(async () => {
  try {
    await districtStore.fetchDistricts()
    await roomOptionStore.fetchOptions()
  } catch (error) {
    console.error('Failed to load form data:', error)
  }
})

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.image = file
    // FIX: revoke previous object URL to avoid memory leaks
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = URL.createObjectURL(file)
    delete errors.image
  }
}

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  if (!form.title || form.title.length < 5) {
    errors.title = 'ចំណងជើងត្រូវមានយ៉ាងតិច 5 តួអក្សរ'
    isValid = false
  }

  if (!form.price || Number(form.price) <= 0) {
    errors.price = 'សូមបញ្ចូលតម្លៃត្រឹមត្រូវ'
    isValid = false
  }

 

  if (Number(form.percent_promotion) < 0 || Number(form.percent_promotion) > 100) {
    errors.percent_promotion = 'បញ្ចុះតម្លៃត្រូវស្ថិតចន្លោះ 0 ដល់ 100'
    isValid = false
  }

  if (!form.district_id) {
    errors.district_id = 'សូមជ្រើសរើសខណ្ឌ'
    isValid = false
  }

  if (!form.image) {
    errors.image = 'សូមផ្ទុករូបភាព'
    isValid = false
  }

  if (!form.description || form.description.length < 20) {
    errors.description = 'ពិពណ៌នាត្រូវមានយ៉ាងតិច 20 តួអក្សរ'
    isValid = false
  }

  if (form.map_url) {
    const url = form.map_url.trim()
    const isValidGoogleMap =
      /^https?:\/\/(www\.)?(google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl\/maps)\/.+/i.test(url)
    if (!isValidGoogleMap) {
      errors.map_url = 'សូមបញ្ចូល Google Maps URL ត្រឹមត្រូវ'
      isValid = false
    }
  }

  return isValid
}

const resetForm = () => {
  form.title = ''
  form.price = ''
  form.percent_promotion = 0
  form.district_id = ''
  form.room_option_ids = []
  form.description = ''
  form.image = null
  form.pay_water = 0
  form.pay_electric = 0
  form.pay_parking = 0
  form.pay_trash = 0
  form.bed = ''
  form.size_room = ''
  form.map_url = ''

 
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = null
}

const handleSubmit = async () => {
  if (!validate()) return
  roomStore.error = '' // clear any previous API error

  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('price', form.price)
    formData.append('percent_promotion', Number(form.percent_promotion) || 0)
    formData.append('district_id', form.district_id)
    formData.append('description', form.description)
    formData.append('image', form.image)
    formData.append('pay_water', Number(form.pay_water) || 0)
    formData.append('pay_electric', Number(form.pay_electric) || 0)
    formData.append('pay_parking', Number(form.pay_parking) || 0)
    formData.append('pay_trash', Number(form.pay_trash) || 0)
    formData.append('bed', form.bed)
    formData.append('size_room', form.size_room)
    formData.append('map_url', form.map_url)
    // API requires room_option_ids as a JSON string e.g. "[1,2,3]"
    formData.append('room_option_ids', JSON.stringify(form.room_option_ids))

    const success = await roomStore.createRoom(formData)
    if (success) {
      alertSuccess('បង្កើតបន្ទប់ជោគជ័យ')
      resetForm()
      router.push('/provider/my-rooms')
    } else {
      alertError('បង្កើតបន្ទប់បរាជ័យ។ សូមព្យាយាមម្តងទៀត។')
    }
  } catch (error) {
    console.error('Create room error:', error)
    alertError('បង្កើតបន្ទប់បរាជ័យ')
  }
}
</script>

<style scoped>
.card-header-navy {
  background: #031c36;
  border-bottom: 4px solid #ff5f00;
}
.bg-orange {
  background-color: #ff5f00 !important;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #031c36;
  border-left: 5px solid #ff5f00;
  padding-left: 12px;
}
.custom-input {
  border-radius: 10px;
  border: 1.5px solid #e9ecef;
  padding: 10px 15px;
  background-color: #fbfcfd;
}
.custom-input:focus {
  border-color: #ff5f00;
  box-shadow: 0 0 0 0.25rem rgba(255, 95, 0, 0.1);
}
/* FIX: removed stray `placeholder {}` rule (invalid CSS selector) */
.custom-input::placeholder {
  color: #7a7a7a;
}
.preview-full-box img {
  display: block;
  max-height: 400px;
  object-fit: contain;
  background: #eee;
  width: 100%;
}
.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(3, 28, 54, 0.7);
  color: white;
  padding: 5px;
  font-size: 12px;
  text-align: center;
}
.amenities-grid-full {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}
.amenity-item-full {
  display: flex;
  align-items: center;
}
.btn-orange {
  background: #ff5f00;
  color: white;
  border: none;
  border-radius: 12px;
  transition: background 0.2s, transform 0.15s;
}
.btn-orange:hover:not(:disabled) {
  background: #e65600;
  transform: translateY(-2px);
}
.btn-orange:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.shadow-orange {
  box-shadow: 0 8px 20px rgba(255, 95, 0, 0.25);
}
.invalid-feedback {
  font-size: 0.85rem;
}
</style>