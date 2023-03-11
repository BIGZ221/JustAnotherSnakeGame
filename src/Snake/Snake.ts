import _ from "lodash";

class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(rhs: Vec2) {
        this.x += rhs.x;
        this.y += rhs.y;
    }

    sub(rhs: Vec2) {
        this.x -= rhs.x;
        this.y -= rhs.y;
    }

    copy(vec: Vec2) {
        this.x = vec.x;
        this.y = vec.y;
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(rhs: Vec2) {
        return this.x === rhs.x && this.y === rhs.y;
    }
}

export enum Directions {
    "Up",
    "Right",
    "Down",
    "Left"
}

export type BoardSize = { height: number; width: number };

class Snake {
    direction: Vec2;
    body: Vec2[];
    isDead: boolean;
    boundry: BoardSize;
    availablePositions: Set<{ x: number; y: number }>;

    constructor(x: number, y: number, boundary: BoardSize) {
        const startX = Math.round(x);
        const startY = Math.round(y);
        this.direction = new Vec2(0, -1);
        this.body = [new Vec2(startX, startY)];
        this.isDead = false;
        this.boundry = boundary;
        this.availablePositions = new Set();
        for (let i = 0; i < boundary.width; i++) {
            for (let j = 0; j < boundary.height; j++) {
                this.availablePositions.add({ x: i, y: j });
            }
        }
        console.log(this.availablePositions);
        this.availablePositions.delete({ x: 0, y: 0 });
        console.log(this.availablePositions);
    }

    isOutOfBounds(pos: Vec2) {
        return (
            pos.x < 0 ||
            pos.y < 0 ||
            pos.x >= this.boundry.width ||
            pos.y >= this.boundry.height
        );
    }

    isOccupied(pos: Vec2) {
        return this.body.reduce(
            (res: boolean, rhs: Vec2) => res || pos.equals(rhs),
            false
        );
    }

    move() {
        if (this.isDead) return;
        const newBody = _.cloneDeep(this.body);
        for (let i = this.body.length - 1; i > 0; i--) {
            newBody[i].copy(newBody[i - 1]);
        }
        const occupied = newBody.slice(1);
        newBody[0].add(this.direction);
        const head = newBody[0];
        const willDie = occupied.reduce(
            (res: boolean, rhs: Vec2) => res || head.equals(rhs),
            false
        );
        if (this.isOutOfBounds(head) || willDie) {
            this.isDead = true;
        } else {
            this.body = newBody;
        }
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push(new Vec2(tail.x, tail.y));
    }

    changeDir(dir: Directions) {
        switch (dir) {
            case Directions.Up:
                this.direction.set(0, -1);
                break;
            case Directions.Right:
                this.direction.set(1, 0);
                break;
            case Directions.Down:
                this.direction.set(0, 1);
                break;
            case Directions.Left:
                this.direction.set(-1, 0);
                break;
            default:
                break;
        }
    }
}

export default Snake;
