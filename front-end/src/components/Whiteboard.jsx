/* eslint-disable no-multi-str */
import React, { useEffect } from 'react';
import io from 'socket.io-client';

const Whiteboard = ({ clearCanvas, colour, erase, grid, setClearCanvas, size }) => {
    let timeout;
    let isDrawing = false;
    const socket = io.connect('http://localhost:5000');

    const drawGrid = () => {
        const canvas = document.querySelector('#grid');
        const ctx = canvas.getContext('2d');
        const sketch = document.querySelector('#sketch');
        const sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        const data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
            <defs> \
                <pattern id="smallGrid" width="24.5" height="24.5" patternUnits="userSpaceOnUse"> \
                    <path d="M 24.5 0 L 0 0 0 24.5" fill="none" stroke="gray" stroke-width="0.5" /> \
                </pattern> \
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
                    <rect width="80" height="80" fill="url(#smallGrid)" /> \
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" /> \
                </pattern> \
            </defs> \
            <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
        </svg>';
    
        const DOMURL = window.URL || window.webkitURL || window;
        
        const img = new Image();
        const svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        const url = DOMURL.createObjectURL(svg);
        
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);
        }
        img.src = url;

        // if(timeout != undefined) clearTimeout(timeout);
        //     timeout = setTimeout(function(){
        //         const base64ImageData = canvas.toDataURL("image/png");
        //         socket.emit("canvas-grid", base64ImageData);
        // }, 1000)
        const base64ImageData = canvas.toDataURL("image/png");
        socket.emit("canvas-grid", base64ImageData);
    }

    socket.on("canvas-data", function(data){
        const interval = setInterval(function(){
            if(isDrawing) return;
            isDrawing = true;
            clearInterval(interval);
            const image = new Image();
            const canvas = document.querySelector('#whiteboard');
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = colour;
            ctx.lineWidth = size;
            image.onload = function() {
                ctx.drawImage(image, 0, 0);
                isDrawing = false;
            };
            image.src = data;
        }, 200)
    })

    const resetCanvas = () => {
        const canvas = document.querySelector('#whiteboard');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        if(timeout != undefined) clearTimeout(timeout);
        // timeout = setTimeout(function(){
        //     const base64ImageData = canvas.toDataURL("image/png");
        //     socket.emit("canvas-clear", base64ImageData);
        // }, 1000)
        const base64ImageData = canvas.toDataURL("image/png");
        socket.emit("canvas-clear", base64ImageData);
    }

    socket.on("canvas-clear", function(data) {
        const interval = setInterval(function(){
            if(isDrawing) return;
            isDrawing = true;
            clearInterval(interval);
            const image = new Image();
            const canvas = document.querySelector('#whiteboard');
            const ctx = canvas.getContext('2d');
            // image.onload = function() {
            //     ctx.clearRect(0, 0, canvas.width, canvas.height); 
            //     isDrawing = false;
            // };
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            isDrawing = false;
            image.src = data;
        }, 200)
    });

    const drawOnCanvas = () => {
        const canvas = document.querySelector('#whiteboard');
        const ctx = canvas.getContext('2d');
        const sketch = document.querySelector('#sketch');
        const sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        let mouse = {x: 0, y: 0};
        let last_mouse = {x: 0, y: 0};

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);

        /* Drawing on Paint App */
        ctx.lineWidth = size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = colour;

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        const onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if(timeout != undefined) clearTimeout(timeout);
            // timeout = setTimeout(function(){
            //     const base64ImageData = canvas.toDataURL("image/png");
            //     socket.emit("canvas-data", base64ImageData);
            // }, 1000)
            const base64ImageData = canvas.toDataURL("image/png");
            socket.emit("canvas-data", base64ImageData);
        };
    }

    const eraserMode = () => {
        const canvas = document.querySelector('#whiteboard');
        const ctx = canvas.getContext('2d');
        // ctx.globalCompositeOperation = 'destination-out';
        // ctx.lineWidth = 10;
        if(timeout != undefined) clearTimeout(timeout);
        // timeout = setTimeout(function(){
        //     const base64ImageData = canvas.toDataURL("image/png");
        //     socket.emit("canvas-eraser", base64ImageData);
        // }, 1000)
        const base64ImageData = canvas.toDataURL("image/png");
        socket.emit("canvas-eraser", base64ImageData);
    }

    socket.on("canvas-eraser", function(data) {
        const interval = setInterval(function(){
            if(isDrawing) return;
            isDrawing = true;
            clearInterval(interval);
            const image = new Image();
            const canvas = document.querySelector('#whiteboard');
            const ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = 'destination-out';
            image.onload = function() {
                isDrawing = false;
            };
            image.src = data;
        }, 200)     
    });

    socket.on("canvas-grid", function(data) {
        const interval = setInterval(function(){
            if(isDrawing) return;
            isDrawing = true;
            clearInterval(interval);
            const image = new Image();
            const canvas = document.querySelector('#whiteboard');
            const ctx = canvas.getContext('2d');
            image.onload = function() {
                ctx.drawImage(image, 0, 0);
                isDrawing = false;
            };
            image.src = data;
        }, 200)    
    });

    useEffect(() => {
        drawOnCanvas();
        drawGrid();
    }, []);

    useEffect(() => {
        resetCanvas();
        setClearCanvas(false);
    }, [clearCanvas === true]);

    useEffect(() => {
        if (erase === true) {
            drawOnCanvas();
            eraserMode();
        } else {
            drawOnCanvas();
        }
    }, [erase]);
    
    return (
        <>
            <div className="sketch" id="sketch">
                <canvas className={grid ? 'whiteboard-grid': 'whiteboard-top'} id="whiteboard" />
                <canvas className="whiteboard-back" id="grid" />
            </div>
        </>
    )
};

export default Whiteboard;