(function () {
    const STORAGE_KEY = 'navarraGameState_v1';

    const NODES = [
        { id: 'relacion', orden: 1, label: '1. Relación IP / Residente', avatar: 'nuria_sara' },
        { id: 'pico', orden: 2, label: '2. Pregunta PICO y bibliografía', avatar: 'ibai' },
        { id: 'diseno', orden: 3, label: '3. Diseño metodológico', avatar: 'julian' },
        { id: 'etica', orden: 4, label: '4. Comité de Ética (CEIm)', avatar: 'javier' },
        { id: 'datos', orden: 5, label: '5. Solicitud de datos (Unidad del Dato)', avatar: 'unidad_datos' },
        { id: 'analisis', orden: 6, label: '6. Análisis y gestión de datos', avatar: 'jose' },
        { id: 'difusion', orden: 7, label: '7. Publicación y difusión', avatar: null }
    ];

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
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
        } catch (e) {}
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

    const QUESTIONS_URL = '../data/questions.json';
    let questionsCache = null;

    function loadQuestions() {
        if (questionsCache) {
            return Promise.resolve(questionsCache);
        }
        return fetch(QUESTIONS_URL)
            .then(resp => resp.json())
            .then(data => {
                questionsCache = data;
                return data;
            })
            .catch(() => ({}));
    }

    function renderMapa() {
        const container = document.getElementById('nodesGrid');
        if (!container) return;

        const state = loadState();

        const nodes = NODES.slice().sort((a, b) => a.orden - b.orden);

        container.innerHTML = '';

        nodes.forEach(node => {
            const unlocked = state.unlockedNodes.includes(node.id);
            const visited = state.visitedNodes.includes(node.id);

            const card = document.createElement('div');
            card.className = 'node-card';
            if (!unlocked) card.classList.add('node-card--locked');
            if (visited) card.classList.add('node-card--visited');

            const title = document.createElement('h2');
            title.textContent = node.label;
            card.appendChild(title);

            const desc = document.createElement('p');
            if (!unlocked) {
                desc.textContent = 'Bloqueado.';
            } else if (node.avatar) {
                desc.textContent = 'Puedes consultar al avatar correspondiente.';
            } else {
                desc.textContent = 'Última fase: difusión.';
            }
            card.appendChild(desc);

            if (unlocked) {
                const link = document.createElement('a');
                if (node.avatar) {
                    link.href = `avatares/${node.avatar}.html`;
                    link.textContent = 'Hablar con el avatar →';
                } else {
                    link.href = 'pistas/final/FIN_M01.html';
                    link.textContent = 'Ir al final →';
                }
                card.appendChild(link);
            }

            container.appendChild(card);
        });
    }

    function renderAvatar(avatarId, options = {}) {
        const qContainer = document.getElementById('questionsContainer');
        const aContainer = document.getElementById('answerContainer');

        if (!qContainer || !aContainer) return;

        loadQuestions().then(all => {
            const list = all[avatarId] || [];

            const ul = document.createElement('ul');
            ul.className = 'avatar-questions';

            list.forEach(q => {
                const li = document.createElement('li');
                const btn = document.createElement('button');
                btn.textContent = q.text;
                btn.className = 'avatar-question-button';

                btn.addEventListener('click', () => {
                    let html = `<p>${q.answer || 'Respuesta no configurada.'}</p>`;

                    if (q.leads_to) {
                        html += `<p><a href="${q.leads_to}">Ir al siguiente paso →</a></p>`;
                    }

                    aContainer.innerHTML = html;

                    if (q.unlocks_node) unlockNode(q.unlocks_node);
                    if (options.nodeId) markNodeVisited(options.nodeId);
                });

                li.appendChild(btn);
                ul.appendChild(li);
            });

            qContainer.innerHTML = '';
            qContainer.appendChild(ul);
            aContainer.innerHTML = '<p>Elige una pregunta.</p>';
        });
    }

    window.GameEngine = {
        renderMapa,
        renderAvatar,
        unlockNode,
        markNodeVisited,
        NODES
    };
})();
