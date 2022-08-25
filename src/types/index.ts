export interface IDimensions {
    width: number;
    height: number;
}

export interface IPosition {
    x: number;
    y: number;
}

export interface ISnake {
    isDead: boolean;
    direction: "N" | "E" | "S" | "W";
    body: Array<IPosition>;
    neededSegments: number;
}

export interface IFood {
    position: IPosition;
}
