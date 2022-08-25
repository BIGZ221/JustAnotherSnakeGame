import { Tile } from "../utils/game";

const getClassNames = (tile: Tile): Array<string> => {
    const classNames = ["game-cell"];
    switch (tile) {
        case Tile.Fruit:
            classNames.push("fruit-cell");
            break;
        case Tile.SnakeHead:
            classNames.push("snake-head");
        case Tile.SnakeBody:
            classNames.push("snake-body");
            break;
    }
    return classNames;
};

const GameBoard = ({ tiles }: { tiles: Array<Array<Tile>> }): JSX.Element => (
    <div className="game-board">
        {tiles.map((row, i) => (
            <div key={`game-row-${i}`}>
                {row.map((tile, j) => (
                    <div
                        className={getClassNames(tile).join(" ")}
                        key={`game-cell-${i}-${j}`}
                    />
                ))}
            </div>
        ))}
    </div>
);

export default GameBoard;
