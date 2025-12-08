(function () {
    const STORAGE_KEY = 'navarraGameState_v1';

    // Nodos del itinerario (solo para el mapa visual y posible lógica de desbloqueo)
    const NODES = [
        { id: 'relacion', orden: 1, label: '1. Relación con IP / residente', avatar: 'nuria_sara' },
        { id: 'pico', orden: 2, label: '2. Pregunta PICO y bibliografía', avatar: 'ibai' },
        { id: 'diseno', orden: 3, label: '3. Diseño metodológico', avatar: 'julian' },
        { id: 'etica', orden: 4, label: '4. Comité de ética (CEIm)', avatar: 'javier' },
        { id: 'datos', orden: 5, label: '5. Solicitud y extracción de datos', avatar: 'unidad_datos' },
        { id: 'analisis', orden: 6, label: '6. Análisis y gestión de datos', avatar: 'jose' },
        { id: 'difusion', orden: 7, label: '7. Publicación y difusión', avatar: null }
    ];

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                // Estado inicial: solo el primer nodo desbloqueado
                return {
                    unlockedNodes: ['relacion'],
                    visitedNodes: []
                };
            }
            return JSON.parse(raw);
        } catch (e) {
            return {
                unlockedNodes: ['relacion'],
                visitedNodes: []
            };
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            // Si localStorage falla, seguimos sin romper el juego
        }
    }

    function isNodeUnlocked(nodeId) {
        const state = loadState();
        return state.unlockedNodes.includes(nodeId);
    }

    function unlockNode(nodeId) {
        const state = loadState();
        if (!state.unlockedNodes.includes(nodeId)) {
            state.unlockedNodes.push(nodeId);
            saveState(state);
        }
    }

    function markNodeVisited(nodeId) {
        const state = loadState();
        if (!state.visitedNodes.includes(nodeId)) {
            state.visitedNodes.push(nodeId);
            saveState(state);
        }
    }

    // --- Carga de preguntas de avatares ---

    const QUESTIONS_URL = 'data/questions.json';
    let questionsCache = null;

    function loadQuestions() {
        if (questionsCache) {
            return Promise.resolve(questionsCache);
        }
        return fetch(QUESTIONS_URL)
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
                questionsCache = data;
                return data;
            })
            .catch(function () {
                return {};
            });
    }

    // --- Render del mapa central ---

    function renderMapa() {
        const container = document.getElementById('nodesGrid');
        if (!container) return;

        const state = loadState();

        // Ordenamos por campo "orden"
        const nodes = NODES.slice().sort(function (a, b) {
            return a.orden - b.orden;
        });

        container.innerHTML = '';

        nodes.forEach(function (node) {
            const unlocked = state.unlockedNodes.includes(node.id);
            const visited = state.visitedNodes.includes(node.id);

            const card = document.createElement('div');
            card.className = 'node-card';
            if (!unlocked) {
                card.className += ' node-card--locked';
            } else if (visited) {
                card.className += ' node-card--visited';
            }

            const title = document.createElement('h2');
            title.textContent = node.label;
            card.appendChild(title);

            const body = document.createElement('p');
            if (!unlocked) {
                body.textContent = 'Bloqueado. Llega aquí resolviendo los pasos previos del caso.';
            } else if (node.avatar) {
                body.textContent = 'Puedes consultar dudas a los avatares de esta fase.';
            } else {
                body.textContent = 'Fase de cierre: conecta el caso con la difusión de resultados.';
            }
            card.appendChild(body);

            if (unlocked) {
                const link = document.createElement('a');
                if (node.avatar) {
                    link.href = 'avatares/' + node.avatar + '.html';
                    link.textContent = 'Hablar con el avatar →';
                } else {
                    // De momento, apuntamos a la pista final existente
                    link.href = 'pistas/final/FIN_M01.html';
                    link.textContent = 'Ir al cierre y discusión →';
                }
                link.className = 'node-card__link';
                card.appendChild(link);
            }

            container.appendChild(card);
        });
    }

    // --- Render de una página de avatar ---

    function renderAvatar(avatarId, options) {
        options = options || {};
        const nodeId = options.nodeId || null;

        const questionsContainer = document.getElementById('questionsContainer');
        const answerContainer = document.getElementById('answerContainer');

        if (!questionsContainer || !answerContainer) return;

        loadQuestions().then(function (all) {
            const list = all[avatarId] || [];

            if (!list.length) {
                questionsContainer.innerHTML = '<p>No hay preguntas configuradas todavía para este avatar.</p>';
                return;
            }

            const ul = document.createElement('ul');
            ul.className = 'avatar-questions';

            list.forEach(function (q) {
                const li = document.createElement('li');
                const btn = document.createElement('button');

                btn.textContent = q.text;
                btn.className = 'avatar-question-button';

                btn.addEventListener('click', function () {
                    // Respuesta escrita
                    var html = '<p>' + (q.answer || 'Respuesta no configurada.') + '</p>';

                    // Si la pregunta conduce a un puzzle/pista, lo mostramos
                    if (q.leads_to) {
                        html += '<p style="margin-top:1rem;">' +
                            '<a href="' + q.leads_to + '">Ir al siguiente paso del caso →</a>' +
                            '</p>';
                    } else {
                        html += '<p style="margin-top:1rem; font-style:italic;">' +
                            'Esta pregunta te ayuda a entender el contexto, pero no cambia el siguiente nodo del caso.' +
                            '</p>';
                    }

                    answerContainer.innerHTML = html;

                    // Si esta pregunta "desbloquea" un nodo siguiente, lo marcamos
                    if (q.unlocks_node) {
                        unlockNode(q.unlocks_node);
                    }

                    if (nodeId) {
                        markNodeVisited(nodeId);
                    }
                });

                li.appendChild(btn);
                ul.appendChild(li);
            });

            questionsContainer.innerHTML = '';
            questionsContainer.appendChild(ul);
            answerContainer.innerHTML = '<p>Elige qué preguntar al avatar.</p>';
        });
    }

    // Exponemos funciones globales mínimas
    window.GameEngine = {
        loadState: loadState,
        saveState: saveState,
        isNodeUnlocked: isNodeUnlocked,
        unlockNode: unlockNode,
        markNodeVisited: markNodeVisited,
        renderMapa: renderMapa,
        renderAvatar: renderAvatar,
        NODES: NODES
    };
})();
