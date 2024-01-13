import {WebSocket, WebSocketServer} from "ws";
import {ChessGame} from "./main.js";

export class ChessService {
    constructor() {
        this.games = new Map(); // Map to store chess games by name
        this.wss = new WebSocketServer({noServer: true});

        // Handle incoming WebSocket connections
        this.wss.on('connection', (ws, request) => {
            const gameName = request.url.replace('/', ''); // Extract game name from the URL
            const chessGame = this.getOrCreateGame(gameName);

            // Handle messages from clients
            ws.on('message', (message) => {
                this.handleMessage(chessGame, ws, message, gameName);
            });

            // Handle disconnection
            ws.on('close', () => {
                this.handleDisconnect(chessGame, ws);
            });
        });
    }

    // Create a new chess game or return an existing one by name
    getOrCreateGame(gameName) {
        if (!this.games.has(gameName)) {
            const newGame = new ChessGame();
            this.games.set(gameName, newGame);
        }
        return this.games.get(gameName);
    }

    // Handle incoming messages from clients
    handleMessage(chessGame, ws, message, gameName) {
        // Implement logic to handle chess moves and other messages
        // You can use the chessGame instance to make moves and check game status

        // For example, if the message is a chess move in algebraic notation:
        // chessGame.makeMove(message);

        // After handling the message, you might want to broadcast the updated game state to all clients

        const stringValue = message.toString();
        const moveObject = JSON.parse(stringValue)
        if (moveObject.type === "move"){
            chessGame.makeMove(moveObject.payload)
        }
        this.broadcastGameState(chessGame, gameName);
    }


    // Handle disconnection of clients
    handleDisconnect(chessGame, ws) {
        // Implement logic to handle client disconnection
        // For example, remove the disconnected player from the game

        // After handling the disconnection, you might want to broadcast the updated game state to all remaining clients
        this.broadcastGameState(chessGame);
    }

    // Broadcast the current game state to all clients
    broadcastGameState(chessGame, gameName) {
        const gameState = chessGame.getWebState(); // Implement this method in your ChessGame class to get the current game state
        gameState.name = gameName
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(gameState));
            }
        });
    }

    // Start the WebSocket server
    startServer(server) {
        server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, (ws) => {
                this.wss.emit('connection', ws, request);
            });
        });
    }
}

