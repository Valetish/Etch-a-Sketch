document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('container');
    const changeSizeBtn = document.getElementById('resizeBtn');
    const rgbBtn = document.getElementById('rgbBtn');
    const colorBtn = document.getElementById('colorBtn');
    const eraseBtn = document.getElementById('eraseBtn');
    const colorPicker = document.getElementById('colorPicker');
    if (!container) return;

    const CONTAINER_WIDTH_PX = 450; // total drawing area width
    const MAX_SQUARES = 100; // safety limit
    let isPainting = false;
    let paintMode = 'rgb';
    let selectedColor = '#000000';

    function getRandomRgbColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    function getRandomRgbComponents() {
        return {
            red: Math.floor(Math.random() * 256),
            green: Math.floor(Math.random() * 256),
            blue: Math.floor(Math.random() * 256),
        };
    }

    function getRgbColorString(red, green, blue, factor = 1) {
        const nextRed = Math.max(0, Math.round(red * factor));
        const nextGreen = Math.max(0, Math.round(green * factor));
        const nextBlue = Math.max(0, Math.round(blue * factor));
        return `rgb(${nextRed}, ${nextGreen}, ${nextBlue})`;
    }

    function setActiveModeButtons() {
        [rgbBtn, colorBtn, eraseBtn].forEach((button) => {
            if (!button) return;
            button.classList.remove('active-mode');
        });

        if (paintMode === 'rgb' && rgbBtn) rgbBtn.classList.add('active-mode');
        if (paintMode === 'picked' && colorBtn) colorBtn.classList.add('active-mode');
        if (paintMode === 'erase' && eraseBtn) eraseBtn.classList.add('active-mode');
    }

    function setPaintMode(nextMode) {
        paintMode = nextMode;
        setActiveModeButtons();
    }

    function paintRgbCell(cell) {
        let baseRed = Number(cell.dataset.baseRed);
        let baseGreen = Number(cell.dataset.baseGreen);
        let baseBlue = Number(cell.dataset.baseBlue);

        if (Number.isNaN(baseRed) || Number.isNaN(baseGreen) || Number.isNaN(baseBlue)) {
            const baseColor = getRandomRgbComponents();
            baseRed = baseColor.red;
            baseGreen = baseColor.green;
            baseBlue = baseColor.blue;
            cell.dataset.baseRed = String(baseRed);
            cell.dataset.baseGreen = String(baseGreen);
            cell.dataset.baseBlue = String(baseBlue);
            cell.dataset.rgbHits = '0';
        }

        const hits = Number(cell.dataset.rgbHits || '0');
        if (hits >= 9) {
            cell.style.backgroundColor = '#000000';
            cell.dataset.rgbHits = '10';
            return;
        }

        cell.style.backgroundColor = getRgbColorString(baseRed, baseGreen, baseBlue, 1 - (hits * 0.1));
        cell.dataset.rgbHits = String(hits + 1);
    }

    function paintCell(cell) {
        if (paintMode === 'erase') {
            cell.style.backgroundColor = '#ffffff';
            cell.style.backgroundImage = 'none';
            cell.dataset.baseRed = '';
            cell.dataset.baseGreen = '';
            cell.dataset.baseBlue = '';
            cell.dataset.rgbHits = '';
            return;
        }

        if (paintMode === 'picked') {
            cell.style.backgroundColor = selectedColor;
            cell.style.backgroundImage = 'none';
            cell.dataset.baseRed = '';
            cell.dataset.baseGreen = '';
            cell.dataset.baseBlue = '';
            cell.dataset.rgbHits = '';
            return;
        }

        paintRgbCell(cell);
    }

    // set the fixed total width for the drawing area
    container.style.width = CONTAINER_WIDTH_PX + 'px';

    // create an n x n grid inside the container
    function makeGrid(n) {
        container.innerHTML = '';
        const total = n * n;
        for (let i = 0; i < total; i++) {
            const cell = document.createElement('div');
            cell.className = 'square';
            // each cell takes 1/n of the row width
            cell.style.flex = `0 0 calc(100% / ${n})`;
            cell.addEventListener('mousedown', () => {
                isPainting = true;
                paintCell(cell);
            });
            cell.addEventListener('mouseenter', () => {
                if (!isPainting) return;
                paintCell(cell);
            });
            container.appendChild(cell);
        }
    }

    window.addEventListener('mouseup', () => {
        isPainting = false;
    });

    container.addEventListener('mouseleave', () => {
        isPainting = false;
    });

    if (colorPicker) {
        selectedColor = colorPicker.value;
        colorPicker.addEventListener('input', () => {
            selectedColor = colorPicker.value;
        });
    }

    if (rgbBtn) {
        rgbBtn.addEventListener('click', () => setPaintMode('rgb'));
    }

    if (colorBtn) {
        colorBtn.addEventListener('click', () => setPaintMode('picked'));
    }

    if (eraseBtn) {
        eraseBtn.addEventListener('click', () => setPaintMode('erase'));
    }

    setActiveModeButtons();

    // initial grid
    makeGrid(16);

    // prompt the user and recreate the grid
    if (changeSizeBtn) {
        changeSizeBtn.addEventListener('click', () => {
            const answer = prompt(`Enter squares per side (1-${MAX_SQUARES}):`, '16');
            if (answer === null) return; // user cancelled
            const value = parseInt(answer, 10);
            if (Number.isNaN(value) || value < 1 || value > MAX_SQUARES) {
                alert(`Please enter a whole number between 1 and ${MAX_SQUARES}.`);
                return;
            }
            makeGrid(value);
        });
    }
});