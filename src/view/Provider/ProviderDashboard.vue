<template>
  <div class="container-fluid py-4">
    <h3 class="fw-bold mb-4">Dashboard Overview</h3>
<!-- 
    <div class="row g-3 mb-5">
      <div class="col-md-3" v-for="stat in stats" :key="stat.label">
        <div class="card border-0 shadow-sm rounded-4 p-3 text-center bg-navy text-white">
          <div class="fs-4 fw-bold text-orange">{{ stat.value }}</div>
          <div class="small opacity-75">{{ stat.label }}</div>
        </div>
      </div>
    </div> -->

    <div class="row g-4">
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
          <h5 class="fw-bold mb-3">Recent Requests</h5>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr class="text-muted small">
                  <th>Renter</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <!-- <tbody>
                <tr v-for="request in recentRequests" :key="request.id">
                  <td class="fw-bold">{{ request.name }}</td>
                  <td>{{ request.room }}</td>
                  <td><span class="badge bg-light-orange text-orange">Pending</span></td>
                  <td><button class="btn btn-sm btn-navy rounded-pill px-3">View</button></td>
                </tr>
              </tbody> -->
            </table>
          </div>
        </div>
      </div>

    
    </div>
  </div>
</template>

<style scoped>
.bg-navy { background: #031c36; }
.text-orange { color: #ff5f00; }
.btn-orange { background: #ff5f00; color: white; border: none; }
.btn-navy { background: #031c36; color: white; border: none; }
.bg-light-orange { background: rgba(255, 95, 0, 0.1); }
</style>