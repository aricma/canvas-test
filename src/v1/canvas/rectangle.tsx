import * as P from '../../models/point';
import * as S from './drawType';
import * as L from './line';
// import {getQuadCurvePoints, QuadCurveType, QuadCurvePoints, absoluteQuadCurve} from '../App';


export interface DrawRectRequest {
    height: number;
    width: number;
    color: string;
    drawType?: S.DrawType;
    borderRadius?: number;
    strokeWidth?: number;
    strokeColor?: string;
    lineCap?: S.LineCapType;
}

// export const drawRect = (ctx: CanvasRenderingContext2D) => (req: DrawRectRequest) => (origin: P.AbsolutePoint) => {
//     const borderRadius = req.borderRadius ?? 0;
//     const halfOfWidth = req.width / 2;
//     const halfOfHeight = req.height / 2;
//     const topRight = P.add(P.relativePoint(halfOfWidth, -halfOfHeight))(origin);
//     const bottomRight = P.add(P.relativePoint(halfOfWidth, halfOfHeight))(origin);
//     const topLeft = P.add(P.relativePoint(-halfOfWidth, -halfOfHeight))(origin);
//     const bottomLeft = P.add(P.relativePoint(-halfOfWidth, halfOfHeight))(origin);
//     const allPoints = {
//         topRight: getQuadCurvePoints({
//             type: QuadCurveType.TOP_RIGHT,
//             borderRadius,
//         })(topRight),
//         bottomRight: getQuadCurvePoints({
//             type: QuadCurveType.BOTTOM_RIGHT,
//             borderRadius,
//         })(bottomRight),
//         bottomLeft: getQuadCurvePoints({
//             type: QuadCurveType.BOTTOM_LEFT,
//             borderRadius,
//         })(bottomLeft),
//         topLeft: getQuadCurvePoints({
//             type: QuadCurveType.TOP_LEFT,
//             borderRadius,
//         })(topLeft),
//     };
//     const drawCorner = (req: QuadCurvePoints) => absoluteQuadCurve(ctx)(req.from)(req.over)(req.to);
//     const drawLine = (from: P.AbsolutePoint) => (to: P.AbsolutePoint) => L.lineToAbsolute(ctx)(from)(to);
//     // ctx.beginPath();
//     const x1 = drawCorner(allPoints.topRight);
//     drawLine(x1)(allPoints.bottomRight.from);
//     const x2 = drawCorner(allPoints.bottomRight);
//     drawLine(x2)(allPoints.bottomLeft.from);
//     const x3 = drawCorner(allPoints.bottomLeft);
//     drawLine(x3)(allPoints.topLeft.from);
//     const x4 = drawCorner(allPoints.topLeft);
//     drawLine(x4)(allPoints.topRight.from);
//     const drawType = req.drawType ?? S.DrawType.FILL;
//     switch (drawType) {
//         case S.DrawType.FILL: {
//             S.drawFill(ctx)({
//                 color: req.color,
//             });
//             return origin;
//         }
//         case S.DrawType.STROKE: {
//             S.drawStroke(ctx)({
//                 width: 2,
//                 cap: S.LineCapType.ROUND,
//                 color: req.strokeColor ?? req.color,
//             });
//             return origin;
//         }
//     }
//     ctx.closePath();
// };
