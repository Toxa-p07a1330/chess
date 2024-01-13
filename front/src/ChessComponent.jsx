import React, {useState} from 'react';
import styles from "./style.module.scss"

const ChessTestComponent = () => {
    const [gameName, setGameName] = useState('');
    const [inputMove, setInputMove] = useState('');
    const [lastMessage, setLastMessage] = useState(null);
    const [socket, setSocket] = useState(null);

    const connectToGame = () => {
        if (gameName.trim() !== '') {
            const newSocket = new WebSocket(`ws://localhost:3001/${gameName}`);

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
                                    className={colIndex % 2 === rowIndex % 2 ? styles.white : styles.black}
                                >{piece || '.'}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
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