export class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.outputEnabled = true; // Flag to control output for invalid moves
        this.status = "";
        this.whiteKingMoved = false;
        this.blackKingMoved = false;
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
        const endPiece = endRow !== undefined && endCol !== undefined && this.board[endRow][endCol];


        // Check if the starting cell is empty
        if (!startPiece) {
            return false; // Empty cell
        }

        if (endPiece === undefined || endRow === undefined || endCol === undefined)
            return false

        // Check if the piece in the starting cell has the correct color
        if (checkOpponent && startPiece.charAt(0) === this.currentPlayer.charAt(0)) {
            return false; // Wrong-colored piece
        }


        if (checkOpponent && endPiece && (endPiece.charAt(0) !== this.currentPlayer.charAt(0))) {
            return false; // Self taking
        }

        if (!checkOpponent && endPiece && (endPiece.charAt(0) === this.currentPlayer.charAt(0))) {
            return false; // Self taking
        }

        // Check if the move is valid according to the piece's rules
        switch (startPiece.charAt(1)) {
            case 'p':
                if (!this.isValidPawnMove(startRow, startCol, endRow, endCol, checkOpponent)) {
                    return false;
                }
                break;
            case 'r':
                if (!this.isValidRookMove(startRow, startCol, endRow, endCol, true)) {
                    return false;
                }
                break;
            case 'n':
                if (!this.isValidKnightMove(startRow, startCol, endRow, endCol)) {
                    return false;
                }
                break;
            case 'b':
                if (!this.isValidBishopMove(startRow, startCol, endRow, endCol, true)) {
                    return false;
                }
                break;
            case 'q':
                if (!this.isValidQueenMove(startRow, startCol, endRow, endCol)) {
                    return false;
                }
                break;
            case 'k':
                if (!this.isValidKingMove(startRow, startCol, endRow, endCol)) {
                    return false;
                }
                break;
            default:
                //    if (this.outputEnabled)
                console.log("Invalid piece type");
                return false;
        }

        // Temporarily make the move to check if the king is still in check
        const originalPiece = this.board[endRow][endCol];
        this.board[endRow][endCol] = this.board[startRow][startCol];
        this.board[startRow][startCol] = null;

        // Check if the king is still in check after the move
        const isInCheck = this.isInCheck();

        // Undo the move
        this.board[startRow][startCol] = this.board[endRow][endCol];
        this.board[endRow][endCol] = originalPiece;

        return !isInCheck;
    }


    isSquareUnderAttack(row, col, board) {
        // Check if the square is under attack by the opponent
        const opponentColor = this.currentPlayer === 'white' ? 'black' : 'white';
        const resultBoard = board || this.board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = resultBoard[i][j];
                if (piece && piece.charAt(0) === opponentColor.charAt(0)) {
                    if (this.isValidMove(i, j, row, col, true)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }


    // Methods for checking specific piece moves
    isValidPawnMove(startRow, startCol, endRow, endCol, checkOpponent) {

        let direction = this.currentPlayer === 'white' ? 1 : -1;
        if (checkOpponent) direction = direction * -1;
        const colorDiff = checkOpponent ? (this.board[endRow][endCol]?.charAt(0) === this.currentPlayer.charAt(0)
        ) : (this.board[endRow][endCol]?.charAt(0) !== this.currentPlayer.charAt(0)
        )
        const isValidForwardMove = startCol === endCol && this.board[endRow][endCol] === null;
        const isValidAttackMove =
            Math.abs(startCol - endCol) === 1 &&
            endRow - startRow === direction &&
            this.board[endRow][endCol] !== null &&
            colorDiff


        if (startRow === 3 && endRow === 4 && this.board[endRow][endCol] === "bk" && startCol === 5 && endCol === 4) {
            console.log("black king eaten")
            console.log("check", checkOpponent)
        }

        if (Math.abs(endRow - startRow) > 2)
            return false

        if (isValidForwardMove || isValidAttackMove) {
            // Check for obstacles in the path (if any)
            for (let i = startRow + direction; i !== endRow; i += direction) {
                try {
                    if (this.board[i][endCol] !== null) {
                        if (this.outputEnabled)
                            console.log("Move is blocked by another piece");
                        return false;
                    }
                } catch (e) {
                    return false
                }
            }
            return true;
        }

        if (this.outputEnabled)
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
                        if (this.outputEnabled)
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
                        if (this.outputEnabled)
                            console.log("Move is blocked by another piece");
                    }
                    return false;
                }
            }
            return true;
        }

        if (!fromQueenCheck) {
            if (this.outputEnabled)
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
                        if (this.outputEnabled)
                            console.log("Move is blocked by another piece");
                    }
                    return false;
                }
            }
            return true;
        }

        if (!fromQueenCheck) {
            if (this.outputEnabled)
                console.log("Invalid move for bishop");
        }
        return false;
    }


    isValidQueenMove(startRow, startCol, endRow, endCol) {
        return this.isValidRookMove(startRow, startCol, endRow, endCol, true) ||
            this.isValidBishopMove(startRow, startCol, endRow, endCol, true);
    }

    isValidKingMove(startRow, startCol, endRow, endCol) {


        const oldDestination = this.board[endRow][endCol]
        this.board[endRow][endCol] = this.board[startRow][startCol]
        this.board[startRow][startCol] = null

        if (startRow === 5 && endRow === 4 && this.board[endRow][endCol] === "bk" && startCol === 4 && endCol === 4) {
            console.log("black king_________________________")
            console.log(this.isSquareUnderAttack(endRow, endCol))
        }

        if (this.isSquareUnderAttack(endRow, endCol)) {
            this.board[startRow][startCol] = this.board[endRow][endCol]
            this.board[endRow][endCol] = oldDestination
            return false
        }
        this.board[startRow][startCol] = this.board[endRow][endCol]
        this.board[endRow][endCol] = oldDestination
        return Math.abs(startRow - endRow) <= 1 && Math.abs(startCol - endCol) <= 1;
    }


    algebraicToIndices(algebraicNotation) {
        if (!algebraicNotation) {
            return {startRow: 0, startCol: 0, endRow: 0, endCol: 0};
        }
        const colMap = {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7};
        const startCol = colMap[algebraicNotation[0]];
        const startRow = parseInt(algebraicNotation[1], 10) - 1;
        const endCol = colMap[algebraicNotation[2]];
        const endRow = parseInt(algebraicNotation[3], 10) - 1;
        return {startRow, startCol, endRow, endCol};
    }

    cloneChessGame() {
        const clonedGame = new ChessGame();
        clonedGame.board = this.deepCloneBoard(this.board);
        clonedGame.currentPlayer = this.currentPlayer;
        clonedGame.outputEnabled = this.outputEnabled;
        clonedGame.status = this.status;
        clonedGame.whiteKingMoved = this.whiteKingMoved;
        clonedGame.blackKingMoved = this.blackKingMoved;
        clonedGame.printBoard = () => {
        }

        return clonedGame;
    }

    deepCloneBoard(board) {
        // Helper function to deep clone the chess board
        const clonedBoard = [];
        for (let i = 0; i < board.length; i++) {
            const row = [];
            for (let j = 0; j < board[i].length; j++) {
                row.push(board[i][j]);
            }
            clonedBoard.push(row);
        }
        return clonedBoard;
    }

    makeMove(algebraicNotation) {

        if (algebraicNotation === 'O-O') {
            // Short castling for the current player
            this.performShortCastling();
            return;
        } else if (algebraicNotation === 'O-O-O') {
            // Long castling for the current player
            this.performLongCastling();
            return;
        }

        const {startRow, startCol, endRow, endCol} = this.algebraicToIndices(algebraicNotation);
        this.outputEnabled = true; // Enable output for makeMove
        this.status = ""
        if (this.isValidMove(startRow, startCol, endRow, endCol)) {
            const tempChessGame = this.cloneChessGame();
            tempChessGame.board[endRow][endCol] = tempChessGame.board[startRow][startCol];
            tempChessGame.board[startRow][startCol] = null;
            this.promotePawns(tempChessGame.board)

            // Check if the king is under check after the move
            if (!tempChessGame.isInCheck()) {
                // Update the actual board
                this.board[endRow][endCol] = this.board[startRow][startCol];
                this.board[startRow][startCol] = null;

                // Update king moved status
                if (this.board[endRow][endCol] === "wk") this.whiteKingMoved = true;
                if (this.board[endRow][endCol] === "bk") this.blackKingMoved = true;

                this.promotePawns(this.board)


                // Switch the current player
                this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

                // Log the updated board
                this.printBoard();
            } else {
                // if (this.outputEnabled)
                console.log('Invalid move - King is under check after the move');
            }
        } else {
            // if (this.outputEnabled)
            console.log('Invalid move');
        }
    }

    promotePawns(board) {
        for (let i = 0; i < 8; i++) {
            if (board[7][i] === 'wp') {
                board[7][i] = 'wq'; // Transform pawn to queen
            }
        }

        for (let i = 0; i < 8; i++) {
            if (board[0][i] === 'bp') {
                board[0][i] = 'bq'; // Transform pawn to queen
            }
        }
    }

    performShortCastling() {
        const row = this.currentPlayer === 'white' ? 0 : 7;
        const kingMoved = this.currentPlayer === 'white' ? this.whiteKingMoved : this.blackKingMoved;
        if (
            kingMoved ||
            !this.isRookInPosition(row, 7) ||
            !this.isValidCastlingMove(row, 4, row, 6)
        ) {
            console.log("Short castling is not allowed");
            return;
        }

        // Move the king
        this.board[row][6] = this.board[row][4];
        this.board[row][4] = null;
        // Move the rook
        this.board[row][5] = this.board[row][7];
        this.board[row][7] = null


        if (this.currentPlayer === 'white') {
            this.whiteKingMoved = true;
        } else {
            this.blackKingMoved = true;
        }

        this.switchPlayer();
        this.printBoard();
    }

    performLongCastling() {
        const row = this.currentPlayer === 'white' ? 0 : 7;
        const kingMoved = this.currentPlayer === 'white' ? this.whiteKingMoved : this.blackKingMoved;
        if (
            kingMoved ||
            !this.isRookInPosition(row, 0) ||
            !this.isValidCastlingMove(row, 4, row, 2)
        ) {
            console.log("Long castling is not allowed");
            return;
        }

        // Move the king
        this.board[row][2] = this.board[row][4];
        this.board[row][4] = null;
        // Move the rook
        this.board[row][3] = this.board[row][0];
        this.board[row][0] = null


        if (this.currentPlayer === 'white') {
            this.whiteKingMoved = true;
        } else {
            this.blackKingMoved = true;
        }

        this.switchPlayer();
        this.printBoard();
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }

    isRookInPosition(row, col) {
        const rookColor = this.currentPlayer === 'white' ? 'w' : 'b';
        const rookType = 'r';
        return this.board[row][col] === rookColor + rookType;
    }

    isValidCastlingMove(startRow, startCol, endRow, endCol) {

        const startPiece = this.board[startRow][startCol];

        // Check if the starting cell is empty or has the king
        if (!startPiece || startPiece.charAt(1) !== 'k') {
            console.log("Invalid castling move");
            return false;
        }


        // Check if the king and rook have not moved

        const rookCol = startCol < endCol ? 7 : 0;
        const kingMoved = this.currentPlayer === 'white' ? this.whiteKingMoved : this.blackKingMoved;

        if (kingMoved || !this.isRookInPosition(startRow, rookCol)) {
            console.log("Invalid castling move - king or rook has moved");
            return false;
        }

        // Check if there are no pieces between the king and rook
        const step = startCol < endCol ? 1 : -1;
        for (let i = startCol + step; i !== endCol; i += step) {
            if (this.board[startRow][i] !== null) {
                console.log("Invalid castling move - pieces between king and rook");
                return false;
            }
        }

        // Check if the king is not in check and does not pass through squares under attack
        if (
            this.isInCheck() ||
            this.isSquareUnderAttack(startRow, startCol) ||
            this.isSquareUnderAttack(endRow, endCol)
        ) {
            console.log("Invalid castling move - king is in check or passes through attacked squares");
            return false;
        }

        return true;
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
                                if (this.isValidMove(i, j, row, col, false) && !this.isInCheckAfterMove(i, j, row, col)) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

            // If no legal moves are found, the king is in checkmate
            console.log("Checkmate!")
            return true;
        }

        // If the king is not in check, checkmate does not apply
        //console.log(`${this.currentPlayer} is not in check.`);
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
        this.outputEnabled = false;
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
                        if (!this.status) {
                            // console.log(`${this.currentPlayer}'s king is in check!`);
                            this.status = `${this.currentPlayer}'s king is in check!`
                        }
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

// const chessGame = new ChessGame();
// chessGame.makeMove("e2e4"); // Example move
// chessGame.makeMove("d7d5"); // Example move
// chessGame.makeMove("e4d5"); // Example move
// chessGame.makeMove("c7c5"); // Example move
// chessGame.makeMove("d5d6"); // Example move
// chessGame.makeMove("e7e5"); // Example move
// chessGame.makeMove("d6d7"); // Example move
// chessGame.makeMove("e8e7"); // Example move
// chessGame.makeMove("d7c8"); // Example move
//
//
// chessGame.isCheckmate();



