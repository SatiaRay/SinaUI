import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'typeface-vazir';
import App from './App';
import '@contexts/Axios'; // Import axios configuration
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import ViewportHeightFix from '@components/ViewportHeightFix';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ViewportHeightFix />
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={true}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{ zIndex: 9999 }}
      toastStyle={{ zIndex: 9999 }}
    />
  </React.StrictMode>
);

reportWebVitals();
