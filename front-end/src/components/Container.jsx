import React, { useState } from 'react';
import Whiteboard from './Whiteboard';

const Container = () => {
    const [colour, setColour] = useState('#000000');
    const [size, setSize] = useState('5');
    const [clearCanvas, setClearCanvas] = useState(false);

    const changeColour = (params) => {
        setColour(params.target.value)
    };
    
    const changeSize = (params) => {
        setSize(params.target.value)
    }

    return (
        <div className="container">
            <div className="tools-section">
                <div className="colour-picker-container">
                    Select Brush Color : &nbsp; 
                    <input type="color" value={colour} onChange={changeColour}/>
                </div>

                <div className="brushsize-container">
                    Select Brush Size : &nbsp; 
                    <select value={size} onChange={changeSize}>
                        <option> 5 </option>
                        <option> 10 </option>
                        <option> 15 </option>
                        <option> 20 </option>
                        <option> 25 </option>
                        <option> 30 </option>
                    </select>
                </div>
                {/* <button onClick={() => setClearCanvas(true)}>Clear Canvas</button> */}
            </div>
            <div className="board-container">
                <Whiteboard
                    clearCanvas={clearCanvas}
                    colour={colour}
                    setClearCanvas={setClearCanvas}
                    size={size} 
                />
            </div>
        </div>
    )
}

export default Container;