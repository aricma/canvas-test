import './pureCanvas.css';
import * as P from '../models/point';
import * as SVGPath from './svg/path';
import * as SVGRect from './svg/rect';
import React from 'react';
import {fill, stroke} from './svg/fill';
import {circle} from './svg/circle';

const colors = [
    '#EFF6FF',
    '#DBEAFE',
    '#BFDBFE',
    '#93C5FD',
    '#60A5FA',
    '#3B82F6',
    '#2563EB',
    '#1D4ED8',
    '#1E40AF',
    '#1E3A8A',
];

enum NodeState {
    DEFAULT,
    HOVERED,
    GRABBED,
    SELECTED,
}

interface NodeInState {
    state: NodeState;
    origin: P.Point;
    color: string;
}

interface State {
    color: string;
    nodes: Array<NodeInState>;
}

const removeSelectedNode = (nodes: Array<NodeInState>): Array<NodeInState> => {
    return nodes.filter((node) => node.state !== NodeState.SELECTED);
};


export function PureCanvas() {
    const [state, setState] = React.useState<State>({ color: '#fff', nodes: [] });
    React.useEffect(() => {
        const canvas = document.getElementById('root-canvas') as HTMLCanvasElement;
        canvas !== null && renderCanvas(setState)(canvas)(state);
    }, [state]);
    return (
        <div className="App">
            <div className="p-4 flex items-center justify-end space-x-2">
                <button className="p-4 flex items-center rounded-md border" onClick={() => setState(s => ({...s, nodes: [] }))}>CLEAR</button>
                { state.nodes.filter((node) => node.state === NodeState.SELECTED).length === 1 && (
                    <button className="p-4 flex items-center rounded-md border" onClick={() => setState(s => ({...s, nodes: removeSelectedNode(s.nodes) }))}>REMOVE SELECTED NODE</button>
                )}
            </div>
            <header className="w-screen h-screen flex items-center justify-center">
                <div className="flex items-start space-x-4">
                    <ul className="flex flex-col space-y-2">
                        {
                            colors.map((colorName, key) => (
                                <li key={key}>
                                    {
                                        colorName === state.color ? (
                                            <button
                                                onClick={() => {}}
                                                className="p-4 rounded-md ring ring-offset-2"
                                                style={{ backgroundColor: colorName }}>{colorName}</button>
                                        ) : (
                                            <button
                                                onClick={() => setState(s => ({ ...s, color: colorName }))}
                                                className="p-4 rounded-md"
                                                style={{ backgroundColor: colorName }}>{colorName}</button>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                    <canvas id="root-canvas" height="600" width="800" />
                </div>
            </header>
        </div>
    );
};

const renderCanvas = (setState: (s: State)  => void) => (canvas: HTMLCanvasElement) => (state: State) =>  {
    const ctx = canvas.getContext('2d');
    if (ctx !== null) modifyContext(setState)(ctx)(state);
};

const modifyContext = (setState: (s: State)  => void) => (ctx: CanvasRenderingContext2D) => (state: State) =>  {
    // window.requestAnimationFrame(() => {
    //
    // });

    ctx.clearRect(0, 0, 800, 600);

    state.nodes.forEach((node) => {
        const rect = new Path2D(SVGRect.rect({
            width: 100,
            height: 75,
            borderRadius: 10,
        })(node.origin));
        ctx.beginPath();
        fill(ctx)({ color: node.color })(rect);
        const ring = new Path2D(SVGRect.rect({
            width: 110,
            height: 85,
            borderRadius: 15,
        })(node.origin));
        const corners = new Path2D(SVGRect.corners({
            width: 110,
            height: 85,
            borderRadius: 15,
            cornerLength: 0,
        })(node.origin));
        const connector = new Path2D(circle({
            radius: 10,
        })(P.point(100, 100)))
        if (node.state === NodeState.SELECTED) {
            stroke(ctx)({
                color: '#10B981',
                width: 4,
            })(corners);
            fill(ctx)({
                color: node.color,
            })(connector);
        }
        node.state === NodeState.GRABBED && stroke(ctx)({
            color: '#FBBF24',
            width: 4,
        })(ring);
        node.state === NodeState.HOVERED && stroke(ctx)({
            color: node.color,
            width: 2,
        })(ring);
    });

    const allNodesPath = new Path2D(SVGPath.path(state.nodes.map((node) => SVGRect.rect({
        width: 100,
        height: 75,
        borderRadius: 10,
    })(node.origin))));

    const someNodeIsGrabbed = state.nodes.filter((node) => node.state === NodeState.GRABBED).length === 1;

    ctx.canvas.onmousemove = (e) => {
        if (ctx.isPointInPath(allNodesPath, e.offsetX, e.offsetY)) {
            ctx.canvas.style.cursor = 'pointer';
            setState({
                ...state,
                nodes: state.nodes.map((node): NodeInState => {
                    const path = new Path2D(SVGRect.rect({
                        width: 100,
                        height: 75,
                        borderRadius: 10,
                    })(node.origin))
                    if (ctx.isPointInPath(path, e.offsetX, e.offsetY)) {
                        if (node.state === NodeState.DEFAULT) {
                            return {
                                ...node,
                                state: NodeState.HOVERED,
                            };
                        } else {
                            return {
                                ...node,
                            }
                        }
                    } else {
                        return {
                            ...node,
                            state: node.state === NodeState.HOVERED ? NodeState.DEFAULT : node.state,
                        }
                    }
                }),
            });
        } else {
            ctx.canvas.style.cursor = 'auto';
            setState({
                ...state,
                nodes: state.nodes.map((node): NodeInState => {
                    if (node.state === NodeState.HOVERED) {
                        return {
                            ...node,
                            state: NodeState.DEFAULT,
                        };
                    } else {
                        return node;
                    }
                }),
            });
        }
        if (someNodeIsGrabbed) {
            ctx.canvas.style.cursor = 'grab';
            setState({
                ...state,
                nodes: state.nodes.map((node): NodeInState => {
                    if (node.state === NodeState.GRABBED) {
                        return {
                            ...node,
                            origin: P.point(e.offsetX, e.offsetY),
                        };
                    } else {
                        return node;
                    }
                }),
            });
        }
    }

    ctx.canvas.onmousedown = (e) => {
        if (ctx.isPointInPath(allNodesPath, e.offsetX, e.offsetY)) {
            setState({
                ...state,
                nodes: state.nodes.map((node): NodeInState => {
                    const path = new Path2D(SVGRect.rect({
                        width: 100,
                        height: 75,
                        borderRadius: 10,
                    })(node.origin))
                    if (ctx.isPointInPath(path, e.offsetX, e.offsetY)) {
                        return {
                            ...node,
                            state: NodeState.GRABBED,
                        };
                    } else {
                        return {
                            ...node,
                            state: NodeState.DEFAULT,
                        };
                    }
                }),
            });
        } else {
            const newNode: NodeInState = {
                state: NodeState.GRABBED, color: state.color, origin: P.point(e.offsetX, e.offsetY) };
            setState({
                ...state,
                nodes: [...state.nodes.map((each) => ({...each, state: NodeState.DEFAULT })), newNode],
            });
        }
    }

    ctx.canvas.onmouseup = (e) => {
        setState({
            ...state,
            nodes: state.nodes.map((node): NodeInState => {
                switch (node.state) {
                    case NodeState.GRABBED:
                        return {
                            ...node,
                            state: NodeState.SELECTED,
                        };
                    default:
                        return {
                            ...node,
                            state: NodeState.DEFAULT,
                        };
                }
            }),
        });
    }
};


// export interface DrawXRequest {
//     radius: number;
//     color: string;
// }

// export type DrawX = (ctx: CanvasRenderingContext2D) => (config: DrawXRequest) => (origin: P.AbsolutePoint) => P.AbsolutePoint;
// export const drawX: DrawX = (ctx) => (config) => (origin) => {
//     ctx.beginPath();
//     lineToRelative(ctx)(P.relativePoint(config.radius, 0))(origin);
//     lineToRelative(ctx)(P.relativePoint(0, config.radius))(origin);
//     lineToRelative(ctx)(P.relativePoint(-config.radius, 0))(origin);
//     lineToRelative(ctx)(P.relativePoint(0, -config.radius))(origin);
//     drawStroke(ctx)({
//         width: 4,
//         cap: LineCapType.ROUND,
//         color: config.color,
//     });
//     return origin;
// };
//
// export type DrawQuadraticCurve = (ctx: CanvasRenderingContext2D) => (from: P.AbsolutePoint) => (over: P.AbsolutePoint) => (to: P.AbsolutePoint) => P.AbsolutePoint;
// export const absoluteQuadCurve: DrawQuadraticCurve = ctx => from => over => to => {
//     ctx.moveTo(from.x, from.y);
//     ctx.quadraticCurveTo(over.x, over.y, to.x, to.y);
//     return to;
// };

// export type DrawSquareCurve = (ctx: CanvasRenderingContext2D) => (from: P.AbsolutePoint) => (to: P.RelativePoint) => P.AbsolutePoint;
// export const relativeSquareCurve: DrawSquareCurve = ctx => from => to => {
//     const readPoint = drawPoint(ctx)({
//         color: '#DC2626',
//         radius: 5,
//     });
//     const q = (a: P.AbsolutePoint) => (b: P.AbsolutePoint) => {
//         readPoint(a);
//         readPoint(b);
//         ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
//     };
//     readPoint(from);
//     ctx.moveTo(from.x, from.y);
//     if (from.x < to.x && from.y < to.y) {
//         const over = P.add(from)(P.absolutePoint(to.x, 0));
//         const absoluteTo = P.add(to)(over);
//         q(over)(absoluteTo);
//     } else if (from.x > to.x && from.y < to.y) {
//         const over = P.add(from)(P.absolutePoint(0, to.y));
//         const absoluteTo = P.add(to)(over);
//         q(over)(absoluteTo);
//     } else if (from.x > to.x && from.y > to.y) {
//         const over = P.add(from)(P.absolutePoint(to.x - from.x, 0));
//         const absoluteTo = P.add(to)(over);
//         q(over)(absoluteTo);
//     } else {
//         const over = P.add(from)(P.absolutePoint(0, to.y - from.y));
//         const absoluteTo = P.add(to)(over);
//         q(over)(absoluteTo);
//     }
//     return P.add(to)(from);
// };
