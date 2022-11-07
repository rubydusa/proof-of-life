import { createContext } from "react";

const CIRCUIT_PATH = "snark/Main3N8x8";
const ROW_COUNT = 8;
const COL_COUNT = 8;
const GRID_SETTINGS = { rowCount: ROW_COUNT, colCount: COL_COUNT };

const GlobalContext = createContext({
    CIRCUIT_PATH,
    ROW_COUNT,
    COL_COUNT,
    GRID_SETTINGS,
});

export default GlobalContext;
