// js/codes.js

// Mapa inicial de códigos → páginas (lo rellenaremos después)
const CODE_MAP = {
    "NS01": "pistas/nuria_sara/NS01.html",
    "IB01": "pistas/ibai/IB01.html",
    "JL01": "pistas/julian/JL01.html",
    "JG01": "pistas/javier/JG01.html",
    "JA01": "pistas/arco/JA01.html"
};

// Función para limpiar y normalizar códigos
function normalizarCodigo(code) {
    return code
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/Á/g, "A")
        .replace(/É/g, "E")
        .replace(/Í/g, "I")
        .replace(/Ó/g, "O")
        .replace(/Ú/g, "U");
}

// Lógica principal
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("code-form");
    const input = document.getElementById("code-input");
    const message = document.getElementById("message");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const rawCode = input.value;
        const code = normalizarCodigo(rawCode);

        if (!code) {
            message.textContent = "Introduce un código.";
            return;
        }

        const target = CODE_MAP[code];

        if (!target) {
            message.textContent = "Código no reconocido.";
            return;
        }

        // Redirigir a la pista
        window.location.href = target;
    });
});
