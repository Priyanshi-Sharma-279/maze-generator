import  { useState, useRef } from "react";
import Cube from "../MiniCube/MiniCube";
import "./Mainpage.css";
import { Button, Row,} from "react-bootstrap";
import DarkMode from "../DarkMode/DarkMode";

async function wait(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}

const createCubes = (numCols, numRows) => {
    const finalRes = [];
    for (let i = 0; i < numRows; i++) {
        let cols = [];
        for (let j = 0; j < numCols; j++) {
            cols.push(<Cube x={j} y={i} />);
        }
        finalRes.push(<Row >{cols}</Row>);

    }

    return finalRes;
}

const find = (vis, id) => {
    for (let i = 0; i < vis.length; i++) {
        if (vis[i] == id) {
            return true;
        }
    }
    return false;
}

const MainPage = () => {
  const [numCols, setNumCols] = useState(20);
  const [numRows, setNumRows] = useState(20);
  const [cubes, setCubes] = useState(null);
  const [showMazeOptions, setShowMazeOptions] = useState(false);
  const [waiting, setWaiting] = useState(0.05);
  const [mazeGenerated, setMazeGenerated] = useState(false);
  const [selectedCellType, setSelectedCellType] = useState(null);

  const isPausedRef = useRef(false);
  const [resetRequested, setResetRequested] = useState(false);


   const [startArr, setStartArr] = useState([]);
    const [goalArr, setGoalArr] = useState([]);
    const [blockArr, setBlockArr] = useState([]);


  let [counter, setCounter] = useState(0);
   const counterRef = useRef(0);

  const handleClick = () => {
    setShowMazeOptions((prev) => !prev);
    setMazeGenerated((prev) => !prev);
    
  };

  const GenerateMaze = () => (
    <div
      className="maze-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 22px)`,
        gridTemplateRows:`repeat(${numRows}, 22px)`,
        justifyContent: "center",
        gap: "5px",
      }}
    >
      {cubes}
    </div>
  );


  const handlePlay = () => {
    isPausedRef.current = false;
    setResetRequested(false);
  };

  const handlePause = () => {
    isPausedRef.current = true;
  };

  const handleReset = () => {
    isPausedRef.current = true;
    setResetRequested(true);
    counterRef.current = 0;
    setCounter(counterRef.current);
    startArr.length = 0;
    goalArr.length = 0;
    blockArr.length = 0;
  };

 const getStart = () => {
    startArr.length = 0;
    goalArr.length = 0;
    blockArr.length = 0;
    const start = document.getElementsByClassName("start");
    const goal = document.getElementsByClassName("goal");
    const block = document.getElementsByClassName("block");
    for (let i = 0; i < start.length; i++) {
        startArr.push(start[i].id);
    }
    for (let i = 0; i < goal.length; i++) {
        goalArr.push(goal[i].id);
    }
    for (let i = 0; i < block.length; i++) {
        blockArr.push(block[i].id);
    }
    }
  
  const bfs = async () => {
      let found = false;
      getStart();
      counterRef.current = 0;
      const q1 = [];
      for (let i = 0; i < startArr.length; i++) {
          q1.push(startArr[i]);
      }
      const vis = [];

      while (q1.length != 0) {
          const sz = q1.length;
           for (let i = 0; i < sz; i++) {
                while (isPausedRef.current) {
                    if (resetRequested) {
                        setCounter(counterRef.current);
                        return false;
                    }
                    await wait(waiting);
                }

                const id = q1.shift();
                const s = id.split(".");
                const r = Number(s[0]);
                const c = Number(s[1]);

                if (c >= numRows || r >= numCols || r < 0 || c < 0 || document.getElementById(id) == null || document.getElementById(id).classList.contains("block") || find(vis, id)) {
                    continue;
                }

                vis.push(id);
                const ele = document.getElementById(id);
                if (ele.classList.contains("goal")) {
                    alert("Found Goal");
                    found = true;
                    setCounter(counterRef.current);
                    return true
                }

                ele.style.backgroundColor = '#22c077';
                counterRef.current++;
                await wait(waiting)


                const up = (r - 1) + "." + c;
                const down = (r + 1) + "." + c;
                const left = r + "." + (c - 1);
                const right = r + "." + (c + 1);

                q1.push(up);
                q1.push(down);
                q1.push(left);
                q1.push(right);
            }

        }
        setCounter(counterRef.current);
        return found;
    }


  const dfs = async () => {
        counterRef.current = 0;
        getStart();
        let found = false;
        const s1 = [];
        for (let i = 0; i < startArr.length; i++) {
            s1.push(startArr[i]);
        }
        const vis = [];
        const dfs1 = async (r, c, id) => {
            while (isPausedRef.current) {
              if (resetRequested) {
                      setCounter(counterRef.current);
                      return false;
              }
              await wait(waiting);
            }
            if (found) return;
            if (r < 0 || c < 0 || r >= numCols || c >= numRows || document.getElementById(id) == null || document.getElementById(id).classList.contains("block") || find(vis, id)) {
                return;
            }
            vis.push(id);
            const ele = document.getElementById(id);
            if (ele.classList.contains("goal")) {
                ele.style.backgroundColor = "#22c077";
                alert("Found Goal");
                found = true;
                return;
            }
            ele.style.backgroundColor = "#22c077";
            counterRef.current++;
            await wait(waiting);
            await dfs1(r, c + 1, (r) + '.' + (c + 1));
            await dfs1(r, c - 1, (r) + '.' + (c - 1));
            await dfs1(r + 1, c, (r + 1) + '.' + (c));
            await dfs1(r - 1, c, (r - 1) + '.' + (c));
            return;
        }

        for (let i = 0; i < s1.length; i++) {
            const id = s1[i];
            const s = id.split(".");
            const r = Number(s[0]);
            const c = Number(s[1]);
            await dfs1(r, c, id);
        }
        setCounter(counterRef.current);
        return found;
    }
  const randomCreation = () => {
        const create = () => {
            const [rg, cg] = [Math.floor(Math.random() * numCols), Math.floor(Math.random() * numRows)];
            return [rg, cg];
        }


        const vis = [];
        const randomCreationNumber = Math.floor(numRows * numCols / 3);

        const [rs, cs] = [Math.floor(Math.random() * numCols), Math.floor(Math.random() * numRows)];
        vis.push(rs + "." + cs);
        let [rg, cg] = create();
        while (vis.includes(rg + "." + cg)) {
            [rg, cg] = create();
        }
        vis.push(rg + "." + cg);

        const start = document.getElementById(rs + "." + cs);
        start.classList.add("start");
        const goal = document.getElementById(rg + "." + cg);
        goal.classList.add("goal");

        let i = 2;

        while (i < randomCreationNumber) {
            let [r, c] = create();
            while (vis.includes(r + "." + c)) {
                [r, c] = create();
            }
            vis.push(r + "." + c);
            const ele = document.getElementById(r + "." + c);
            ele.classList.add("block");
            i++;

        }

    }
  return (
    <div className="bg">
      <h2>GENERATE YOUR OWN MAZE!!</h2>
      

      <div className="controls">
        <div className="options">
        <Button className="GenerateButton" onClick={handleClick}>
          GENERATE MAZE
        </Button>
        <DarkMode/>
        </div>

        {showMazeOptions && (
          <div className="maze-options">
            <input
              type="number"
              placeholder="Number of Rows"
              value={numRows}
              onChange={(e) => setNumRows(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Number of Columns"
              value={numCols}
              onChange={(e) => setNumCols(Number(e.target.value))}
            />
            <Button
              variant="primary"
              onClick={() => setCubes(createCubes(numCols, numRows))}
              className="create-btn"
            >
              Create
            </Button>
            <Button
              variant="primary"
              onClick={randomCreation}
              className="random-btn"
            >
              Random Creation
            </Button>
          </div>
        )}
      </div>

      <div>
        <GenerateMaze/>
      </div>

    

      {mazeGenerated && (
        <div className="side-panel">
          <div className="text">
            <h2>Solve the Maze?</h2>
          </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div className="solve-buttons">
            <Button variant="primary" className="bfs" onClick={bfs}>Breadth-First Search</Button>
            <Button variant="primary" className="dfs"onClick={dfs}>Depth-First Search</Button>
          </div>

          <div className="control-buttons">
            <Button variant="success" className="play" onClick={handlePlay}>▶️ Play</Button>
            <Button variant="warning" className="pause"  onClick={handlePause}>⏸️ Pause</Button>
            <Button variant="danger"  className="reset" onClick={handleReset}>🔁 Reset</Button>
            <h1 className="">moves: {counterRef.current}</h1>
          </div>
        </div>
          
        </div>
      )}
    </div>
  );
};

export default MainPage;