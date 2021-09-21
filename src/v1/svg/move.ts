import {Point} from '../../models/point';


export type AbsoluteMove = (to: Point) => string;
export const absoluteMove: AbsoluteMove = (to) => `M${to.x},${to.y}`;

export type RelativeMove = (to: Point) => string;
export const relativeMove: RelativeMove = (to) => `M${to.x},${to.y}`;

export type Close = () => string;
export const close: Close = () => 'Z';
