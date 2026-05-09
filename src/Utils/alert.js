import Swal from 'sweetalert2';

// Toast configuration for quick notifications
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

/**
 * Show a success alert
 */
export const alertSuccess = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'ជោគជ័យ!',
    text: message,
    showConfirmButton: false, 
    timer: 1500, 
    timerProgressBar: true
  });
};

/**
 * Show an error alert
 */
export const alertError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'បរាជ័យ!',
    text: message || 'មានបញ្ហាមួយកើតឡើង។ សូមព្យាយាមម្តងទៀត។',
    // confirmButtonColor: '#031c36',
     // Your Navy Theme Color
  });
};

/**
 * Show a confirmation dialog for deletions
 */
export const confirmDelete = async (title = "តើអ្នកប្រាកដទេ?") => {
  const result = await Swal.fire({
    title: title,
    text: "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', // Red for delete
    cancelButtonColor: '#031c36', // Navy for cancel
    confirmButtonText: 'បាទ/ចាស',
    cancelButtonText: 'បោះបង់'
  });
  return result.isConfirmed;
};

/**
 * Show a quick toast notification
 */
export const showToast = (icon, title) => {
  Toast.fire({
    icon: icon, // 'success', 'error', 'warning', 'info'
    title: title
  });
};