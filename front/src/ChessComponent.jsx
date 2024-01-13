import React, { useState, useEffect } from 'react';

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

    return (
        <div>
            <h2>Chess Test Component</h2>
            <label>
                Enter Game Name:
                <input type="text" value={gameName} onChange={handleGameNameChange} />
            </label>
            <button onClick={connectToGame}>Connect to Game</button>
            <br />
            {socket && (
                <>
                    <label>
                        Enter Move:
                        <input type="text" value={inputMove} onChange={handleMoveChange} />
                    </label>
                    <button onClick={handleSendMove}>Send Move</button>
                </>
            )}
            <hr />
            <h3>Last Received Message:</h3>
            {lastMessage && <p>{JSON.stringify(lastMessage)}</p>}
        </div>
    );
};

export default ChessTestComponent;