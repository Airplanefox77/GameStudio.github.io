document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Initial setup
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Placeholder for game physics
    function update() {
        // Basic game loop
        requestAnimationFrame(update);
    }

    update();
});

function executeCode() {
    const code = document.getElementById('codeArea').value;
    try {
        new Function(code)();
    } catch (error) {
        console.error('Error in user code: ', error);
        appendToConsole(`Error: ${error.message}`);
    }
}

function setMode(mode) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    if (mode === 'topDown') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00FF00';  // Example color for top-down
        ctx.fillRect(50, 50, 100, 100);  // Example object for top-down view
    } else if (mode === 'sideView') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FF0000';  // Example color for side view
        ctx.fillRect(50, 50, 100, 100);  // Example object for side view
    }
}

function appendToConsole(message) {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML += `<div>${message}</div>`;
}

function startDrag(event) {
    startX = event.offsetX;
    startY = event.offsetY;
    isDragging = true;
}

function drag(event) {
    if (isDragging) {
        const dx = event.offsetX - startX;
        const dy = event.offsetY - startY;
        ctx.translate(dx, dy);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        importAssets(); // Redraw assets in new positions
        startX = event.offsetX;
        startY = event.offsetY;
    }
}

function endDrag() {
    isDragging = false;
}
