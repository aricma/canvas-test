import * as F from 'fp-ts/function';
import * as Point from '../../models/point';
import * as SVGPath from './path';
import * as SVGLine from './line';
import * as SVGMove from './move';
import * as P from '../../models/point';
import {getQuadCurvePoints, QuadCurveType, QuadCurvePoints} from '../quadCurve';

export interface RectRequest {
    width: number;
    height: number;
    borderRadius?: number;
}

export type Rect = (req: RectRequest) => (origin: Point.Point) => string;
export const rect: Rect = req => origin => {
    const borderRadius = req.borderRadius ?? 0;
    const halfOfWidth = req.width / 2;
    const halfOfHeight = req.height / 2;
    const topRight = P.add(P.point(halfOfWidth, -halfOfHeight))(origin);
    const bottomRight = P.add(P.point(halfOfWidth, halfOfHeight))(origin);
    const topLeft = P.add(P.point(-halfOfWidth, -halfOfHeight))(origin);
    const bottomLeft = P.add(P.point(-halfOfWidth, halfOfHeight))(origin);
    const allPoints = {
        topRight: getQuadCurvePoints({
            type: QuadCurveType.TOP_RIGHT,
            borderRadius,
        })(topRight),
        bottomRight: getQuadCurvePoints({
            type: QuadCurveType.BOTTOM_RIGHT,
            borderRadius,
        })(bottomRight),
        bottomLeft: getQuadCurvePoints({
            type: QuadCurveType.BOTTOM_LEFT,
            borderRadius,
        })(bottomLeft),
        topLeft: getQuadCurvePoints({
            type: QuadCurveType.TOP_LEFT,
            borderRadius,
        })(topLeft),
    };
    const squareCurve = (req: QuadCurvePoints) => absoluteQuadCurve(req.over)(req.to);
    return SVGPath.path([
        F.pipe(allPoints.topRight.from, SVGMove.absoluteMove),
        F.pipe(allPoints.topRight, squareCurve),
        F.pipe(allPoints.bottomRight.from, SVGLine.absoluteLine),
        F.pipe(allPoints.bottomRight, squareCurve),
        F.pipe(allPoints.bottomLeft.from, SVGLine.absoluteLine),
        F.pipe(allPoints.bottomLeft, squareCurve),
        F.pipe(allPoints.topLeft.from, SVGLine.absoluteLine),
        F.pipe(allPoints.topLeft, squareCurve),
        SVGMove.close(),
    ]);
}
export interface CornersRequest extends RectRequest {
    cornerLength: number;
}

export type Corners = (req: CornersRequest) => (origin: Point.Point) => string;
export const corners: Corners = req => origin => {
    const borderRadius = req.borderRadius ?? 0;
    const halfOfWidth = req.width / 2;
    const halfOfHeight = req.height / 2;
    const topRight = P.add(P.point(halfOfWidth, -halfOfHeight))(origin);
    const bottomRight = P.add(P.point(halfOfWidth, halfOfHeight))(origin);
    const topLeft = P.add(P.point(-halfOfWidth, -halfOfHeight))(origin);
    const bottomLeft = P.add(P.point(-halfOfWidth, halfOfHeight))(origin);
    const allPoints = {
        topRight: getQuadCurvePoints({
            type: QuadCurveType.TOP_RIGHT,
            borderRadius,
        })(topRight),
        bottomRight: getQuadCurvePoints({
            type: QuadCurveType.BOTTOM_RIGHT,
            borderRadius,
        })(bottomRight),
        bottomLeft: getQuadCurvePoints({
            type: QuadCurveType.BOTTOM_LEFT,
            borderRadius,
        })(bottomLeft),
        topLeft: getQuadCurvePoints({
            type: QuadCurveType.TOP_LEFT,
            borderRadius,
        })(topLeft),
    };
    const squareCurve = (req: QuadCurvePoints) => absoluteQuadCurve(req.over)(req.to);
    return SVGPath.path([
        F.pipe(allPoints.topRight.from, SVGMove.absoluteMove),
        F.pipe(allPoints.topRight, squareCurve),
        F.pipe(allPoints.bottomRight.from, SVGMove.relativeMove),
        F.pipe(allPoints.bottomRight, squareCurve),
        F.pipe(allPoints.bottomLeft.from, SVGMove.relativeMove),
        F.pipe(allPoints.bottomLeft, squareCurve),
        F.pipe(allPoints.topLeft.from, SVGMove.relativeMove),
        F.pipe(allPoints.topLeft, squareCurve),
        // SVGMove.close(),
    ]);
}

export type AbsoluteQuadCurve = (over: Point.Point) => (to: Point.Point) => string;
export const absoluteQuadCurve: AbsoluteQuadCurve = over => to => `Q${over.x},${over.y} ${to.x},${to.y}`;
