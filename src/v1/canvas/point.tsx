import * as P from '../../models/point';
import {drawFill} from './fill';

export interface DrawCircleRequest {
    radius: number;
    color: string;
}

export type DrawPoint = (ctx: CanvasRenderingContext2D) => (config: DrawCircleRequest) => (origin: P.AbsolutePoint) => P.AbsolutePoint;
export const drawPoint: DrawPoint = (ctx) => (config) => (origin) => {
    ctx.beginPath()
    ctx.arc(origin.x, origin.y, config.radius, 0, 2 * Math.PI);
    ctx.closePath()
    drawFill(ctx)({color: config.color});
    return origin;
};
