import React, { useEffect } from 'react';
import io from 'socket.io-client';

const Whiteboard = ({ colour, size }) => {
    let timeout;
    let isDrawing = false;
    const socket = io.connect('http://localhost:5000');

    // useEffect(() => {
        
    // }, [colour, size]);
    

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
            timeout = setTimeout(function(){
                const base64ImageData = canvas.toDataURL("image/png");
                socket.emit("canvas-data", base64ImageData);
            }, 1000)
        };
    }

    useEffect(() => {
        drawOnCanvas();
    }, []);
    
    return (
        <div className="sketch" id="sketch">
            <canvas className="whiteboard" id="whiteboard" />
        </div>
    )
};

export default Whiteboard;