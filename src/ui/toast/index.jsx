// utils/notify.js
import { toast } from 'react-toastify';

export const notify = {
  success: (message) =>
    toast(
      <div className=" w-full  flex items-center gap-3 backdrop-blur-md bg-green-500/90 text-white px-4 py-3 rounded-xl shadow-lg border border-green-300/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 flex-shrink-0 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    ),

  error: (message) =>
    toast(
      <div className="flex items-center gap-3 backdrop-blur-md bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-lg border border-red-300/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 flex-shrink-0 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    ),
};
