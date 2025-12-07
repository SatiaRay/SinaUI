export const getWebSocketUrl = (path) => {
  const url = new URL(process.env.REACT_APP_AI_SERVICE);

  // Check for forced protocol first
  const forcedProtocol = process.env.REACT_APP_FORCE_WEBSOCKET_PROTOCOL;
  const protocol = forcedProtocol
    ? `${forcedProtocol}:`
    : window.location.protocol === 'https:'
      ? 'wss:'
      : 'ws:';
  return `${protocol}//${url.hostname}:${url.port}${path}`;
};
