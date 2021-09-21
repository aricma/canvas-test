import {Point, point} from '../../models/point';
import {path} from './path';
import {absoluteMove, relativeMove, close} from './move';


export interface CircleRequest {
    radius: number;
}

export type Circle = (req: CircleRequest) => (origin: Point) => string;
export const circle: Circle = req => origin => {
    return path([
        absoluteMove(point(origin.x, origin.y)),
        relativeMove(point(-req.radius, 0)),
        `a ${req.radius},${req.radius} 0 1,0 ${req.radius * 2},0`,
        `a ${req.radius},${req.radius} 0 1,0 -${req.radius * 2},0`,
        // close()
    ]);
};
