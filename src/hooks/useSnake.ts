import { useCallback, useEffect, useRef, useState } from "react";
import Snake, { Directions, BoardSize } from "../Snake/Snake";

const drawGrid = (ctx: CanvasRenderingContext2D, boardSize: BoardSize) => {
    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
    const blockWidth = canvasWidth / boardSize.width;
    const blockHeight = canvasHeight / boardSize.height;
    for (let i = 0; i < boardSize.height; i++) {
        for (let j = 0; j < boardSize.width; j++) {
            ctx.strokeRect(
                i * blockWidth,
                j * blockHeight,
                blockWidth,
                blockHeight
            );
        }
    }
};

const drawSnake = (
    snake: Snake,
    ctx: CanvasRenderingContext2D,
    boardSize: BoardSize
) => {
    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
    const blockWidth = canvasWidth / boardSize.width;
    const blockHeight = canvasHeight / boardSize.height;

    ctx.fillStyle = "green";
    snake.body.forEach((segment) => {
        ctx.fillRect(
            segment.x * blockWidth,
            segment.y * blockHeight,
            blockWidth,
            blockHeight
        );
    });
    const head = snake.body[0];
    ctx.fillStyle = "black";
    ctx.ellipse(
        head.x * blockWidth + Math.round(blockWidth / 2),
        head.y * blockHeight + Math.round(blockHeight / 2),
        5,
        5,
        0,
        0,
        30
    );
    ctx.stroke();
};

const useSnake = (boardSize: BoardSize) => {
    const tickRef = useRef<NodeJS.Timer>();
    const snakeRef = useRef<Snake>(
        new Snake(boardSize.width / 2, boardSize.height / 2, boardSize)
    );
    const [isDead, setIsDead] = useState(false);

    useEffect(() => {
        if (tickRef.current) clearInterval(tickRef.current);
        tickRef.current = setInterval(() => {
            if (snakeRef.current.isDead) return;
            snakeRef.current.move();
        }, 500);
        return () => {
            if (tickRef.current) clearInterval(tickRef.current);
        };
    }, []);

    const changeDirection = useCallback((e: KeyboardEvent) => {
        const snake = snakeRef.current;
        switch (e.key.toLowerCase()) {
            case "arrowup":
            case "w":
                snake.changeDir(Directions.Up);
                break;
            case "arrowright":
            case "d":
                snake.changeDir(Directions.Right);
                break;
            case "arrowdown":
            case "s":
                snake.changeDir(Directions.Down);
                break;
            case "arrowleft":
            case "a":
                snake.changeDir(Directions.Left);
                break;
            default:
                break;
        }
    }, []);

    const respawn = useCallback(() => {
        snakeRef.current = new Snake(
            boardSize.width / 2,
            boardSize.height / 2,
            boardSize
        );
    }, [boardSize]);

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            drawGrid(ctx, boardSize);
            drawSnake(snakeRef.current, ctx, boardSize);
        },
        [boardSize]
    );

    return { isDead, draw, changeDirection, respawn };
};

export default useSnake;
