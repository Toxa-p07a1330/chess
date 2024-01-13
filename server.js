import {ChessService} from "./ChessService.js";
import * as http from "http";
import express from "express"

const app = express();
const server = http.createServer(app);
const chessService = new ChessService();

// Start the WebSocket server
chessService.startServer(server);

// Add other routes or middleware as needed

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
