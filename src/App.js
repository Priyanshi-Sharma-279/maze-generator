import MainPage from'./components/Mainpage/Mainpage'
import { useState } from 'react';
import StartGame from './components/StartGame/StartGame';

import './App.css';


function App() {
  
  const[isGameStarted,setIsGameStarted]=useState(false);

  const ToggleGamePlay =()=>{
    setIsGameStarted((prev) => !prev)
  }
  return (
    <>
    <div  className ="App-header">   
     {isGameStarted ? <MainPage/> : <StartGame toggle= {ToggleGamePlay}/>}
     
    </div> 
    <div> 
      
    </div>
    </>      

  );
}

export default App;
