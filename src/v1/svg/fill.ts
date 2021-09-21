export interface FillRequest {
    color: string;
}

export type Fill = (ctx: CanvasRenderingContext2D) => (req: FillRequest) => (path: Path2D) => void;
export const fill: Fill = ctx => req => path => {
    ctx.fillStyle = req.color;
    ctx.fill(path);
};

export interface StrokeRequest {
    color: string;
    width: number;
}

export type Stroke = (ctx: CanvasRenderingContext2D) => (req: StrokeRequest) => (path: Path2D) => void;
export const stroke: Stroke = ctx => req => path => {
    ctx.strokeStyle = req.color;
    ctx.lineWidth = req.width;
    ctx.stroke(path);
};
