import React, { useState } from 'react';
import Whiteboard from './Whiteboard';
import Modal from './Modal/Modal';

const Container = () => {
    const [colour, setColour] = useState('#000000');
    const [size, setSize] = useState('5');
    const [erase, setErase] = useState(false);
    const [clearCanvas, setClearCanvas] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [gridMode, setGridMode] = useState(false);

    const changeColour = (params) => {
        setColour(params.target.value)
    };
    
    const changeSize = (params) => {
        setSize(params.target.value)
    }

    const handleModalClick = () => {
        setShowModal(false);
    }

    const handleModalConfirm = () => {
        setClearCanvas(true);
        setShowModal(false);
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
                <button className={erase ? "tools-btn-erase" : "tools-btn-off"} onClick={() => setErase(!erase)}>Eraser Mode {erase ? 'On' : 'Off'}</button>
                <button className={gridMode ? "tools-btn-erase" : "tools-btn-off"} onClick={() => setGridMode(true)}>Grid Mode {gridMode ? 'On' : 'Off'}</button>
                <button className="tools-btn-clear" onClick={() => setShowModal(true)}>Clear Canvas</button>
            </div>
            <div className="board-container">
                <Whiteboard
                    clearCanvas={clearCanvas}
                    erase={erase}
                    grid={gridMode}
                    colour={colour}
                    setClearCanvas={setClearCanvas}
                    size={size} 
                />
            </div>
            <Modal 
                confirm={handleModalConfirm}
                modalClosed={handleModalClick}
                show={showModal}
            />
        </div>
    )
}

export default Container;