import * as P from '../models/point';


export enum QuadCurveType {
    TOP_RIGHT = 'TOP_RIGHT',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
    BOTTOM_LEFT = 'BOTTOM_LEFT',
    TOP_LEFT = 'TOP_LEFT',
}

export interface QuadCurvePointsRequest {
    type: QuadCurveType,
    borderRadius: number,
}

export interface QuadCurvePoints {
    from: P.Point,
    over: P.Point,
    to: P.Point,
}

export type GetQuadCurvePoints = (req: QuadCurvePointsRequest) => (origin: P.Point) => QuadCurvePoints;
export const getQuadCurvePoints: GetQuadCurvePoints = req => origin => {
    switch (req.type) {
        case QuadCurveType.TOP_RIGHT:
            return ({
                from: P.point(origin.x - req.borderRadius, origin.y),
                over: P.point(origin.x, origin.y),
                to: P.point(origin.x, origin.y + req.borderRadius),
            });
        case QuadCurveType.BOTTOM_RIGHT:
            return ({
                from: P.point(origin.x, origin.y - req.borderRadius),
                over: P.point(origin.x, origin.y),
                to: P.point(origin.x - req.borderRadius, origin.y),
            });
        case QuadCurveType.BOTTOM_LEFT:
            return ({
                from: P.point(origin.x + req.borderRadius, origin.y),
                over: P.point(origin.x, origin.y),
                to: P.point(origin.x, origin.y - req.borderRadius),
            });
        case QuadCurveType.TOP_LEFT:
            return ({
                from: P.point(origin.x, origin.y + req.borderRadius),
                over: P.point(origin.x, origin.y),
                to: P.point(origin.x + req.borderRadius, origin.y),
            });
    }
};
