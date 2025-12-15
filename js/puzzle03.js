document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("checkWald");
    const feedback = document.getElementById("feedback");
    const codigo = document.getElementById("codigo");
    const continuar = document.getElementById("continuar");

    btn.addEventListener("click", () => {
        const seleccion = document.querySelector("input[name='refuerzo']:checked");

        if (!seleccion) {
            feedback.textContent = "Selecciona una opción.";
            return;
        }

        if (seleccion.value === "mas") {
            feedback.innerHTML = `
                Esto es lo que pensaron inicialmente los ingenieros.  
                Pero esta interpretación olvida un detalle esencial...
            `;
        }

        if (seleccion.value === "menos") {
            feedback.innerHTML = `
                Correcto! EL problema del que se dió cuenta Wald, era de que los aviones que regresaban representaban solo una parte del total de los aviones. Solo estamos viendo a los aviones que esán lo suficientemente bien para volver a base.  
                Las zonas SIN puntos rojos implican que los aviones con impactos en esas zonas, no estaban lo suficientemente bien para poder regresaron a la base. Esas son las zonas que hay que proteger.
            `;
            if (window.GameEngine && typeof GameEngine.unlockQuestion === "function") {
    GameEngine.unlockQuestion("JL_P2");
}
            if (window.GameEngine && typeof GameEngine.unlockNode === "function") {
    GameEngine.unlockNode("diseno");
}
            document.dispatchEvent(new Event("waldPuzzleSolved"));

            continuar.innerHTML = `
                <a href="avatares/julian.html"
                   style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
                   Continuar con la investigación →
                </a>
            `;
        }

        if (seleccion.value === "ambas" || seleccion.value === "ninguna") {
            feedback.innerHTML = `
                Interesante, pero piensa de nuevo:  
                ¿qué información falta aquí?
            `;
        }
    });
});
