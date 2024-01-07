import {ChessGame} from "./main.js";

class AIPlayer {
    constructor(chessGame) {
        this.chessGame = chessGame;
    }

    makeMove() {
        // Implement your AI logic to generate a move
        // For simplicity, let's just make a random move for now
        const possibleMoves = this.generatePossibleMoves();
        const randomMove = this.getRandomMove(possibleMoves);
        // Make the chosen move on the chess board
        this.chessGame.makeMove(randomMove);
    }

    generatePossibleMoves() {
        // Implement logic to generate a list of possible moves
        // based on the current state of the chess board
        // You can use the methods provided by the ChessGame class
        // to check valid moves, etc.
        // This can involve more sophisticated AI algorithms based on your needs.
        // For simplicity, you might just consider all legal moves for now.

        const possibleMoves = [];

        // Example: Loop through the board and generate all possible moves
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.chessGame.board[i][j];
                if (piece && piece.charAt(0) === this.chessGame.currentPlayer.charAt(0)) {
                    for (let row = 0; row < 8; row++) {
                        for (let col = 0; col < 8; col++) {
                            if (this.chessGame.isValidMove(i, j, row, col, false)) {
                                possibleMoves.push(this.indicesToAlgebraic({
                                    startRow: i,
                                    startCol: j,
                                    endRow: row,
                                    endCol: col
                                }));
                            }
                        }
                    }
                }
            }
        }

        return possibleMoves;
    }

    getRandomMove(possibleMoves) {
        // Implement logic to randomly choose a move from the list of possible moves
        // For simplicity, let's just pick a random move from the list.

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomIndex];
    }

    indicesToAlgebraic({startRow, startCol, endRow, endCol}) {
        // Implement logic to convert indices to algebraic notation
        // You can use this method to convert the chosen move's indices to algebraic notation.
        // For simplicity, you can adapt the logic from the ChessGame class.

        const colMap = {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h'};
        const startFile = colMap[startCol];
        const startRank = startRow + 1;
        const endFile = colMap[endCol];
        const endRank = endRow + 1;
        // console.log(`${startFile}${startRank}${endFile}${endRank}`)
        return `${startFile}${startRank}${endFile}${endRank}`;
    }
}

// Example usage:
const chessGame = new ChessGame();
const aiPlayer = new AIPlayer(chessGame);
// Make a move using the AIPlayer
const stepsAmount = 100;
for (let i = 0; i < stepsAmount; i++) {
    aiPlayer.makeMove();
}