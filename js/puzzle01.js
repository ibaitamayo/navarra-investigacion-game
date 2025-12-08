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

        // Umbral: aceptamos respuestas entre 7 y 11
        if (valor >= 7 && valor <= 11) {
            feedback.textContent = "Correcto: la probabilidad real es aproximadamente del 9 %.";

        } else {
            feedback.textContent =
                "Respuesta registrada. La probabilidad real era aproximadamente del 9 %. Lo importante es entender cómo influye la prevalencia.";
        }

        // Código del juego (respuesta correcta → 9 → código A9)
        codigo.innerHTML = "<p><strong>Código desbloqueado: A9</strong></p>";

        // Botón para continuar
        continuar.innerHTML = `
            <a href="pistas/nuria_sara/NS01.html" style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
                Continuar con la investigación →
            </a>
        `;
    });
});
