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
    const aC = document.getElementById('answerContainer');
    if (!qC || !aC) return;

    const state = loadState();
    const unlocked = Array.isArray(state.unlockedQuestions)
        ? state.unlockedQuestions
        : [];

    loadQuestions().then(data => {
        let qs = data[avatarId] || [];

        // 1) Filtrar por preguntas desbloqueadas:
        //    - si la pregunta NO tiene id → siempre visible
        //    - si tiene id → solo si está en unlockedQuestions
        qs = qs.filter(q => {
            if (!q.id) return true;
            return unlocked.includes(q.id);
        });

        // Si no hay ninguna pregunta visible, mostrar mensaje neutro
        if (!qs.length) {
            qC.innerHTML = '<p>Todavía no has desbloqueado ninguna pregunta para este avatar.</p>';
            aC.innerHTML = '<p>Selecciona una pregunta.</p>';
            return;
        }

        const ul = document.createElement('ul');

        qs.forEach(q => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = q.text;
            btn.className = 'avatar-question-button';

            btn.onclick = () => {
                // SFX si existe
                if (q.sfx && typeof window.playSFX === 'function') {
                    window.playSFX(q.sfx);
                }

                // Respuesta básica en el contenedor
                let html = '';
                if (q.answer) {
                    html += `<p>${q.answer}</p>`;
                }

                // Botón/enlace de continuación si hay leads_to
                if (q.leads_to) {
                    html += `<p><a href="${q.leads_to}" class="avatar-next-button">Continuar</a></p>`;
                }

                // Si no hay texto ni enlace, mantenemos el mensaje por defecto
                if (!html) {
                    html = '<p>Selecciona una pregunta.</p>';
                }

                aC.innerHTML = html;

                // Desbloqueo de nodo (mapa) si aplica
                if (q.unlocks_node) {
                    unlockNode(q.unlocks_node);
                }

                // Desbloqueo de nuevas preguntas, si se define en questions.json
                if (Array.isArray(q.unlocks_questions) && q.unlocks_questions.length) {
                    const st = loadState();
                    if (!Array.isArray(st.unlockedQuestions)) {
                        st.unlockedQuestions = [];
                    }

                    q.unlocks_questions.forEach(id => {
                        if (id && !st.unlockedQuestions.includes(id)) {
                            st.unlockedQuestions.push(id);
                        }
                    });

                    saveState(st);
                }

                // Marcar nodo visitado
                if (options.nodeId) {
                    markNodeVisited(options.nodeId);
                }
            };

            li.appendChild(btn);
            ul.appendChild(li);
        });

        qC.innerHTML = '';
        qC.appendChild(ul);

        // Mensaje por defecto en el área de respuesta
        aC.innerHTML = '<p>Selecciona una pregunta.</p>';
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
