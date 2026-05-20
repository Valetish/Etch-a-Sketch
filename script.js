document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    if (!container) return;

    const gridSize = 16; 
    const total = gridSize * gridSize;

    for (let i = 0; i < total; i++) {
        const sq = document.createElement("div");
        sq.className = "square";
        container.appendChild(sq);
    }
});