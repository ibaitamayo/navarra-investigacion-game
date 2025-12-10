document.addEventListener("DOMContentLoaded", () => {

    // STEP 1 → STEP 2
    document.getElementById("next1").onclick = () => {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";
    };

    // STEP 2 → STEP 3
    document.getElementById("next2").onclick = () => {
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";
    };

    // STEP 3 → FINAL
    const continueDiv = document.getElementById("continueDiv");
    const btn = document.createElement("a");
    btn.textContent = "Volver al mapa →";
    btn.href = "mapa.html";
    btn.className = "primary-button";
    continueDiv.appendChild(btn);

    // Unlock final node
    if (window.GameEngine && typeof GameEngine.unlockNode === "function") {
        GameEngine.unlockNode("difusion");
    }
});
