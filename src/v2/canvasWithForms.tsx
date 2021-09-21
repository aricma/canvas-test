import './pattern.css';
import * as F from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import React from 'react';
import {Point, point} from '../models/point';
import { v4 as uuid } from 'uuid';
import * as SVGRect from '../v1/svg/rect';
import {stroke} from '../v1/svg/fill';


interface State {
    state: StateActionType;
    mousePosition: Point;
    items: {
        [id: string]: NodeInState;
    };
}

export enum StateActionType {
    DEFAULT = 'NODE/DEFAULT',
    ADD = 'NODE/ADD',
}

export const initial = (): State => ({
    state: StateActionType.DEFAULT,
    mousePosition: point(0,0),
    items: {},
});

export enum NodeInStateType {
    DEFAULT = 'NODE/DEFAULT',
    FOCUSED = 'NODE/FOCUSED',
}

export interface NodeInState {
    state: NodeInStateType;
    id: string;
    name: string;
    position: Point;
    width: number;
    height: number;
}

export interface MouseEventMeasures {
    position: Point;
    width: number;
    height: number;
}

export const CanvasWithForms = () => {
    const [state, setState] = React.useState<State>(initial());
    const mouseMoveHandler = (measures: MouseEventMeasures) => setState((prev) => ({
        ...prev,
        mousePosition: measures.position,
        items: F.pipe(
            Object.entries<NodeInState>(prev.items),
            A.map(mapEntry((node) => {
                if (node.state === NodeInStateType.FOCUSED) return {
                    ...node,
                    position: {
                        x: measures.position.x - 8 - 16,
                        y: measures.position.y - 16 - 12,
                    },
                    width: measures.width,
                    height: measures.height,
                };
                return node
            })),
            Object.fromEntries,
        ),
    }));
    const setToAddItem = () => setState((prev) => ({
        ...prev,
        state: StateActionType.ADD,
    }));
    const addItem = (measures: MouseEventMeasures) => setState((prev) => {
        if (prev.state === StateActionType.ADD) {
            const nextItemId = uuid();
            return ({
                ...prev,
                state: StateActionType.DEFAULT,
                items: {
                    ...prev.items,
                    [nextItemId]: {
                        state: NodeInStateType.DEFAULT,
                        id: nextItemId,
                        name: 'node ' + nextItemId,
                        position: measures.position,
                        width: measures.width,
                        height: measures.height,
                    },
                }
            });
        }
        return prev;
    });
    const renameItem = (itemId: string) => (name: string) => setState((prev) => {
        return ({
            ...prev,
            items: F.pipe(
                Object.entries(prev.items),
                A.map(mapEntry((node) => ({...node, name: node.id === itemId ? name : node.name }))),
                Object.fromEntries
            ),
        })
    });
    const removeItem = (itemId: string) => () => setState((prev) => {
        return ({
            ...prev,
            items: F.pipe(
                Object.entries(prev.items),
                A.filter(([_, node]) => node.id !== itemId),
                Object.fromEntries
            ),
        })
    });
    const focusItem = (itemId: string) => () => setState((prev) => ({
        ...prev,
        items: {
            ...prev.items,
            [itemId]: {
                ...prev.items[itemId],
                state: NodeInStateType.FOCUSED,
            },
        }
    }));
    const deFocusItem = () => setState((prev) => ({
        ...prev,
        items: F.pipe(
            Object.entries(prev.items),
            A.map(mapEntry((node) => ({...node, state: NodeInStateType.DEFAULT}))),
            Object.fromEntries
        ),
    }));
    return (
        <div className="w-screen h-screen bg-grey-200 flex items-center justify-center" onMouseUp={deFocusItem}>
            <div
                className="relative"
                onMouseMove={(e) => {
                    const canvas = optionalFromNull(document.getElementById('canvas'));
                    F.pipe(
                        canvas,
                        O.map((canvas) => {
                            const box = canvas.getBoundingClientRect();
                            const position = point(e.clientX - box.left, e.clientY - box.top);
                            console.log(JSON.stringify(box, null, 4));
                            mouseMoveHandler({
                                position,
                                width: 0,
                                height: 0,
                            });
                            return canvas;
                        }),
                    )
                }}>
                {
                    Object.entries(state.items).map(([key, node]) => {
                        return (
                            <div key={key} className="absolute" style={{top: node.position.y, left: node.position.x}}>
                                <Node
                                    id={node.id}
                                    title={node.name}
                                    onMouseDown={focusItem(node.id)}
                                    rename={renameItem(node.id)}
                                    remove={removeItem(node.id)}
                                />
                            </div>
                        );
                    })
                }
                <div className="absolute bottom-10 left-10">
                    <h3 className="text-grey-800 text-lg">Position:</h3>
                    <p className="text-grey-600">x: {state.mousePosition.x}</p>
                    <p className="text-grey-600">y: {state.mousePosition.y}</p>
                </div>
                {
                    state.state === StateActionType.DEFAULT ? (
                        <div className="absolute bottom-10 right-10 bg-green-200 p-2 rounded-full">
                            <button onClick={setToAddItem} className="bg-green-300 text-green-600 p-2 rounded-full flex items-center justify-center">
                                <Add />
                            </button>
                        </div>
                    ) : (
                        <div className="absolute bottom-10 right-10 bg-green-300 p-2 rounded-full">
                            <button onClick={setToAddItem} className="bg-green-200 text-green-400 p-2 rounded-full flex items-center justify-center">
                                <Add />
                            </button>
                        </div>
                    )
                }
                <Canvas items={[]} onClick={addItem} onMouseMove={() => {}} />
            </div>
        </div>
    );
}

export type MapEntry = <T>(f: (x: T) => T) => (entry: [string, T]) => [string, T];
export const mapEntry: MapEntry = f => entry => [entry[0], f(entry[1])];

export interface BooleanState {
    isTrue: boolean;
    isFalse: boolean;
    toTrue: () => void,
    toFalse: () => void,
    toggle: () => void,
    set: (value: boolean) => void,
}

export const useBooleanState = (initialValue: boolean): BooleanState => {
    const [state, set] = React.useState<boolean>(initialValue);
    return {
        isTrue: state,
        isFalse: !state,
        toTrue: () => set(true),
        toFalse: () => set(false),
        toggle: () => set(prev => !prev),
        set: set,
    }
};

export interface NodeProps {
    id: string;
    title: string;
    onMouseDown: () => void;
    rename: (name: string) => void;
    remove: () => void;
}
export const Node: React.FC<NodeProps> = (props) => {
    const extensionState = useBooleanState(false);
    return (
        <div id={props.id} className="bg-green-300 text-green-600 rounded-md shadow-sm py-2 px-4 space-y-2">
            <div className="flex items-center space-x-2">
                <button onMouseDown={props.onMouseDown}>
                    <Dots className="h-6 w-6 cursor-move" />
                </button>
                <input
                    className="appearance-none rounded-sm py-1 px-2 text-green-600 bg-green-100 whitespace-nowrap overflow-ellipsis"
                    type="text"
                    value={props.title}
                    onChange={e => props.rename(e.target.value)}
                />
                <button className="cursor-pointer" onMouseDown={extensionState.toggle}>
                    {
                        extensionState.isTrue ? (
                            <ArrowDown className="h-6 w-6" />
                        ) : (
                            <ArrowLeft className="h-6 w-6" />
                        )
                    }
                </button>
            </div>
            {
                extensionState.isTrue && (
                    <NodeBody
                        remove={props.remove}
                    />
                )
            }
        </div>
    );
};

export interface NodeBodyProps {
    remove: () => void,
}

export const NodeBody: React.FC<NodeBodyProps> = (props) => (
    <>
        <div className="grid grid-col-3 gap-2">
            {

            }
        </div>
        <div className="flex justify-end">
            <button className="flex items-center space-x-2 cursor-pointer" onMouseDown={props.remove}>
                <Close className="h-6 w-6" />
                <span>Remove Node</span>
            </button>
        </div>
    </>
)

export interface IconProps {
    className?: string;
}

export const Dots: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

export const Close: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const Add: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const ArrowLeft: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export const ArrowDown: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export interface CanvasItem {
    position: Point;
    width: number;
    height: number;
}

export interface CanvasProps {
    items: Array<CanvasItem>;
    onClick: (measures: MouseEventMeasures) => void;
    onMouseMove: (measures: MouseEventMeasures) => void;
}
export const Canvas: React.FC<CanvasProps> = (props) => {
    React.useEffect(() => {
        const canvas = optionalFromNull(document.getElementById('canvas'));
        F.pipe(
            canvas,
            O.map((canvas) => {
                // canvas.addEventListener('mousemove', (e: MouseEvent) => props.onMouseMove(point(e.offsetX, e.offsetY)));
                canvas.addEventListener('mousedown', (e: MouseEvent) => props.onClick({
                    position: point(e.offsetX, e.offsetY),
                    width: 0,
                    height: 0,
                }));
                return canvas;
            }),
        );
        // eslint-disable-next-line
    }, []);
    return (<canvas id="canvas" className="bg-grey-50 ptn-ppr border-2 border-grey-300 rounded-md" width={800} height={600} />);
}

export type RenderCanvasItems = (ctx: CanvasRenderingContext2D) => (items: Array<CanvasItem>) => void;
export const renderCanvasItems: RenderCanvasItems = ctx => items => {
    items.forEach((canvasItem) => {
        const ring = new Path2D(SVGRect.rect({
            width: canvasItem.width,
            height: canvasItem.height,
            borderRadius: 15,
        })(canvasItem.position));
        stroke(ctx)({
            color: '#10B981',
            width: 4,
        })(ring);
    });
};

export type OptionalFromNull = <T>(x: T | null) => O.Option<T>;
export const optionalFromNull: OptionalFromNull = x => (x === null) ? O.none : O.some(x);
