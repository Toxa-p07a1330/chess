class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
    }

    initializeBoard() {
        const board = [];
        for (let i = 0; i < 8; i++) {
            const row = [];
            for (let j = 0; j < 8; j++) {
                row.push(null);
            }
            board.push(row);
        }

        // Set up pieces for the initial position (you can extend this logic)
        board[0][0] = 'wr'; // white rook
        board[0][1] = 'wn'; // white knight
        board[0][2] = 'wb'; // white bishop
        board[0][3] = 'wq'; // white queen
        board[0][4] = 'wk'; // white king
        board[0][5] = 'wb'; // white bishop
        board[0][6] = 'wn'; // white knight
        board[0][7] = 'wr'; // white rook

        board[7][0] = 'br'; // black rook
        board[7][1] = 'bn'; // black knight
        board[7][2] = 'bb'; // black bishop
        board[7][3] = 'bq'; // black queen
        board[7][4] = 'bk'; // black king
        board[7][5] = 'bb'; // black bishop
        board[7][6] = 'bn'; // black knight
        board[7][7] = 'br'; // black rook

        for (let i = 0; i < 8; i++) {
            board[1][i] = 'wp'; // white pawns
            board[6][i] = 'bp'; // black pawns
        }

        return board;
    }

    isValidMove(startRow, startCol, endRow, endCol, checkOpponent = false) {
        // Check if the destination is within bounds
        if (
            startRow < 0 ||
            startRow > 7 ||
            startCol < 0 ||
            startCol > 7 ||
            endRow < 0 ||
            endRow > 7 ||
            endCol < 0 ||
            endCol > 7
        ) {
            return false; // Out of bounds
        }

        const startPiece = this.board[startRow][startCol];

        // Check if the starting cell is empty
        if (!startPiece) {
            return false; // Empty cell
        }

        // Check if the piece in the starting cell has the correct color
        if (checkOpponent && startPiece.charAt(0) === this.currentPlayer.charAt(0)) {
            return false; // Wrong-colored piece
        }

        // Check specific rules for the type of piece
        switch (startPiece.charAt(1)) {
            case 'p':
                return this.isValidPawnMove(startRow, startCol, endRow, endCol);
            case 'r':
                return this.isValidRookMove(startRow, startCol, endRow, endCol);
            case 'n':
                return this.isValidKnightMove(startRow, startCol, endRow, endCol);
            case 'b':
                return this.isValidBishopMove(startRow, startCol, endRow, endCol);
            case 'q':
                return this.isValidQueenMove(startRow, startCol, endRow, endCol);
            case 'k':
                return this.isValidKingMove(startRow, startCol, endRow, endCol);
            default:
                console.log("Invalid piece type");
                return false;
        }
        return true
    }

    // Methods for checking specific piece moves
    isValidPawnMove(startRow, startCol, endRow, endCol) {
        const direction = this.currentPlayer === 'white' ? 1 : -1;
        const isValidForwardMove = startCol === endCol && this.board[endRow][endCol] === null;
        const isValidAttackMove =
            Math.abs(startCol - endCol) === 1 &&
            endRow - startRow === direction &&
            this.board[endRow][endCol] !== null &&
            this.board[endRow][endCol].charAt(0) !== this.currentPlayer.charAt(0); // Attack only opponent's pieces

        if (isValidForwardMove || isValidAttackMove) {
            // Check for obstacles in the path (if any)
            for (let i = startRow + direction; i !== endRow; i += direction) {
                if (this.board[i][endCol] !== null) {
                    console.log("Move is blocked by another piece");
                    return false;
                }
            }
            return true;
        }

        console.log("Invalid move for pawn");
        return false;
    }


    isValidKnightMove(startRow, startCol, endRow, endCol) {
        // Simplified knight move logic (no obstacles to check)
        return (Math.abs(startRow - endRow) === 2 && Math.abs(startCol - endCol) === 1) ||
            (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 2);
    }

    isValidRookMove(startRow, startCol, endRow, endCol, fromQueenCheck = false) {
        // Rook move logic
        if (startRow === endRow) {
            // Horizontal move
            const step = startCol < endCol ? 1 : -1;
            for (let i = startCol + step; i !== endCol; i += step) {
                if (this.board[startRow][i] !== null) {
                    if (!fromQueenCheck) {
                        console.log("Move is blocked by another piece");
                    }
                    return false;
                }
            }
            return true;
        } else if (startCol === endCol) {
            // Vertical move
            const step = startRow < endRow ? 1 : -1;
            for (let i = startRow + step; i !== endRow; i += step) {
                if (this.board[i][startCol] !== null) {
                    if (!fromQueenCheck) {
                        console.log("Move is blocked by another piece");
                    }
                    return false;
                }
            }
            return true;
        }

        if (!fromQueenCheck) {
            console.log("Invalid move for rook");
        }
        return false;
    }

    isValidBishopMove(startRow, startCol, endRow, endCol, fromQueenCheck = false) {
        // Bishop move logic
        if (Math.abs(startRow - endRow) === Math.abs(startCol - endCol)) {
            const rowStep = startRow < endRow ? 1 : -1;
            const colStep = startCol < endCol ? 1 : -1;
            for (let i = 1; i < Math.abs(startRow - endRow); i++) {
                if (this.board[startRow + i * rowStep][startCol + i * colStep] !== null) {
                    if (!fromQueenCheck) {
                        console.log("Move is blocked by another piece");
                    }
                    return false;
                }
            }
            return true;
        }

        if (!fromQueenCheck) {
            console.log("Invalid move for bishop");
        }
        return false;
    }


    isValidQueenMove(startRow, startCol, endRow, endCol) {
        return this.isValidRookMove(startRow, startCol, endRow, endCol, true) ||
            this.isValidBishopMove(startRow, startCol, endRow, endCol, true);
    }

    isValidKingMove(startRow, startCol, endRow, endCol) {
        // Simplified king move logic (no obstacles to check)
        return Math.abs(startRow - endRow) <= 1 && Math.abs(startCol - endCol) <= 1;
    }


    algebraicToIndices(algebraicNotation) {
        const colMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
        const startCol = colMap[algebraicNotation[0]];
        const startRow = parseInt(algebraicNotation[1], 10)-1;
        const endCol = colMap[algebraicNotation[2]];
        const endRow = parseInt(algebraicNotation[3], 10)-1;
        return { startRow, startCol, endRow, endCol };
    }

    makeMove(algebraicNotation) {
        const { startRow, startCol, endRow, endCol } = this.algebraicToIndices(algebraicNotation);
        if (this.isValidMove(startRow, startCol, endRow, endCol)) {

            // Perform the move
            this.board[endRow][endCol] = this.board[startRow][startCol];
            this.board[startRow][startCol] = null;

            // Switch the current player
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

            // Log the updated board
            this.printBoard();
        } else {
            console.log('Invalid move');
        }
    }


    isCheckmate() {
        // Find the king's position
        let kingRow, kingCol;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece === this.currentPlayer.charAt(0) + 'k') {
                    kingRow = i;
                    kingCol = j;
                    break;
                }
            }
        }

        // Check if the king is in check
        if (this.isInCheck()) {
            // Check if there are any legal moves for any piece that removes the check
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    const piece = this.board[i][j];
                    if (piece && piece.charAt(0) === this.currentPlayer.charAt(0)) {
                        for (let row = 0; row < 8; row++) {
                            for (let col = 0; col < 8; col++) {
                                if (this.isValidMove(i, j, row, col, true) && !this.isInCheckAfterMove(i, j, row, col)) {
                                    console.log(`${this.currentPlayer} is not in checkmate.`);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

            // If no legal moves are found, the king is in checkmate
            console.log(`Checkmate! ${this.currentPlayer} is checkmated.`);
            return true;
        }

        // If the king is not in check, checkmate does not apply
        console.log(`${this.currentPlayer} is not in check.`);
        return false;
    }

    isInCheckAfterMove(startRow, startCol, endRow, endCol) {
        // Temporarily make the move to check if the king is still in check
        const originalPiece = this.board[endRow][endCol];
        this.board[endRow][endCol] = this.board[startRow][startCol];
        this.board[startRow][startCol] = null;

        // Check if the king is still in check after the move
        const isInCheck = this.isInCheck();

        // Undo the move
        this.board[startRow][startCol] = this.board[endRow][endCol];
        this.board[endRow][endCol] = originalPiece;

        return isInCheck;
    }

    isInCheck() {
        // Find the king's position
        let kingRow, kingCol;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece === this.currentPlayer.charAt(0) + 'k') {
                    kingRow = i;
                    kingCol = j;
                    break;
                }
            }
        }


        // Check if the king is under threat from any opponent's piece
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece.charAt(0) !== this.currentPlayer.charAt(0)) {
                    if (this.isValidMove(i, j, kingRow, kingCol, true)) {
                        console.log(`${this.currentPlayer}'s king is in check!`);
                        return true;
                    }
                }
            }
        }

        return false;
    }



    printBoard() {
        console.log('Current Chess Board:');
        console.log("================")
        for (let i = 7; i >= 0; i--) {
            const row = this.board[i].map(piece => (piece ? piece : '.'));
            console.log(row.join('\t'));
        }
        console.log("================")
    }
}

// Example usage:
const chessGame = new ChessGame();
chessGame.makeMove("g2g4"); // Example move
chessGame.makeMove("e7e5"); // Example move
chessGame.makeMove("f2f3"); // Example move
chessGame.makeMove("d8h4"); // Example move
chessGame.printBoard()
chessGame.isCheckmate();
