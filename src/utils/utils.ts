import { IDimensions, IPosition } from "../types";

export const isInBounds = (
    { x, y }: IPosition,
    { width, height }: IDimensions
) => {
    return !(x < 0 || y < 0 || x >= width || y >= height);
};
