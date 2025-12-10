document.addEventListener("DOMContentLoaded", () => {

    const total = 1000;
    const truePos = 1;
    const falsePos = 10;

    function drawPoints(ctx, highlightRed = [], highlightOrange = [], fadeOthers = false) {
        ctx.clearRect(0, 0, 500, 500);

        for (let i = 0; i < total; i++) {
            const x = Math.random() * 500;
            const y = Math.random() * 500;

            let color = "black";
            let alpha = 1.0;

            if (highlightRed.includes(i)) color = "red";
            if (highlightOrange.includes(i)) color = "orange";

            if (fadeOthers && !highlightRed.includes(i) && !highlightOrange.includes(i)) {
                alpha = 0.12;
            }

            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    // STEP 1
    const canvas1 = document.getElementById("canvas1");
    const ctx1 = canvas1.getContext("2d");
    drawPoints(ctx1, [0], [], false);

    document.getElementById("next1").onclick = () => {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";
    };

    // STEP 2
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");
    drawPoints(ctx2, [0], Array.from({length:falsePos}, (_,i)=>i+1), false);

    document.getElementById("next2").onclick = () => {
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";
    };

    // STEP 3
    const canvas3 = document.getElementById("canvas3");
    const ctx3 = canvas3.getContext("2d");
    drawPoints(
        ctx3,
        [0],
        Array.from({length:falsePos}, (_,i)=>i+1),
        true
    );

    // UNLOCK FINAL NODE AND BUTTON
    const continueDiv = document.getElementById("continueDiv");
    const btn = document.createElement("a");
    btn.textContent = "Volver al mapa →";
    btn.href = "mapa.html";
    btn.className = "primary-button";

    continueDiv.appendChild(btn);

    if (window.GameEngine && typeof GameEngine.unlockNode === "function") {
        GameEngine.unlockNode("difusion");
    }
});
