document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("submitPICO");
    const feedback = document.getElementById("feedback");
    const code = document.getElementById("code");
    const continuar = document.getElementById("continuar");

    btn.addEventListener("click", () => {
        const I = document.getElementById("inputI").value.trim();
        const C = document.getElementById("inputC").value.trim();
        const O = document.querySelector("input[name='outcome']:checked");

        if (!I || !C || !O) {
            feedback.textContent = "Completa los campos I, C y selecciona un O.";
            return;
        }

        feedback.innerHTML = `
            PICO ensamblado. El residente estaba intentando formular su pregunta correctamente,
            pero dejó partes sin revisar.
        `;

        code.innerHTML = "<p><strong>Código desbloqueado: IB47</strong></p>";

        continuar.innerHTML = `
            <a href="pistas/nuria_sara/NS_A3.html"
               style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
               Continuar →
            </a>`;
    });
});
