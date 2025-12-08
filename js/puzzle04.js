document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("checkCEIM");
    const feedback = document.getElementById("feedback");
    const codigo = document.getElementById("codigo");
    const continuar = document.getElementById("continuar");

    // Documentos correctos
    const validSet = new Set([
        "prot_final",
        "hip",
        "ci",
        "dpd_eval",
        "registro"
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

        codigo.innerHTML = "<p><strong>Código desbloqueado: JG56</strong></p>";

        continuar.innerHTML = `
            <a href="pistas/javier/JG_R21.html"
               style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
               Continuar →
            </a>
        `;
    });
});
