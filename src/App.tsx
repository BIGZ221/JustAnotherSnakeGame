import { useEffect } from "react";

import "./app.scss";
import Canvas from "./components/Canvas";
import useSnake from "./hooks/useSnake";

const BOARD_SIZE = { height: 25, width: 25 };

function App() {
    const { isDead, respawn, draw, changeDirection } = useSnake(BOARD_SIZE)

    useEffect(() => {
        document.addEventListener("keydown", changeDirection);
        return () => {
            document.removeEventListener("keydown", changeDirection);
        }
    }, []);

    return (
        <div className="container">
            <div>empty</div>
            <div>
                <Canvas refreshTimeInMS={32} draw={draw} />
            </div>
            <div>empty</div>
        </div>);
}

export default App;
