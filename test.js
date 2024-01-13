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
    console.log('Received message',);
    printReadableGame(data)
});

const printReadableGame = (data) => {
    const dataParsed = JSON.parse(data.toString())
    console.log("================")
    for (let i = 7; i >= 0; i--) {
        const row = dataParsed.board[i].map(piece => (piece ? piece : '.'));
        console.log(row.join('\t'));
    }
    console.log("-----")
    console.log("Next move: ", dataParsed.currentPlayer)
    if (dataParsed.isCheck){
        console.log("Checked")
    }
    if (dataParsed.isFinished){
        console.log("Checkmated")
    }
    console.log("================")


}

socket.on('close', () => {
    console.log('Connection closed');
});

socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});