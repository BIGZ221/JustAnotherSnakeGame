import { useCallback, useEffect, useRef, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import GameBoard from "./components/GameBoard";
import { clearGameBoard, gameTick, Tile, updateGameBoard } from "./utils/game";
import { IDimensions, IFood, ISnake } from "./types";

import "./app.scss";

function App() {
    const timerIdRef = useRef<NodeJS.Timer | null>(null);
    const [boardDimensions] = useState<IDimensions>({
        width: 24,
        height: 24
    });
    const [snake, setSnake] = useState<ISnake>({
        isDead: false,
        direction: "N",
        body: [],
        neededSegments: 0
    });
    const [gameBoard, setGameBoard] = useState<Array<Array<Tile>>>([[]]);
    const [food, setFood] = useState<IFood | null>(null);

    useEffect(() => {
        setGameBoard(clearGameBoard(boardDimensions));
    }, [boardDimensions]);

    const changeDirection = useCallback(
        (e: KeyboardEvent) => {
            setSnake((oldSnake) => {
                const newSnake = cloneDeep(oldSnake);
                switch (e.key) {
                    case "ArrowUp":
                        newSnake.direction = "N";
                        break;
                    case "ArrowDown":
                        newSnake.direction = "S";
                        break;
                    case "ArrowLeft":
                        newSnake.direction = "W";
                        break;
                    case "ArrowRight":
                        newSnake.direction = "E";
                        break;
                }
                return newSnake;
            });
        },
        [setSnake]
    );

    const tick = useCallback(() => {
        gameTick({
            setSnake,
            gameBoard,
            setGameBoard,
            boardDimensions,
            timerIdRef
        });
    }, [snake]);

    const startGame = useCallback(() => {
        timerIdRef.current && clearInterval(timerIdRef.current);
        setSnake({
            isDead: false,
            direction: "N",
            body: [
                {
                    x: Math.floor(boardDimensions.width / 2),
                    y: Math.floor(boardDimensions.height / 2)
                }
            ],
            neededSegments: 0
        });
        const timerId = setInterval(tick, 500);
        timerIdRef.current = timerId;
        window.addEventListener("keydown", changeDirection);
    }, [timerIdRef, boardDimensions]);

    return (
        <div className="container">
            <button onClick={startGame}>Start</button>
            <GameBoard tiles={gameBoard} />
        </div>
    );
}

export default App;
