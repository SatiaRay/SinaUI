import React from 'react';
import { createRoot } from 'react-dom/client';
import 'typeface-vazir';
import '@contexts/axios'; // Import axios configuration
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import ChatBoxPreview from '@pages/widget/chat-box-perview';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChatBoxPreview />
  </React.StrictMode>
);

reportWebVitals();
