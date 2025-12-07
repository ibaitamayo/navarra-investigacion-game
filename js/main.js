document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('pistas-container');

  fetch('data/pistas.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(\`Error HTTP: \${response.status}\`);
      }
      return response.json();
    })
    .then((pistas) => {
      if (!Array.isArray(pistas)) {
        throw new Error('El JSON de pistas no es un array');
      }

      if (!contenedor) {
        console.warn('No se ha encontrado el elemento #pistas-container en el HTML');
        console.log('Pistas cargadas:', pistas);
        return;
      }

      pistas.forEach((pista) => {
        const div = document.createElement('div');
        div.className = 'pista';

        div.innerHTML = `
          <h3>${pista.titulo ?? 'Pista sin título'}</h3>
          <p>${pista.descripcion ?? ''}</p>
          <p><strong>Nodo:</strong> ${pista.nodo ?? '-'}</p>
          <p><strong>Tipo:</strong> ${pista.tipo ?? '-'}</p>
        `;

        contenedor.appendChild(div);
      });
    })
    .catch((error) => {
      console.error('Error al cargar las pistas:', error);
    });
});
