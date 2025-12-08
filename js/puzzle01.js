document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("respuesta-form");
    const input = document.getElementById("respuesta");
    const feedback = document.getElementById("feedback");
    const codigo = document.getElementById("codigo");
    const continuar = document.getElementById("continuar");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const valor = parseFloat(input.value);

        if (isNaN(valor)) {
            feedback.textContent = "Introduce un número válido.";
            return;
        }

        // Feedback explicativo pero NO bloqueante
        if (valor >= 7 && valor <= 11) {
            feedback.textContent = "Correcto: la probabilidad real es ~9 %.";
        } else {
            feedback.innerHTML = `
                La probabilidad real era ~9 %.  
                <br>Tu respuesta: <strong>${valor}</strong>  
                <br><em>(Ej: ${valor}). Más adelante entenderás por qué esto sucede.</em>
            `;
        }

        // Código A9 (se muestra siempre)
        codigo.innerHTML = "<p><strong>Código desbloqueado: A9</strong></p>";

        // Enlace a NS01 (SIEMPRE disponible)
        continuar.innerHTML = `
            <a href="pistas/nuria_sara/NS01.html"
               style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
               Continuar con la investigación →
            </a>
        `;
    });
});
