import * as P from '../../models/point';


export type LineToRelative = (ctx: CanvasRenderingContext2D) => (to: P.RelativePoint) => (from: P.AbsolutePoint) => P.AbsolutePoint;
export const lineToRelative: LineToRelative = (ctx) => (to) => (from) => {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(from.x + to.x, from.y + to.y);
    return P.toAbsolute(P.add(to)(from));
};

export type LineToAbsolute = (ctx: CanvasRenderingContext2D) => (to: P.AbsolutePoint) => (from: P.AbsolutePoint) => P.AbsolutePoint;
export const lineToAbsolute: LineToAbsolute = (ctx) => (to) => (from) => {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    return to;
};
