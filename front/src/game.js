import produce from "immer";

const mod = (n, m) => {
    return ((n % m) + m) % m;
}

const gridDims = (grid) => {
    return {
        rowCount: grid.length,
        colCount: grid.length > 0 ? grid[0].length : 0,
    }
}

export const emptyGrid = ({rowCount, colCount}) => {
    return [...Array(rowCount).keys()].map(() => [...Array(colCount).keys()].map(() => 0));
}
  
export const flipCell = (grid, x, y) => {
    return produce(grid, gridCopy => {
        gridCopy[y][x] = grid[y][x] ? 0 : 1;
    });
}

export const runSimulationStep = (grid) => {
    return produce(grid, gridCopy => {
        const { rowCount, colCount } = gridDims(grid);
        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < colCount; x++) {
                let sum = 0;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        sum += grid[mod(y + i, rowCount)][mod(x + j, colCount)];
                    }
                }

                const willLive = grid[y][x] ? sum === 3 || sum === 4 : sum === 3;
                gridCopy[y][x] = willLive ? 1 : 0;
            }
        }
    });
}