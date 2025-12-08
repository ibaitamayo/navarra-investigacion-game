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
                Correcto. Las zonas sin impactos son las realmente vulnerables.  
                Los aviones que recibieron impactos ahí no regresaron a la base.
            `;
            codigo.innerHTML = "<p><strong>Código desbloqueado: JL82</strong></p>";

            continuar.innerHTML = `
                <a href="pistas/julian/JL_A17.html"
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
