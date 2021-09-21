import {Point} from '../../models/point';


export type AbsoluteLine = (to: Point) => string;
export const absoluteLine: AbsoluteLine = to => `L${to.x},${to.y}`;

export type RelativeLine = (to: Point) => string;
export const relativeLine: RelativeLine = to => `l${to.x},${to.y}`;
