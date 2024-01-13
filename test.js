import WebSocket from 'ws';
import * as readlineSync from "readline-sync";
import * as readline from "readline";

const gameName = readlineSync.question("Enter game name: ")
const TIMEOUT = 100;
const socket = new WebSocket('ws://localhost:3001/' + gameName);

let isGameContinuing = true;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


socket.on('open', async () => {
    console.log('Connected to the server. Print stop for exit');

    rl.on('line', (line) => {
        //  Send a move message
        const message = {
            type: 'move',
            payload: line,
        };

        socket.send(JSON.stringify(message));
    });


});

socket.on('message', (data) => {
    console.log('Received message',);
    printReadableGame(data)
});

const printReadableGame = (data) => {
    const dataParsed = JSON.parse(data.toString())
    console.log(`========${dataParsed.name}========`)
    for (let i = 7; i >= 0; i--) {
        const row = dataParsed.board[i].map(piece => (piece ? piece : '.'));
        console.log(row.join('\t'));
    }
    console.log("-----")
    console.log("Next move: ", dataParsed.currentPlayer)
    if (dataParsed.isCheck) {
        console.log("Checked")
    }
    if (dataParsed.isFinished) {
        console.log("Checkmated");
        isGameContinuing = false;
    }
    console.log("================")


}

socket.on('close', () => {
    console.log('Connection closed');
});

socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});