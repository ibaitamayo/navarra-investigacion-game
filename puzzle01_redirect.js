// Script extra para Puzzle 1: solo desbloquea elementos, sin redirigir.
function finalizarPuzzle1() {
    // Garantizar que la pregunta de circuito general está desbloqueada
    if (window.GameEngine && typeof GameEngine.unlockQuestion === 'function') {
        GameEngine.unlockQuestion('Q_CIRCUITO_GENERAL');
    }

    // Garantizar que el nodo "relacion" está accesible
    if (window.GameEngine && typeof GameEngine.unlockNode === 'function') {
        GameEngine.unlockNode('relacion');
    }

    // IMPORTANTE: no redirigimos. La navegación la hace el jugador
    // mediante el enlace "Continuar" que ahora apunta a pistas/NS01.html.
}
