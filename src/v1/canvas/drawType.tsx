export enum DrawType {
    FILL = 'FILL',
    STROKE = 'STROKE',
}

export enum LineCapType {
    ROUND = 'round',
    BUTT = 'butt',
    SQUARE = 'square',
}

export interface DrawStrokeRequest {
    color: string;
    width?: number;
    cap?: LineCapType;
}

export type DrawStroke = (ctx: CanvasRenderingContext2D) => (config: DrawStrokeRequest) => void;
export const drawStroke: DrawStroke = ctx => config => {
    ctx.strokeStyle = config.color;
    ctx.lineWidth = config.width ?? 1;
    ctx.lineCap = config.cap ?? LineCapType.SQUARE;
    ctx.stroke();
};

export interface DrawFillRequest {
    color: string;
}

export type DrawFill = (ctx: CanvasRenderingContext2D) => (config: DrawFillRequest) => void;
export const drawFill: DrawFill = ctx => config => {
    ctx.fillStyle = config.color;
    ctx.fill();
};

