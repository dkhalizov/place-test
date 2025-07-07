import { useCallback, useReducer } from 'react';
import { GRID_SIZE } from '../constants';

interface GridAction {
  type: 'UPDATE_CELL' | 'SET_GRID';
  x?: number;
  y?: number;
  colorIndex?: number;
  grid?: ArrayBuffer;
}

const gridReducer = (state: Uint8Array, action: GridAction): Uint8Array => {
    switch (action.type) {
        case 'UPDATE_CELL':
            if (action.x === undefined || action.y === undefined || action.colorIndex === undefined) {
                return state;
            }
            const updatedGrid = state.slice();
            const index = action.y * GRID_SIZE + action.x;
            updatedGrid[index] = action.colorIndex;
            return updatedGrid;
        case 'SET_GRID':
            if (!action.grid) {
                return state;
            }
            const uint8Array = new Uint8Array(action.grid);
            const unpackedGrid = new Uint8Array(GRID_SIZE * GRID_SIZE);

            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    const byteIndex = Math.floor((y * GRID_SIZE + x) / 2);
                    const isUpperNibble = x % 2 === 0;
                    const byte = uint8Array[byteIndex];

                    let color;
                    if (isUpperNibble) {
                        color = (byte & 0xF0) >> 4;
                    } else {
                        color = byte & 0x0F;
                    }

                    unpackedGrid[y * GRID_SIZE + x] = color;
                }
            }
            return unpackedGrid;
        default:
            return state;
    }
};

const useGrid = (): [Uint8Array, (newGrid: ArrayBuffer) => void, (x: number, y: number, colorIndex: number) => void] => {
    const [grid, dispatch] = useReducer(gridReducer, new Uint8Array(GRID_SIZE * GRID_SIZE));

    const updateGrid = useCallback((x: number, y: number, colorIndex: number) => {
        dispatch({ type: 'UPDATE_CELL', x, y, colorIndex });
    }, []);

    const setGrid = useCallback((newGrid: ArrayBuffer) => {
        dispatch({ type: 'SET_GRID', grid: newGrid });
    }, []);

    return [grid, setGrid, updateGrid];
};

export default useGrid;