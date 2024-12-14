let selectedElement = null; // To keep track of the selected element

function uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
    };

    reader.readAsDataURL(file);
}

function loadGame() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const gameData = JSON.parse(e.target.result);
            document.getElementById('codeArea').value = gameData.code;
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            ctx.putImageData(new ImageData(new Uint8ClampedArray(gameData.canvas), canvas.width, canvas.height), 0, 0);
        };
        reader.readAsText(file);
    };
    input.click();
}

function saveGame() {
    const code = document.getElementById('codeArea').value;
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const gameData = {
        code: code,
        canvas: Array.from(imageData),
    };

    const blob = new Blob([JSON.stringify(gameData)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'game.json';
    link.click();
}

function addAsset(event) {
    const files = event.target.files;
    const assetsDiv = document.getElementById('assets');
    assetsDiv.innerHTML = ''; // Clear existing assets

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const asset = document.createElement('div');
                asset.className = 'asset';
                asset.style.backgroundImage = `url(${img.src})`;
                asset.style.width = '100px';
                asset.style.height = '100px';

                const initialScale = Math.min(100 / img.width, 100 / img.height);
                asset.style.backgroundSize = `${img.width * initialScale}px ${img.height * initialScale}px`;

                // Add text input for name
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.placeholder = 'Name this asset';

                asset.appendChild(nameInput);
                assetsDiv.appendChild(asset);

                // Show import button
                document.getElementById('importButton').style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    });
}

function importAssets() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const assets = document.querySelectorAll('#assets .asset');

    assets.forEach(asset => {
        const img = new Image();
        img.src = asset.style.backgroundImage.slice(5, -2); // Extract URL from background-image style
        img.onload = function() {
            const rect = asset.getBoundingClientRect();
            const scale = rect.width / img.width;
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.className = 'selected';
            imgElement.style.position = 'absolute';
            imgElement.style.width = `${img.width * scale}px`;
            imgElement.style.height = `${img.height * scale}px`;
            imgElement.style.left = `${rect.left}px`;
            imgElement.style.top = `${rect.top}px`;

            canvas.parentNode.appendChild(imgElement);

            // Follow cursor until click
            function followCursor(event) {
                imgElement.style.left = `${event.clientX - imgElement.offsetWidth / 2}px`;
                imgElement.style.top = `${event.clientY - imgElement.offsetHeight / 2}px`;
            }

            function placeElement(event) {
                imgElement.classList.remove('selected');
                canvas.parentNode.removeEventListener('mousemove', followCursor);
                canvas.parentNode.removeEventListener('click', placeElement);
                selectedElement = imgElement;
            }

            canvas.parentNode.addEventListener('mousemove', followCursor);
            canvas.parentNode.addEventListener('click', placeElement);

            // Right-click to add physics
            imgElement.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                const physics = confirm('Add physics to this model?');
                if (physics) {
                    // Placeholder for physics addition
                    alert('Physics added to this model.');
                }
            });
        };
    });

    // Hide import button after importing
    document.getElementById('importButton').style.display = 'none';
}

function runConsoleCode() {
    const code = document.getElementById('consoleInput').value;
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML = ''; // Clear previous output

    try {
        const result = eval(code);
        consoleOutput.innerHTML = `Output: ${result}`;
    } catch (error) {
        consoleOutput.innerHTML = `Error: ${error.message}`;
    }
}
