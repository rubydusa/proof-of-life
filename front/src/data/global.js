import { createContext } from "react";

const CIRCUIT_PATH = "snark/Main3N8x8";
const ROW_COUNT = 8;
const COL_COUNT = 8;
const GRID_SETTINGS = { rowCount: ROW_COUNT, colCount: COL_COUNT };
const EXCEPTIONS = {
    SOLUTION_ALREADY_EXISTS: "execution reverted: GOLNFT: Solution already exists!"
}

const GlobalContext = createContext({
    CIRCUIT_PATH,
    ROW_COUNT,
    COL_COUNT,
    GRID_SETTINGS,
    EXCEPTIONS,
});

export default GlobalContext;
