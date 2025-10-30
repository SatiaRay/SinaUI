const PYTHON_APP_URL = process.env.REACT_APP_PYTHON_APP_API_HOST;
const protocol = process.env.REACT_APP_FORCE_WEBSOCKET_PROTOCOL ?? 'wss';

export const sockets = {
  voice: (handleTranscribe) => {
    // Create a new WebSocket connection
    const socket = new WebSocket(`${protocol}://${PYTHON_APP_URL}/ws/voice`);

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
