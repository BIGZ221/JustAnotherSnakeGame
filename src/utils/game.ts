import { Dispatch, MutableRefObject, SetStateAction } from "react";
import cloneDeep from "lodash/cloneDeep";
import times from "lodash/times";
import { IDimensions, IPosition, ISnake } from "../types";
import { isInBounds } from "./utils";

export enum Tile {
    Fruit,
    SnakeHead,
    SnakeBody,
    Clear
}

export const clearGameBoard = (boardDimensions: IDimensions) =>
    times(boardDimensions.height, () =>
        times(boardDimensions.width, () => Tile.Clear)
    );

export const updateGameBoard = ({
    boardDimensions,
    setGameBoard,
    snake
}: {
    boardDimensions: IDimensions;
    setGameBoard: Dispatch<SetStateAction<Array<Array<Tile>>>>;
    snake: ISnake;
}): void => {
    const gameBoard = clearGameBoard(boardDimensions);
    snake.body.forEach((position, index) => {
        gameBoard[position.y][position.x] =
            index === 0 ? Tile.SnakeHead : Tile.SnakeBody;
    });
    setGameBoard(gameBoard);
};

const getOpenTiles = (gameBoard: Array<Array<Tile>>): Array<IPosition> =>
    gameBoard.reduce<Array<IPosition>>(
        (allOpenTiles, row, i) =>
            allOpenTiles.concat(
                row.reduce<Array<IPosition>>((rowTiles, tile, j) => {
                    if (tile === Tile.Clear) rowTiles.push({ x: j, y: i });
                    return rowTiles;
                }, [])
            ),
        []
    );

const propogateHead = (snake: ISnake): IPosition => {
    const newPosition = cloneDeep(snake.body[0]);
    switch (snake.direction) {
        case "N":
            newPosition.x -= 1;
            break;
        case "E":
            newPosition.y += 1;
            break;
        case "S":
            newPosition.x += 1;
            break;
        case "W":
            newPosition.y -= 1;
            break;
    }
    return newPosition;
};

const propogateBody = (snake: ISnake, newHeadPosition: IPosition): ISnake => {
    const newSnake = cloneDeep(snake);
    newSnake.body = [newHeadPosition].concat(newSnake.body);
    if (snake.neededSegments === 0) {
        newSnake.body.pop();
    } else {
        newSnake.neededSegments -= 1;
    }
    return newSnake;
};

const isSnakeDead = (
    snake: ISnake,
    newHeadPosition: IPosition,
    boardDimensions: IDimensions
): boolean =>
    !isInBounds(newHeadPosition, boardDimensions) ||
    snake.body.reduce(
        (dead, position) =>
            dead ||
            (newHeadPosition.x === position.x &&
                newHeadPosition.y === position.y),
        false
    );

export interface IGameTickProps {
    setSnake: Dispatch<SetStateAction<ISnake>>;
    gameBoard: Array<Array<Tile>>;
    setGameBoard: Dispatch<SetStateAction<Array<Array<Tile>>>>;
    boardDimensions: IDimensions;
    timerIdRef: MutableRefObject<NodeJS.Timer | null>;
}

export const gameTick = ({
    setSnake,
    gameBoard,
    setGameBoard,
    boardDimensions,
    timerIdRef
}: IGameTickProps) => {
    console.log(getOpenTiles(gameBoard));
    setSnake((oldSnake) => {
        const newSnake = cloneDeep(oldSnake);
        const newHeadPosition = propogateHead(newSnake);
        if (isSnakeDead(newSnake, newHeadPosition, boardDimensions)) {
            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
                timerIdRef.current = null;
            }
            return newSnake;
        }
        return propogateBody(newSnake, newHeadPosition);
    });
};
