document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("checkCEIM");
    const feedback = document.getElementById("feedback");
    const codigo = document.getElementById("codigo");
    const continuar = document.getElementById("continuar");

    // Documentos correctos
    const validSet = new Set([
        "prot_final",
        "justifica_ausencia",
        "compromiso_ip",
        "cv_ip"
    ]);

    btn.addEventListener("click", () => {

        const seleccionados = new Set(
            [...document.querySelectorAll("#ceim-form input[type='checkbox']:checked")]
                .map(cb => cb.value)
        );

        const isCorrect =
            seleccionados.size === validSet.size &&
            [...seleccionados].every(v => validSet.has(v));

        if (!isCorrect) {
            feedback.innerHTML = `
                <strong>El envío no sería aceptado por el CEIm.</strong><br>
                Revisa los documentos: algunos no son válidos o falta algo esencial.
            `;
            return;
        }

        feedback.innerHTML = `
            Correcto. El residente tenía preparado un envío ético válido.
            Pero hay un detalle extraño en los metadatos...
        `;

        // Desbloqueo equivalente al puzzle03.js
        if (window.GameEngine && typeof GameEngine.unlockQuestion === "function") {
            GameEngine.unlockQuestion("JDP1");
        }
        if (window.GameEngine && typeof GameEngine.unlockNode === "function") {
            GameEngine.unlockNode("datos");
        }


        continuar.innerHTML = `
            <a href="avatares/unidad_datos.html"
               style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
               Continuar →
            </a>
        `;
    });
});
