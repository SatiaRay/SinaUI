import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './components/chatbox';
import '../../index.css';
import '../../../public/css/style.css'
import 'react-toastify/dist/ReactToastify.css';
import 'typeface-vazir';

function initChatWidget(scriptEl) {
  const container = document.createElement('div');
  scriptEl.insertAdjacentElement('afterend', container);

  const props = {};

  const root = ReactDOM.createRoot(container);
  root.render(<ChatBox {...props} className="font-sans"/>);
}

// Find all <script data-widget="chat">
document.querySelectorAll("script[data-widget='chat']").forEach(initChatWidget);
