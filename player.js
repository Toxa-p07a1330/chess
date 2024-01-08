import {ChessGame} from "./main.js";

class AIPlayer {
    constructor(chessGame) {
        this.chessGame = chessGame;
    }


    makeMove(getMode) {
        const possibleMoves = this.generatePossibleMoves();
        // Initialize with a very low score
        let bestScore = -Infinity;
        let bestMove = null;

        for (const move of possibleMoves) {
            // Perform the move on a temporary board
            const tempChessGame = this.cloneChessGame();
            tempChessGame.makeMove(move);

            // Calculate the score for the move
            const score = this.calculateScore(tempChessGame);
            let scoreValue = 0;
            if (this.chessGame.currentPlayer === "white"){
                scoreValue = score.whiteScore - score.blackScore
            }
            else{
                scoreValue = score.blackScore - score.whiteScore
            }
            // Update the best move if the current move has a higher score
            if (scoreValue > bestScore) {
                bestScore = scoreValue;
                bestMove = move;
            }
        }


        if (getMode){
            return bestMove
        }
        else {
            this.chessGame.makeMove(bestMove);
        }
    }


    cloneChessGame() {
        // Create a deep clone of the chess game instance
        const clonedChessGame = new ChessGame();

        // Copy the current board state
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                clonedChessGame.board[i][j] = this.chessGame.board[i][j];
            }
        }

        // Copy other relevant state (currentPlayer, outputEnabled, etc.)
        clonedChessGame.currentPlayer = this.chessGame.currentPlayer;
        clonedChessGame.outputEnabled = this.chessGame.outputEnabled;
        clonedChessGame.printBoard = ()=>{}

        // Add other state variables as needed

        return clonedChessGame;
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

    calculateScore(tempChessGame) {
        const chessGame = tempChessGame || this.chessGame
        const pieceValues = {
            'p': 1,
            'n': 3.5,
            'b': 3,
            'r': 9,
            'q': 9,
            'k': 100,
        };

        let whiteScore = 0;
        let blackScore = 0;

        // Loop through the board to calculate scores
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = chessGame.board[i][j];
                if (piece) {
                    const pieceType = piece.charAt(1);
                    const pieceColor = piece.charAt(0);

                    // Calculate base score
                    let pieceScore = pieceValues[pieceType];

                    // Check if the piece is protected
                    const isProtected = this.isSquareProtected(i, j, pieceColor, chessGame);
                    if (isProtected) {
                        pieceScore *= 1.2; // Increase value by 20%
                    }

                    // Check if the piece is attacked
                    const isAttacked = this.isSquareAttacked(i, j, pieceColor, chessGame);
                    if (isAttacked) {
                        pieceScore *= 0.65; // Decrease value by 35%
                    }

                    // Add piece score to the respective color
                    if (pieceColor === 'w') {
                        whiteScore += pieceScore;
                    } else {
                        blackScore += pieceScore;
                    }
                }
            }
        }

        // Add scores for checks
        const whiteChecks = this.getChecks('white');
        const blackChecks = this.getChecks('black');

        whiteScore += whiteChecks * 0.25;
        blackScore -= blackChecks * 0.25;

        return { whiteScore, blackScore };
    }

    isSquareProtected(row, col, color, chessGame) {
        // Check if the square is protected by any piece of the same color
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = chessGame.board[i][j];
                if (piece && piece.charAt(0) === color && chessGame.isValidMove(i, j, row, col, false)) {
                    return true;
                }
            }
        }
        return false;
    }

    isSquareAttacked(row, col, color, chessGame) {
        // Check if the square is attacked by any piece of the opposite color
        const opponentColor = color === 'w' ? 'b' : 'w';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = chessGame.board[i][j];
                if (piece && piece.charAt(0) === opponentColor && chessGame.isValidMove(i, j, row, col, true)) {
                    return true;
                }
            }
        }
        return false;
    }

    getChecks(color) {
        // Check if the king of the specified color is in check
        this.outputEnabled = false; // Disable output for isInCheck
        const isInCheck = this.chessGame.isInCheck();
        this.outputEnabled = true; // Enable output back

        return color === 'white' ? (isInCheck ? 1 : 0) : (isInCheck ? -1 : 0);
    }

}

// Example usage:
const chessGame = new ChessGame();
const aiPlayer = new AIPlayer(chessGame);
// Make a move using the AIPlayer
const stepsAmount = 1;
for (let i = 0; i < stepsAmount; i++) {
    aiPlayer.makeMove();
}