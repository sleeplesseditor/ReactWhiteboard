import React from 'react';
import './Modal.scss';

const Backdrop = (props) => (
    props.show ? <div className='whiteboard-backdrop' onClick={props.clicked}></div> : null
)

const modal = ({ confirm, modalClosed, show }) => {
    return (
        <>
            <Backdrop show={show} clicked={modalClosed} />
            {show ? (
                <div className='whiteboard-modal'>
                    <div className="whiteboard-modal-title">
                        <h2>Clear Whiteboard</h2>
                    </div>
                    <p>This will erase the whiteboard for all users! Are you sure?</p>
                    <hr />
                    <div className="whiteboard-modal-btn-container">
                        <button className="whiteboard-modal-btn-confirm" onClick={confirm}>Confirm</button>
                        <button className="whiteboard-modal-btn-close" onClick={modalClosed}>Close</button>
                    </div>
                </div>
            ): null }
        </>
    );
};


export default modal;