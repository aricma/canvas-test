import * as P from '../../models/point';
import * as S from './drawType';


export interface DrawCircleRequest {
    radius: number;
    color: string;
}

export type DrawCircle = (ctx: CanvasRenderingContext2D) => (config: DrawCircleRequest) => (origin: P.AbsolutePoint) => P.AbsolutePoint;
export const drawCircle: DrawCircle = ctx => config => origin => {
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, config.radius, 0, 2 * Math.PI);
    S.drawStroke(ctx)({
        width: 4,
        cap: S.LineCapType.ROUND,
        color: config.color,
    });
    return origin;
};
