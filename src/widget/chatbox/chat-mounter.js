import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './components/chatbox';
import '../../index.css';
import '../../../public/css/style.css';
import './chatbox.css';
import 'react-toastify/dist/ReactToastify.css';
import 'typeface-vazir';

function initChatWidget(scriptEl) {
  const container = document.createElement('div');
  scriptEl.insertAdjacentElement('afterend', container);

  // Convert data-* attributes to props
  const props = Object.fromEntries(
    Array.from(scriptEl.attributes)
      .filter(
        (attr) => attr.name.startsWith('data-') && attr.name !== 'data-widget'
      )
      .map((attr) => [
        attr.name
          .replace(/^data-/, '')
          .replace(/-([a-z])/g, (_, c) => c.toUpperCase()), // kebab → camelCase
        attr.value === '' ? true : attr.value, // handle boolean flags
      ])
  );

  const root = ReactDOM.createRoot(container);
  root.render(<ChatBox {...props} className="font-sans" />);
}

// Auto-init all widgets
document.querySelectorAll("script[data-widget='chat']").forEach(initChatWidget);
