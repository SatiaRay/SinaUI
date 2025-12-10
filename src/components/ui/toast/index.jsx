import Swal from "sweetalert2";

/**
 * Global toast instance
 */
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 2000,
  timerProgressBar: true,
  showConfirmButton: false,
  showCloseButton: false,
  customClass: {
    popup:
      "rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3",
    title: "text-sm font-semibold",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const notify = {
  success: (message) =>
    Toast.fire({
      icon: "success",
      title: message,
    }),

  error: (message) =>
    Toast.fire({
      icon: "error",
      title: message,
    }),

  info: (message) =>
    Toast.fire({
      icon: "info",
      title: message,
    }),

  warning: (message) =>
    Toast.fire({
      icon: "warning",
      title: message,
    }),
};
