import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/components/layout/MainLayout.vue'

import AdminDashboard from '@/view/Admin/AdminDashboard.vue'
import DistrictManagement from '@/view/Admin/DistrictManagement.vue'
import RoomOptionManagement from '@/view/Admin/RoomOptionManagement.vue'

import AddRoom from '@/view/Provider/AddRoom.vue'
import BookingRequests from '@/view/Provider/BookingRequests.vue'
import ManageRooms from '@/view/Provider/ManageRooms.vue'
import MyRoomsView from '@/view/Provider/MyRoomsView.vue'
import ProviderDashboard from '@/view/Provider/ProviderDashboard.vue'
import RentManagementView from '@/view/Provider/RentManagementView.vue'

const routes = [
  {
    path: '/',
    redirect: '/provider/dashboard',
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'provider/dashboard',
        name: 'providerDashboard',
        component: ProviderDashboard,
      },
      {
        path: 'provider/add-room',
        name: 'addRoom',
        component: AddRoom,
      },
      {
        path: 'provider/manage-rooms',
        name: 'manageRooms',
        component: ManageRooms,
      },
      {
        path: 'provider/my-rooms',
        name: 'myRooms',
        component: MyRoomsView,
      },
      {
        path: 'provider/booking-requests',
        name: 'bookingRequests',
        component: BookingRequests,
      },
      {
        path: 'provider/rent-management',
        name: 'rentManagement',
        component: RentManagementView,
      },

      // --- Admin Section ---
      {
        path: 'admin/dashboard',
        name: 'adminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'admin/districts',
        name: 'districtManagement',
        component: DistrictManagement,
      },
      {
        path: 'admin/room-options',
        name: 'roomOptionManagement',
        component: RoomOptionManagement,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
