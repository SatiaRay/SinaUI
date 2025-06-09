import React, { useEffect, useRef } from 'react';

const VoiceStreamer = () => {
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let stream;

    const setupAudio = async () => {
      try {
        // 1. Setup WebSocket
        socketRef.current = new WebSocket('ws://localhost:3000/audio');
        socketRef.current.binaryType = 'arraybuffer'; // we're sending binary audio

        // 2. Wait for WebSocket to be open before proceeding
        socketRef.current.onopen = async () => {
          console.log('WebSocket connected');

          // 3. Get audio stream
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioCtx = new AudioContext();
          audioContextRef.current = audioCtx;

          await audioCtx.audioWorklet.addModule('/processors/VoiceProcessor.js');
          const source = audioCtx.createMediaStreamSource(stream);
          const voiceNode = new AudioWorkletNode(audioCtx, 'voice-processor');
          workletNodeRef.current = voiceNode;

          // 4. Send audio buffers from processor to server
          voiceNode.port.onmessage = (event) => {
            const audioBuffer = event.data;
            if (socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(audioBuffer); // Send raw PCM buffer
            }
          };

          source.connect(voiceNode);
        };

        socketRef.current.onerror = (e) => {
          console.error('WebSocket error:', e);
        };
      } catch (err) {
        console.error('Error setting up voice streamer:', err);
      }
    };

    setupAudio();

    return () => {
      // Cleanup
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return <div>🎙️ Voice Streamer Active</div>;
};

export default VoiceStreamer;
