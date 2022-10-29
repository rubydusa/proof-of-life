import { useState } from "react";
import { emptyGrid, flipCell, runSimulationStep, gridToNum, numToGrid } from "./game";

import Grid from "./components/Grid";

const snarkjs = window.snarkjs;

const CIRCUIT_PATH = "snark/Main3N8x8";
const ROW_COUNT = 8;
const COL_COUNT = 8;
const GRID_SETTINGS = { rowCount: ROW_COUNT, colCount: COL_COUNT };

function App() {
  const [grid, setGrid] = useState(() => emptyGrid(GRID_SETTINGS));
  const [gridNum, setGridNum] = useState("0");

  const onCellClickHandler = ({x, y}) => {
    setGrid(() => flipCell(grid, x, y))
  }

  return (
    <>
      <button 
        onClick={() => {
          setGrid(g => runSimulationStep(g));
        }}>
          Next State
        </button>
        <button
          onClick={() => {
            setGrid(() => emptyGrid(GRID_SETTINGS))
          }}>
          Clear
      </button>
      <button
        onClick={() => {
          setGrid(() => numToGrid(gridNum, GRID_SETTINGS))
        }}>
        Load
      </button>
      <button
        onClick={() => {
          setGridNum(() => gridToNum(grid))
        }}>
        Save
      </button>
      <input
        type="text"
        value={gridNum}
        onChange={(e) => setGridNum(e.target.value)}
      />
      <div
      style={{
        width: "512px",
        height: "512px"
      }}>
        <Grid grid={grid} rowCount={ROW_COUNT} colCount={COL_COUNT} onClickHandler={onCellClickHandler}/>
      </div>
      <button 
        onClick={async () => {
          const { proof, publicSignals} = await snarkjs.groth16.fullProve(
            { data: [gridToNum(grid).toString()], address: "0"}, 
            `${CIRCUIT_PATH}.wasm`, 
            `${CIRCUIT_PATH}.zkey`
          );

          console.log({ proof, publicSignals });
        }}>
        Generate Proof!
      </button>
    </>
  );
}

export default App;
