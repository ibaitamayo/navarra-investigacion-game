document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reconstruccionForm');
    const button = document.getElementById('checkReconstruccion');
    const feedback = document.getElementById('feedback');
    const codigo = document.getElementById('codigo');
    const continuar = document.getElementById('continuar');

    const correctSet = [
        'nota_reunion',
        'aviso_datos',
        'envio_etico_correcto',
        'parametros_modificados',
        'dudas_validez'
    ];

    const forbidden = [
        'residente_hacker',
        'desaparicion_castigo'
    ];

    const setEquals = (a, b) =>
        a.length === b.length && a.every(v => b.includes(v));

    button.addEventListener('click', () => {
        const checked = Array.from(
            form.querySelectorAll('input[type="checkbox"]:checked')
        ).map(input => input.value);

        feedback.classList.remove('success', 'error');
        codigo.innerHTML = '';
        continuar.innerHTML = '';

        // Si marcan alguna afirmación no respaldada, error directo
        if (checked.some(v => forbidden.includes(v))) {
            feedback.innerHTML = `
                Algunas de las afirmaciones marcadas no están apoyadas por las pistas del juego.<br>
                Vuelve sobre las notas, los metadatos y la extracción de datos: 
                diferencia entre lo que <strong>sabes</strong> y lo que solo <strong>imaginas</strong>.
            `;
            feedback.classList.add('error');
            return;
        }

        if (setEquals(checked, correctSet)) {
            feedback.innerHTML = `
                Has reconstruido correctamente lo que podemos afirmar con las evidencias disponibles.<br>
                El resto sigue siendo materia de hipótesis y debe discutirse con prudencia.
            `;
            feedback.classList.add('success');

            codigo.innerHTML = "<p><strong>Código final desbloqueado: FIN12</strong></p>";

            continuar.innerHTML = `
                <a href="pistas/final/FIN_M01.html"
                   style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
                    Ver desenlace y guía para la discusión →
                </a>
            `;
        } else {
            feedback.innerHTML = `
                Te falta alguna pieza o te dejas fuera una conclusión respaldada por las pistas.<br>
                Revisa especialmente la nota manuscrita, el aviso sobre los datos, los metadatos del envío ético
                y las trazas de la extracción.
            `;
            feedback.classList.add('error');
        }
    });
});
