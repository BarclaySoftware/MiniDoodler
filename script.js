const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const tooltip = document.getElementById('tooltip');
const clearCanvasButton = document.getElementById('clearCanvas');
const saveDrawingButton = document.getElementById('saveDrawing');
const eraseModeButton = document.getElementById('eraseMode');

let eraseMode = false;

function resizeCanvas() {
    const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - toolbarHeight;
}

resizeCanvas();

let painting = false;

function startPosition(e) {
    painting = true;
    drawOrErase(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function drawOrErase(e) {
    if (!painting) return;

    if (eraseMode) {
        erase(e);
    } else {
        draw(e);
    }
}

function draw(e) {
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    const pos = getMousePos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function erase(e) {
    ctx.lineWidth = brushSize.value * 2;
    ctx.lineCap = 'round';
    const pos = getMousePos(e);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize.value, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left || e.touches[0].clientX - rect.left,
        y: e.clientY - rect.top || e.touches[0].clientY - rect.top
    };
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', drawOrErase);
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', drawOrErase);

brushSize.addEventListener('input', () => {
    tooltip.textContent = `${brushSize.value} px`;
    tooltip.style.display = 'block';
    const sliderRect = brushSize.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const thumbWidth = 40;
    const thumbOffset = ((brushSize.value - brushSize.min) / (brushSize.max - brushSize.min)) * (sliderWidth - thumbWidth);
    tooltip.style.left = `calc(${thumbOffset}px + 20px)`;
});

brushSize.addEventListener('mouseover', () => {
    tooltip.style.display = 'block';
});

brushSize.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
});

clearCanvasButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveDrawingButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});

eraseModeButton.addEventListener('click', () => {
    eraseMode = !eraseMode;
    if (eraseMode) {
        eraseModeButton.textContent = 'Draw';
    } else {
        eraseModeButton.textContent = 'Erase';
    }
});

window.addEventListener('resize', () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    resizeCanvas();
    ctx.putImageData(imageData, 0, 0);
 });
