import { useEffect, useRef } from "react";

type ICanvasProps = {
    refreshTimeInMS: number;
    draw: (ctx: CanvasRenderingContext2D) => void
}

const Canvas = ({ refreshTimeInMS, draw }: ICanvasProps): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return;
        draw(ctx);
        if (timeoutRef.current) clearInterval(timeoutRef.current);
        timeoutRef.current = setInterval(() => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext("2d")
            if (!ctx) return;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            draw(ctx);
            ctx.closePath();
        }, refreshTimeInMS)
        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        }
    }, [])

    return <canvas height={625} width={625} className="responsive-canvas" ref={canvasRef} />
}

export default Canvas;