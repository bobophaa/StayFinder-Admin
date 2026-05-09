import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import MainLayout from '@/components/layout/MainLayout.vue'

import Adminlogin from '@/view/Adminlogin.vue'

import ProviderDashboard from '@/view/Provider/ProviderDashboard.vue'
import AddRoom from '@/view/Provider/AddRoom.vue'
import ManageRooms from '@/view/Provider/ManageRooms.vue'
import MyRoomsView from '@/view/Provider/MyRoomsView.vue'
import BookingRequests from '@/view/Provider/BookingRequests.vue'
import RentManagementView from '@/view/Provider/RentManagementView.vue'

import AdminDashboard from '@/view/Admin/AdminDashboard.vue'
import DistrictManagement from '@/view/Admin/DistrictManagement.vue'
import RoomOptionManagement from '@/view/Admin/RoomOptionManagement.vue'
import UserMangement from '@/view/Admin/UserMangement.vue'
import Providerprofile from '@/view/Provider/Providerprofile.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    name: 'login',
    component: Adminlogin,
    meta: { title: 'Login', guestOnly: true },
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
        meta: { title: 'My Profile', role: 'Service Provider' },
      },

      // ── Provider ──
      {
        path: 'provider/dashboard',
        name: 'provider.dashboard',
        component: ProviderDashboard,
        meta: { title: 'Provider Dashboard', role: 'Service Provider' },
      },
      {
        path: 'provider/profile',
        name: 'provider.profile',
        component: Providerprofile,
        meta: { title: 'Provider Profile', role: 'Service Provider' },
      },
      {
        path: 'provider/add-room',
        name: 'provider.addRoom',
        component: AddRoom,
        meta: { title: 'Add Room', role: 'Service Provider' },
      },
      {
        path: 'provider/manage-rooms',
        name: 'provider.manageRooms',
        component: ManageRooms,
        meta: { title: 'Manage Rooms', role: 'Service Provider' },
      },
      {
        path: 'provider/my-rooms',
        name: 'provider.myRooms',
        component: MyRoomsView,
        meta: { title: 'My Rooms', role: 'Service Provider' },
      },
      {
        path: 'provider/edit-room/:id',
        name: 'provider.editRoom',
        component: () => import('@/view/Provider/EditRoom.vue'),
        meta: { title: 'Edit Room', role: 'Service Provider' },
      },
      {
        path: 'provider/booking-requests',
        name: 'provider.bookingRequests',
        component: BookingRequests,
        meta: { title: 'Booking Requests', role: 'Service Provider' },
      },
      {
        path: 'provider/rent-management',
        name: 'provider.rentManagement',
        component: RentManagementView,
        meta: { title: 'Rent Management', role: 'Service Provider' },
      },

      // ── Admin ──
      {
        path: 'admin/dashboard',
        name: 'admin.dashboard',
        component: AdminDashboard,
        meta: { title: 'Admin Dashboard', role: 'System Admin' },
      },
      {
        path: 'admin/profile',
        name: 'admin.profile',
        component: () => import('@/view/ProfileInfo.vue'),
        meta: { title: 'Admin Profile', role: 'System Admin' },
      },
      {
        path: 'admin/manage',
        name: 'admin.manageUser',
        component: UserMangement,
        meta: { title: 'User Management', role: 'System Admin' },
      },
      {
        path: 'admin/locations',
        name: 'admin.locations',
        component: DistrictManagement,
        meta: { title: 'District Management', role: 'System Admin' },
      },
      {
        path: 'admin/room-options',
        name: 'admin.roomOptions',
        component: RoomOptionManagement,
        meta: { title: 'Room Options', role: 'System Admin' },
      },
    ],
  },

  
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Room Rental` : 'Room Rental'

  const auth = useAuthStore()
  auth.checkAuth()

  const isLoggedIn = auth.isLoggedIn
  const roles = auth.user?.roles?.map(r => r.name) || []

  console.log('USER ROLES:', roles)

  if (to.meta.guestOnly && isLoggedIn) {
    if (roles.includes('System Admin')) return next('/admin/dashboard')
    if (roles.includes('Service Provider')) return next('/provider/dashboard')
  }

 
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  if (to.meta.role && !roles.includes(to.meta.role)) {
    console.log('Blocked:', roles, 'vs', to.meta.role)
    if (roles.includes('System Admin')) return next('/admin/dashboard')
    if (roles.includes('Service Provider')) return next('/provider/dashboard')
    return next('/login')
  }

  next()
})

export default router