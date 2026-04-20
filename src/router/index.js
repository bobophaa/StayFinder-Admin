import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ─── LAYOUT ─────────────────────────────
import MainLayout from '@/components/layout/MainLayout.vue'

// ─── AUTH ───────────────────────────────
import Adminlogin from '@/view/Adminlogin.vue'

// ─── PROVIDER ───────────────────────────
import ProviderDashboard from '@/view/Provider/ProviderDashboard.vue'
import AddRoom from '@/view/Provider/AddRoom.vue'
import ManageRooms from '@/view/Provider/ManageRooms.vue'
import MyRoomsView from '@/view/Provider/MyRoomsView.vue'
import BookingRequests from '@/view/Provider/BookingRequests.vue'
import RentManagementView from '@/view/Provider/RentManagementView.vue'

// ─── ADMIN ──────────────────────────────
import AdminDashboard from '@/view/Admin/AdminDashboard.vue'
import DistrictManagement from '@/view/Admin/DistrictManagement.vue'
import RoomOptionManagement from '@/view/Admin/RoomOptionManagement.vue'
import UserMangement from '@/view/Admin/UserMangement.vue'
import Providerprofile from '@/view/Provider/Providerprofile.vue'

// ─── ROUTES ─────────────────────────────
const routes = [
    {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    name: 'login',
    component: Adminlogin,
    meta: { guestOnly: true },
  },
   

  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
       {
        path: 'profile',
        name: 'profile',
        component: () => import('@/view/ProfileInfo.vue'),
        meta: { role: 'Service Provider' },
      },
      // ── Provider ──
      {
        path: 'provider/dashboard',
        name: 'provider.dashboard',
        component: ProviderDashboard,
        meta: { role: 'Service Provider' },
      },
        {
        path: 'provider/profile',
        name: 'provider.profile',
        component:Providerprofile,
        meta: { role: 'Service Provider' },
      },
      {
        path: 'provider/add-room',
        name: 'provider.addRoom',
        component: AddRoom,
        meta: { role: 'Service Provider' },
      },
      {
        path: 'provider/manage-rooms',
        name: 'provider.manageRooms',
        component: ManageRooms,
        meta: { role: 'Service Provider' },
      },
      {
        path: 'provider/my-rooms',
        name: 'provider.myRooms',
        component: MyRoomsView,
        meta: { role: 'Service Provider' },
      },{
  path: 'provider/edit-room/:id',
  name: 'provider.editRoom',
  component: () => import('@/view/Provider/EditRoom.vue'),
  meta: { role: 'Service Provider' },
},

      {
        path: 'provider/booking-requests',
        name: 'provider.bookingRequests',
        component: BookingRequests,
        meta: { role: 'Service Provider' },
      },
      {
        path: 'provider/rent-management',
        name: 'provider.rentManagement',
        component: RentManagementView,
        meta: { role: 'Service Provider' },
      },

      // ── Admin ──
      {
        path: 'admin/dashboard',
        name: 'admin.dashboard',
        component: AdminDashboard,
        meta: { role: 'System Admin' },
      },
        {
        path: 'admin/profile',
        name: 'admin.profile',
        component: () => import('@/view/ProfileInfo.vue'),
        meta: { role: 'System Admin' },
      },
      {
        path: 'admin/manage',
        name: 'admin.manageUser',
        component: UserMangement,
        meta: { role: 'System Admin' },
      },
      {
        path: 'admin/locations',
        name: 'admin.locations',
        component: DistrictManagement,
        meta: { role: 'System Admin' },
      },
      {
        path: 'admin/room-options',
        name: 'admin.roomOptions',
        component: RoomOptionManagement,
        meta: { role: 'System Admin' },
      },
    ],
  },

  // default redirect
  {
    path: '/',
    redirect: '/login',
  },

  // catch all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

// ─── ROUTER ─────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ─── NAVIGATION GUARD (FIXED) ───────────
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // restore auth safely
  auth.checkAuth()

  const isLoggedIn = auth.isLoggedIn
  const roles = auth.user?.roles?.map(r => r.name) || []

  console.log('USER ROLES:', roles)

  // 🔓 Guest only pages (login)
  if (to.meta.guestOnly && isLoggedIn) {
    if (roles.includes('System Admin')) {
      return next('/admin/dashboard')
    }
    if (roles.includes('Service Provider')) {
      return next('/provider/dashboard')
    }
  }

  // 🔐 Require login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // 🛡️ Role protection
  if (to.meta.role && !roles.includes(to.meta.role)) {
    console.log('Blocked:', roles, 'vs', to.meta.role)

    // redirect based on role priority
    if (roles.includes('System Admin')) {
      return next('/admin/dashboard')
    }
    if (roles.includes('Service Provider')) {
      return next('/provider/dashboard')
    }

    return next('/login')
  }

  next()
})

export default router
