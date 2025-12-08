document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('extraccionForm');
    const button = document.getElementById('checkExtraccion');
    const feedback = document.getElementById('feedback');
    const codigo = document.getElementById('codigo');
    const continuar = document.getElementById('continuar');

    button.addEventListener('click', () => {
        const checked = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
            .map(input => input.value);

        const correctSet = ['periodo', 'prevalentes', 'variables'];

        const setEquals = (a, b) =>
            a.length === b.length && a.every(v => b.includes(v));

        feedback.classList.remove('success', 'error');

        if (checked.includes('todo_correcto')) {
            feedback.textContent = 'Si todo fuera correcto, el residente no habría dudado de la extracción. Revisa de nuevo.';
            feedback.classList.add('error');
            codigo.innerHTML = '';
            continuar.innerHTML = '';
            return;
        }

        if (setEquals(checked, correctSet)) {
            feedback.innerHTML = `
                Correcto. La extracción presenta problemas claros en el periodo, 
                en la inclusión de casos prevalentes y en las variables disponibles 
                para medir el resultado principal.
            `;
            feedback.classList.add('success');

            codigo.innerHTML = "<p><strong>Código desbloqueado: JA90</strong></p>";

            continuar.innerHTML = `
                <a href="pistas/jose/JA_B09.html"
                   style="display:inline-block; margin-top:1rem; font-size:1.2rem;">
                    Continuar con la investigación →
                </a>
            `;
        } else {
            feedback.innerHTML = `
                Parece que has detectado parte del problema, pero no todo.<br>
                Vuelve a comparar la pregunta PICO con el tipo de pacientes, el periodo 
                y las variables disponibles en el extracto.
            `;
            feedback.classList.add('error');
            codigo.innerHTML = '';
            continuar.innerHTML = '';
        }
    });
});
