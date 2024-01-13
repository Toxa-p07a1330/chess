import React, {useEffect, useState} from 'react';
import styles from "./style.module.scss"

const ChessTestComponent = () => {
    const [gameName, setGameName] = useState('');
    const [inputMove, setInputMove] = useState('');
    const [lastMessage, setLastMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const connectToGame = () => {
        if (gameName.trim() !== '') {
            const newSocket = new WebSocket(`ws://192.168.1.168:3001/${gameName}`);

            newSocket.addEventListener('open', () => {
                console.log('Connected to the server');
                setSocket(newSocket);
            });

            newSocket.addEventListener('message', (event) => {
                const parsedData = JSON.parse(event.data);
                setLastMessage(parsedData);
            });

            newSocket.addEventListener('close', () => {
                console.log('Connection closed');
                setSocket(null);
            });

            newSocket.addEventListener('error', (error) => {
                console.error('WebSocket error:', error);
            });
        }
    };

    const handleGameNameChange = (event) => {
        setGameName(event.target.value);
    };

    const handleMoveChange = (event) => {
        setInputMove(event.target.value);
    };

    const handleSendMove = () => {
        if (socket && inputMove.trim() !== '') {
            const message = {
                type: 'move',
                payload: inputMove.trim(),
            };
            socket.send(JSON.stringify(message));
            setInputMove('');
        }
    };


    useEffect(() => {
        if (lastMessage && !lastMessage?.success) {
            alert("Incorrect")
        }
    }, [lastMessage]);
    const gameToMarkup = (board) => {
        return (
            <div className={styles.container}>
                <h3>Chessboard Representation:</h3>
                <table className={styles.chessboard}>
                    <tbody>
                    {board.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((piece, colIndex) => (
                                <td key={colIndex}
                                    className={`${colIndex % 2 === rowIndex % 2 ? styles.white : styles.black} ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? styles.selected : ''}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex, piece)}
                                >{getChessPiece(piece)}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };


    const pieces = [
        {icon: '♖', litera: 'r'},
        {icon: '♘', litera: 'n'},
        {icon: '♗', litera: 'b'},
        {icon: '♕', litera: 'q'},
        {icon: '♔', litera: 'k'},
        {icon: '♙', litera: 'p'},

    ]
    const getChessPiece = (piece) => {
        if (!piece)
            return null
        const icon = pieces.find(v => v.litera === piece[1]).icon
        if (piece[0] === "w") {
            return <span className={styles.whitePiece}>
                {icon}
            </span>
        }
        return <span className={styles.blackPiece}>
            {icon}
        </span>
    }

    const [selectedPiece, setSelectedPiece] = useState(null);

    console.log(selectedPiece)


    const handleCellClick = (row, col, piece) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + col);
        const rank = 1 + row;
        const square = `${file}${rank}`;

        if (!selectedPiece) {
            // First click, select the piece
            setSelectedPiece({row, col, square});
        } else {
            // Second click, send the move
            const message = {
                type: 'move',
                payload: `${selectedPiece.square}${square}`,
            };
            socket.send(JSON.stringify(message));

            // Clear selected piece
            setSelectedPiece(null);
        }
    };


    return (
        <div>
            <h2>Chess Test Component</h2>
            <label>
                Enter Game Name:
                <input type="text" value={gameName} onChange={handleGameNameChange}/>
            </label>
            <button onClick={connectToGame}>Connect to Game</button>
            <br/>
            {socket && (
                <>
                    <label>
                        Enter Move:
                        <input type="text" value={inputMove} onChange={handleMoveChange}/>
                    </label>
                    <button onClick={handleSendMove}>Send Move</button>
                </>
            )}
            <hr/>
            <h3>Last Received Message:</h3>
            {lastMessage && gameToMarkup(lastMessage.board)}
        </div>
    );
};

export default ChessTestComponent;