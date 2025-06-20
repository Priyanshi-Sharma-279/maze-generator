import './StartGame.css'
import DarkMode from '../DarkMode/DarkMode';
import logo from '../imgs/logo.png'
import { useState } from 'react';
import Instructions from '../instructions/instructions'

const StartGame= ({toggle}) =>{
    const [showInstructions,setShowInstructions]=useState(false);
    return(
        <div className="Container">
            
            <div className= "App-header">
                <img src={logo} className='App-logo'/>
            
            
            <div className='title'>
            <h1>  MAZE GENERATOR</h1>
            
           
            <button onClick={toggle} className="button">Get Started</button>

            <button  className="rules" onClick={() => setShowInstructions(prev => !prev)}>Instructions</button>
             {showInstructions ? "Hide Rules" : "Show Rules"}

            <DarkMode/>
            
            </div>
           {showInstructions && <Instructions/>}
            </div>

        
        </div>
    )
}
export default  StartGame;
