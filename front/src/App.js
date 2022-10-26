import { useState } from "react";
import { emptyGrid, flipCell, runSimulationStep } from "./game";

import Grid from "./components/Grid";

const ROW_COUNT = 8;
const COL_COUNT = 8;

function App() {
  const [grid, setGrid] = useState(() => emptyGrid({ rowCount: ROW_COUNT, colCount: COL_COUNT }));

  const onCellClickHandler = ({x, y}) => {
    setGrid(g => flipCell(grid, x, y))
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
        setGrid(() => emptyGrid({ rowCount: ROW_COUNT, colCount: COL_COUNT}))
      }}>
        Clear
      </button>
      <div
      style={{
        width: "512px",
        height: "512px"
      }}>
        <Grid grid={grid} rowCount={ROW_COUNT} colCount={COL_COUNT} onClickHandler={onCellClickHandler}/>
      </div>
    </>
  );
}

export default App;
