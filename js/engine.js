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

    // --- ESTADO GLOBAL (NODOS + PREGUNTAS DESBLOQUEADAS) ---

    function defaultState() {
        return {
            unlockedNodes: ['relacion'],
            visitedNodes: [],
            unlockedQuestions: []   // IDs de preguntas desbloqueadas globalmente
        };
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultState();
            const parsed = JSON.parse(raw);

            // Asegurar que las nuevas propiedades existen
            if (!Array.isArray(parsed.unlockedNodes)) parsed.unlockedNodes = ['relacion'];
            if (!Array.isArray(parsed.visitedNodes)) parsed.visitedNodes = [];
            if (!Array.isArray(parsed.unlockedQuestions)) parsed.unlockedQuestions = [];

            return parsed;
        } catch {
            return defaultState();
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // ignorar errores de quota
        }
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

    // Desbloqueo global de preguntas (por puzzle, etc.)
    function unlockQuestion(questionId) {
        if (!questionId) return;
        const state = loadState();
        if (!state.unlockedQuestions.includes(questionId)) {
            state.unlockedQuestions.push(questionId);
            saveState(state);
        }
    }

    // --- CARGA DE PREGUNTAS ---

    const QUESTIONS_URL = '../data/questions.json';
    let questionsCache = null;

    function loadQuestions() {
        if (questionsCache) return Promise.resolve(questionsCache);
        return fetch(QUESTIONS_URL)
            .then(r => r.json())
            .then(data => {
                questionsCache = data || {};
                return questionsCache;
            })
            .catch(() => ({}));
    }

    // --- EFECTO TYPEWRITER + OVERLAY SOBRE AVATAR ---

    function typewriter(element, text, delayMs, onComplete) {
        let idx = 0;
        function step() {
            if (idx <= text.length) {
                element.textContent = text.slice(0, idx);
                idx++;
                setTimeout(step, delayMs);
            } else if (typeof onComplete === 'function') {
                onComplete();
            }
        }
        step();
    }

    function showAvatarAnswer(question, options) {
        const answerBox = document.getElementById("answerContainer");
        if (!answerBox) return;

        answerBox.innerHTML = "";

        const p = document.createElement("p");
        p.className = "avatar-answer-text";
        answerBox.appendChild(p);

        if (typeof window.playSFX === 'function' && question.sfx) {
            playSFX(question.sfx);
        }

        typewriter(p, question.answer || "", 25, () => {
            if (question.leads_to) {
                const link = document.createElement("a");
                link.href = question.leads_to;
                link.className = "avatar-next-button";
                link.textContent = "Continuar";
                answerBox.appendChild(link);
            }
        });

        if (question.unlocks_node) unlockNode(question.unlocks_node);
        if (options && options.nodeId) markNodeVisited(options.nodeId);

        if (Array.isArray(question.unlocks_questions)) {
            question.unlocks_questions.forEach(unlockQuestion);
        } else if (typeof question.unlocks_questions === "string") {
            unlockQuestion(question.unlocks_questions);
        }
    }

    // --- RENDER DEL MAPA ---

    function renderMapa() {
        const container = document.getElementById('nodesGrid');
        if (!container) return;

        const state = loadState();
        container.innerHTML = '';

        NODES.forEach(node => {
            const card = document.createElement('div');
            card.className = 'node-card';
            const unlocked = state.unlockedNodes.includes(node.id);
            const visited = state.visitedNodes.includes(node.id);

            if (!unlocked) card.classList.add('node-card--locked');
            if (visited) card.classList.add('node-card--visited');

            card.innerHTML = `
                <h2>${node.label}</h2>
                <p>${unlocked ? '' : 'Bloqueado.'}</p>
                ${
                    unlocked && node.avatar
                        ? `<a href="avatares/${node.avatar}.html">Hablar con el avatar →</a>`
                        : ''
                }
                ${
                    unlocked && !node.avatar
                        ? `<a href="pistas/final/FIN_M01.html">Ir al final →</a>`
                        : ''
                }
            `;

            container.appendChild(card);
        });
    }

    // --- RENDER DE AVATAR CON PREGUNTAS DESBLOQUEABLES ---

    function renderAvatar(avatarId, options = {}) {
        const qC = document.getElementById('questionsContainer');
        const aC = document.getElementById('answerContainer'); // se mantiene por compatibilidad
        if (!qC) return;

        // Texto inicial por defecto
        if (aC) {
            aC.innerHTML = '';
        }

        const state = loadState();
        const unlockedQuestions = new Set(state.unlockedQuestions || []);

        loadQuestions().then(data => {
            const allQs = data[avatarId] || [];

            // Lógica de desbloqueo:
            // - Si la pregunta no tiene "id", se muestra siempre (compatibilidad con lo ya creado).
            // - Si tiene "id", solo se muestra si está en unlockedQuestions.
            const visibleQs = allQs.filter(q => {
                if (!q.id) return true;
                return unlockedQuestions.has(q.id);
            });

            const ul = document.createElement('ul');
            ul.className = 'avatar-questions-list';

            if (visibleQs.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Todavía no has desbloqueado ninguna pregunta para este avatar.';
                ul.appendChild(li);
            } else {
                visibleQs.forEach(q => {
                    const li = document.createElement('li');
                    const btn = document.createElement('button');
                    btn.textContent = q.text;
                    btn.className = 'avatar-question-button';

                    btn.onclick = () => {
                        if (typeof window.playSFX === 'function' && q.sfx) {
                            window.playSFX(q.sfx);
                        }
                        const ac = document.getElementById('answerContainer');
                        if (ac && (q.sfx === 'type2' || q.sfx === 'type3')) {
                            ac.innerHTML = '<p class="unlock-msg">¡Has desbloqueado un nuevo camino!</p>';
                        }
                        showAvatarAnswer(q, options);
                    };

                    li.appendChild(btn);
                    ul.appendChild(li);
                });
            }

            qC.innerHTML = '';
            qC.appendChild(ul);
        });
    }

    // --- API PÚBLICA DEL MOTOR ---

    window.GameEngine = {
        renderMapa,
        renderAvatar,
        unlockNode,
        markNodeVisited,
        unlockQuestion,
        loadState
    };
})();

// === SISTEMA GLOBAL DE EFECTOS DE SONIDO ===

(function () {
    // Detectar la ruta base según dónde estemos (raíz o /avatares/)
    let base = 'media/sfx/';
    try {
        const path = window.location.pathname || '';
        if (path.indexOf('/avatares/') !== -1) {
            base = '../media/sfx/';
        }
    } catch (e) {
        // Fallback silencioso
    }

    const SFX = {
        type1: base + 'sfx_type1_no_respuesta.mp3',
        type2: base + 'sfx_type2_desbloqueo_pregunta.mp3',
        type3: base + 'sfx_type3_desbloqueo_puzzle.mp3',
        type4: base + 'sfx_type4_respuesta_parcial.mp3'
    };

    window.playSFX = function (type) {
        if (!SFX[type]) return;
        try {
            const audio = new Audio(SFX[type]);
            audio.volume = 0.8;
            audio.play().catch(function () {});
        } catch (e) {
            console.warn('SFX error:', e);
        }
    };
})();
