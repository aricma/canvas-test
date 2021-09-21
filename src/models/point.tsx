export enum Type {
    ABSOLUTE = 'POINT_TYPE/ABSOLUTE',
    RELATIVE = 'POINT_TYPE/RELATIVE',
}

export interface Point {
    x: number;
    y: number;
}

export type NewPoint = (x: number, y: number) => Point;
export const point: NewPoint = (x, y) => ({x, y});

export interface AbsolutePoint extends Point {
    type: Type.ABSOLUTE;
}

export type NewAbsolutePoint = (x: number, y: number) => AbsolutePoint;
export const absolutePoint: NewAbsolutePoint = (x, y) => ({ type: Type.ABSOLUTE, x, y});

export type ToAbsolute = (p: Point) => AbsolutePoint;
export const toAbsolute: ToAbsolute = (p) => ({ ...p, type: Type.ABSOLUTE });

export interface RelativePoint extends Point {
    type: Type.RELATIVE;
}

export type NewRelativePoint = (x: number, y: number) => RelativePoint;
export const relativePoint: NewRelativePoint = (x, y) => ({ type: Type.RELATIVE, x, y});

export type Add = (a: Point) => (b: Point) => Point;
export const add: Add = a => b => point(a.x + b.x, a.y + b.y);

export type Sub = (a: Point) => (b: Point) => Point;
export const sub: Sub = a => b => point(b.x - a.x, b.y - a.y);
