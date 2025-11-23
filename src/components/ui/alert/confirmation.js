import Swal from "sweetalert2";

export const confirm = async ({title, text, onConfirm}) => {
  const res = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'بله',
    cancelButtonText: 'خیر',
    customClass: {
      confirmButton: 'swal2-confirm-btn',
      cancelButton: 'swal2-cancel-btn',
    },
    buttonsStyling: false,
  });

  if(res.isConfirmed)
    onConfirm()

  return res.isConfirmed
};