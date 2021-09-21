export interface DrawFillRequest {
    color: string;
}

export type DrawFill = (ctx: CanvasRenderingContext2D) => (config: DrawFillRequest) => void;
export const drawFill: DrawFill = ctx => config => {
    ctx.fillStyle = config.color;
    ctx.fill();
};
