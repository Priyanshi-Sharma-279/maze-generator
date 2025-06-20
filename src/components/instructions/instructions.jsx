import './instructions.css'

const Instructions=()=>{
  return(
    <div className="rules">
    <h2> How to Generate Your Own Maze </h2>
    <div className="text">
        <p>1.Single Click 🟩: Starting Point</p>
        <p>2.Double Click 🟥: End Point</p>
        <p>3.Triple Click ⬛️: Blocked Cell</p>
    </div>
    </div>
  ) 
   
}

export default Instructions;