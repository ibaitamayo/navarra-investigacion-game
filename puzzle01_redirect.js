// Script extra para Puzzle 1 → Avatar Nuria+Sara
function finalizarPuzzle1() {
    // Desbloquear la pregunta inicial del circuito
    if (window.GameEngine && typeof GameEngine.unlockQuestion === 'function') {
        GameEngine.unlockQuestion('Q_CIRCUITO_GENERAL');
    }

    // Desbloquear el nodo relación por si hiciera falta
    if (window.GameEngine && typeof GameEngine.unlockNode === 'function') {
        GameEngine.unlockNode('relacion');
    }

    // Redirigir automáticamente al avatar Nuria+Sara
    window.location.href = "avatares/nuria_sara.html";
}
