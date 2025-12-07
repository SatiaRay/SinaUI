import { getWebSocketUrl } from './websocket';

export const sockets = {
  voice: (handleTranscribe) => {
    // Create a new WebSocket connection
    const socket = new WebSocket(getWebSocketUrl('/ws/voice'));

    // Handle the open event
    socket.onopen = () => {
      console.log('Voice socket : WebSocket connection established');
    };

    // Handle errors
    socket.onerror = (error) => {
      console.error('Voice socket : WebSocket error:', error);
    };

    // Handle the close event
    socket.onclose = () => {
      console.log('Voice socket : WebSocket connection closed');
    };

    socket.onmessage = handleTranscribe;

    return socket;
  },
};
