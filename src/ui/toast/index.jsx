// utils/notify.js

import { toast } from "react-toastify";

export const notify = {
    success: (message) =>
        toast(
            <div className="backdrop-blur-sm bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg border border-green-200/20">
                {message}
            </div>
        ),
    error: (message) =>
        toast(
            <div className="backdrop-blur-sm bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg border border-red-200/20">
                {message}
            </div>
        ),
};
