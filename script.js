document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('container');
    const changeSizeBtn = document.getElementById('resizeBtn');
    if (!container) return;

    const CONTAINER_WIDTH_PX = 450; // total drawing area width
    const MAX_SQUARES = 100; // safety limit

    function getRandomRgbColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `rgb(${red}, ${green}, ${blue})`;
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
            cell.addEventListener('click', () => {
                cell.style.backgroundColor = getRandomRgbColor();
            });
            container.appendChild(cell);
        }
    }

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