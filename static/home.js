'use strict';
/*jshint esversion: 6 */

const canvas = document.getElementById("main-canvas");
const context = canvas.getContext("2d");
let width;
let height;
const pixelWidth = 10;
const pixelHeight = 10;


const initialization = () => {
    canvas.addEventListener("click", clickHandler);
};

const clickHandler = (event) => {
    const xValue = Math.floor(event.offsetX / 10) * 10;
    const yValue = Math.floor(event.offsetY / 10) * 10;
    const hex = window.prompt("hex", "000000");
    console.log(xValue);
    submitPixel(xValue, yValue, hex);
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
                canvasCallback(json.canvas);
                pixelsCallback(json.pixels);
            }));
};

const drawOnPixel = (x, y, fill, hex) => {
    if (!fill) {
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
    context.stroke();
};

(function() {
    initialization();
    getExistingPixels(drawCanvas, drawExistingPixels);
})();