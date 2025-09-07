import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './components/chatbox';

function initChatWidget(scriptEl) {
  const container = document.createElement('div');
  scriptEl.insertAdjacentElement('afterend', container);

  const props = {};

  const root = ReactDOM.createRoot(container);
  root.render(<ChatBox {...props} />);
}

// Find all <script data-widget="chat">
document.querySelectorAll("script[data-widget='chat']").forEach(initChatWidget);
