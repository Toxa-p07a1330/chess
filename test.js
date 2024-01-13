import WebSocket from 'ws';

// Replace 'ws://localhost:3000' with the actual WebSocket server URL
const socket = new WebSocket('ws://localhost:3001/test_game');

socket.on('open', () => {
    console.log('Connected to the server');

    // Send a test message
    const message = {
        type: 'move',
        payload: 'e2e4', // Replace with an actual chess move
    };

    socket.send(JSON.stringify(message));
});

socket.on('message', (data) => {
    console.log('Received message:', data);

    // You can handle the received messages here
});

socket.on('close', () => {
    console.log('Connection closed');
});

socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});