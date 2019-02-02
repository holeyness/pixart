'use strict';
/*jshint esversion: 6 */

const canvas = document.getElementById("main-canvas");
const context = canvas.getContext("2d");
let takenPixels;
let width;
let height;
const pixelWidth = 7;
const pixelHeight = 7;

const initialization = () => {
    canvas.addEventListener("click", clickHandler);
};

const clickHandler = (event) => {
    const xValue = Math.floor(event.offsetX / pixelWidth);
    const yValue = Math.floor(event.offsetY / pixelHeight);
    const hex = window.prompt("hex", "FFFFFF");
    submitPixel(xValue, yValue, hex);
    drawOnPixel(xValue, yValue, true, hex);
};

const submitPixel = (x, y, hex) => {
    const options = {
        method: 'POST',
        headers: {
            'X-CSRFToken': window.csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'x': x, 'y': y, 'hex': hex})
    };

    fetch('/pixel/', options);
};

const getExistingPixels = (canvasCallback, pixelsCallback) => {
    const options = {
        method: 'GET'
    };

    fetch('/pixel/', options)
        .then(data => data.json()
            .then(json => {
                if (canvasCallback) {
                    canvasCallback(json.canvas);
                }
                if (pixelsCallback) {
                    pixelsCallback(json.pixels);
                }
            }));
};

const drawOnPixel = (x, y, fill, hex) => {
    if (!fill) {
        context.lineWidth = 0.2;
        context.rect(pixelWidth * x, pixelHeight * y, pixelWidth, pixelHeight);
    } else if (hex) {
        context.fillStyle = hex;
        context.fillRect(pixelWidth * x, pixelHeight * y, pixelWidth, pixelHeight);
    }
};

const drawCanvas = (canvas) => {
    width = canvas.width;
    height = canvas.height;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            drawOnPixel(i, j);
        }
    }

    context.stroke();
};

const drawExistingPixels = (pixels) => {
    pixels.map(pixel => {
        drawOnPixel(pixel.x, pixel.y, true, pixel.hex);
    });
};

(function() {
    initialization();
    getExistingPixels(drawCanvas, drawExistingPixels);
})();