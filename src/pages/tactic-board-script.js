(() => {
    let tacticBoardAnimationFrameId = null;
    const tacticBoardListeners = [];
    const originalWindowAddEventListener = window.addEventListener.bind(window);
    const originalDocumentAddEventListener = document.addEventListener.bind(document);
    const originalWindowRemoveEventListener = window.removeEventListener.bind(window);
    const originalDocumentRemoveEventListener = document.removeEventListener.bind(document);

    window.addEventListener = (type, listener, options) => {
        tacticBoardListeners.push({ target: window, type, listener, options });
        originalWindowAddEventListener(type, listener, options);
    };

    document.addEventListener = (type, listener, options) => {
        tacticBoardListeners.push({ target: document, type, listener, options });
        originalDocumentAddEventListener(type, listener, options);
    };

    const pitch = document.getElementById('pitch');
    const captureArea = document.getElementById('capture-area');
    const canvas = document.getElementById('canvas');
    const tempCanvas = document.getElementById('tempCanvas');
    const attachedCanvas = document.getElementById('attachedCanvas');
    const ctx = canvas.getContext('2d');
    const tCtx = tempCanvas.getContext('2d');
    const aCtx = attachedCanvas.getContext('2d');
    const svgLinks = document.getElementById('dynamic-links');

    const totalFrames = 10;
    const defaultPlayerSize = 34;
    const frameDelayMs = 1500;
    const movableLineThresholdPx = 76;
    const legacyBoard = { width: 1100, height: 700 };
    const logicalBoard = { width: 100, height: 100 };
    const boardBounds = { x: 8, y: 14, width: 84, height: 72 };
    const formationOrder = ['4-4-2', '4-3-3', '4-2-3-1', '4-1-4-1', '4-3-1-2', '4-4-1-1', '3-5-2', '3-4-3', '3-4-2-1', '3-4-1-2', '5-3-2', '5-4-1'];
    const layerIds = ['layer-korridorer', 'layer-golden', 'layer-spelytor', 'layer-assistv', 'layer-straffzoner'];
    const zoomPresets = {
        full: { originX: 50, originY: 50 },
        'third-l': { originX: 22, originY: 50 },
        'third-c': { originX: 50, originY: 50 },
        'third-r': { originX: 78, originY: 50 },
        'box-l': { originX: 12, originY: 50 },
        'box-r': { originX: 88, originY: 50 },
        'mid-high': { originX: 50, originY: 28 },
        'mid-low': { originX: 50, originY: 72 },
        'corner-tl': { originX: 0, originY: 0 },
        'corner-bl': { originX: 0, originY: 100 },
        'corner-tr': { originX: 100, originY: 0 },
        'corner-br': { originX: 100, originY: 100 }
    };

    const legacyFormations = {
        '4-4-2': [{x: 70, y: 350}, {x: 220, y: 90}, {x: 220, y: 240}, {x: 220, y: 460}, {x: 220, y: 610}, {x: 430, y: 90}, {x: 430, y: 240}, {x: 430, y: 460}, {x: 430, y: 610}, {x: 790, y: 260}, {x: 790, y: 440}],
        '4-3-3': [{x: 70, y: 350}, {x: 220, y: 90}, {x: 220, y: 240}, {x: 220, y: 460}, {x: 220, y: 610}, {x: 450, y: 180}, {x: 450, y: 350}, {x: 450, y: 520}, {x: 800, y: 110}, {x: 820, y: 350}, {x: 800, y: 590}],
        '4-2-3-1': [{x: 70, y: 350}, {x: 220, y: 90}, {x: 220, y: 240}, {x: 220, y: 460}, {x: 220, y: 610}, {x: 420, y: 250}, {x: 420, y: 450}, {x: 630, y: 110}, {x: 630, y: 350}, {x: 630, y: 590}, {x: 830, y: 350}],
        '4-1-4-1': [{x: 70, y: 350}, {x: 220, y: 90}, {x: 220, y: 240}, {x: 220, y: 460}, {x: 220, y: 610}, {x: 390, y: 350}, {x: 590, y: 90}, {x: 560, y: 250}, {x: 560, y: 450}, {x: 590, y: 610}, {x: 830, y: 350}],
        '4-3-1-2': [{x: 70, y: 350}, {x: 220, y: 90}, {x: 220, y: 240}, {x: 220, y: 460}, {x: 220, y: 610}, {x: 450, y: 180}, {x: 450, y: 350}, {x: 450, y: 520}, {x: 650, y: 350}, {x: 830, y: 260}, {x: 830, y: 440}],
        '4-4-1-1': [{x: 70, y: 350}, {x: 220, y: 90}, {x: 220, y: 240}, {x: 220, y: 460}, {x: 220, y: 610}, {x: 430, y: 90}, {x: 430, y: 240}, {x: 430, y: 460}, {x: 430, y: 610}, {x: 650, y: 350}, {x: 830, y: 350}],
        '3-5-2': [{x: 70, y: 350}, {x: 230, y: 150}, {x: 210, y: 350}, {x: 230, y: 550}, {x: 390, y: 90}, {x: 470, y: 220}, {x: 490, y: 350}, {x: 470, y: 480}, {x: 390, y: 610}, {x: 770, y: 260}, {x: 770, y: 440}],
        '3-4-3': [{x: 70, y: 350}, {x: 230, y: 150}, {x: 210, y: 350}, {x: 230, y: 550}, {x: 430, y: 100}, {x: 430, y: 250}, {x: 430, y: 450}, {x: 430, y: 600}, {x: 800, y: 110}, {x: 820, y: 350}, {x: 800, y: 590}],
        '3-4-2-1': [{x: 70, y: 350}, {x: 230, y: 150}, {x: 210, y: 350}, {x: 230, y: 550}, {x: 430, y: 100}, {x: 430, y: 250}, {x: 430, y: 450}, {x: 430, y: 600}, {x: 670, y: 250}, {x: 670, y: 450}, {x: 830, y: 350}],
        '3-4-1-2': [{x: 70, y: 350}, {x: 230, y: 150}, {x: 210, y: 350}, {x: 230, y: 550}, {x: 430, y: 100}, {x: 430, y: 250}, {x: 430, y: 450}, {x: 430, y: 600}, {x: 660, y: 350}, {x: 830, y: 260}, {x: 830, y: 440}],
        '5-3-2': [{x: 70, y: 350}, {x: 210, y: 70}, {x: 220, y: 190}, {x: 210, y: 350}, {x: 220, y: 510}, {x: 210, y: 630}, {x: 470, y: 220}, {x: 490, y: 350}, {x: 470, y: 480}, {x: 790, y: 260}, {x: 790, y: 440}],
        '5-4-1': [{x: 70, y: 350}, {x: 210, y: 70}, {x: 220, y: 190}, {x: 210, y: 350}, {x: 220, y: 510}, {x: 210, y: 630}, {x: 470, y: 90}, {x: 470, y: 240}, {x: 470, y: 460}, {x: 470, y: 610}, {x: 830, y: 350}]
    };

    const formations = Object.fromEntries(
        Object.entries(legacyFormations).map(([name, coords]) => [
            name,
            coords.map((coord) => ({
                x: legacyXToLogical(coord.x),
                y: legacyYToLogical(coord.y)
            }))
        ])
    );

    let drawingActive = false;
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let currentScale = 1;
    let currentFreehandPoints = [];
    let drawingAttachedTo = null;
    let linkMode = false;
    let linkStartNode = null;
    let links = [];
    let drawings = [];
    let frames = new Array(totalFrames).fill(null);
    let activeItem = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let activeDrawingIndex = -1;
    let activeDrawingStart = null;
    let activeDrawingSnapshot = null;
    let itemCounter = 1;
    let lastFormation = { home: '4-4-2', away: '4-4-2' };
    let benchMemory = { home: null, away: null };
    let pitchResizeObserver = null;

    function legacyXToLogical(value) {
        return (Number(value) / legacyBoard.width) * logicalBoard.width;
    }

    function legacyYToLogical(value) {
        return (Number(value) / legacyBoard.height) * logicalBoard.height;
    }

    function parsePositionValue(value) {
        if (typeof value === 'number') return value;
        if (typeof value !== 'string') return 0;
        return parseFloat(value.replace('%', '').replace('px', '')) || 0;
    }

    function isLegacyPositionValue(value) {
        if (typeof value === 'string' && value.trim().endsWith('px')) return true;
        const numeric = parsePositionValue(value);
        return Math.abs(numeric) > 130;
    }

    function normalizeLogicalX(value) {
        const numeric = parsePositionValue(value);
        return isLegacyPositionValue(value) ? legacyXToLogical(numeric) : numeric;
    }

    function normalizeLogicalY(value) {
        const numeric = parsePositionValue(value);
        return isLegacyPositionValue(value) ? legacyYToLogical(numeric) : numeric;
    }

    function getPitchRect() {
        const rect = pitch.getBoundingClientRect();
        return {
            width: rect.width || legacyBoard.width,
            height: rect.height || legacyBoard.height,
            left: rect.left || 0,
            top: rect.top || 0
        };
    }

    function toLogicalX(px) {
        return (px / Math.max(getPitchRect().width, 1)) * logicalBoard.width;
    }

    function toLogicalY(px) {
        return (px / Math.max(getPitchRect().height, 1)) * logicalBoard.height;
    }

    function toLogicalDistance(px) {
        return (toLogicalX(px) + toLogicalY(px)) / 2;
    }

    function syncCanvasToPitch(canvasElement, context) {
        const rect = getPitchRect();
        const dpr = window.devicePixelRatio || 1;
        const nextWidth = Math.max(1, Math.round(rect.width * dpr));
        const nextHeight = Math.max(1, Math.round(rect.height * dpr));

        if (canvasElement.width !== nextWidth) canvasElement.width = nextWidth;
        if (canvasElement.height !== nextHeight) canvasElement.height = nextHeight;
        canvasElement.style.width = '100%';
        canvasElement.style.height = '100%';
        context.setTransform(nextWidth / logicalBoard.width, 0, 0, nextHeight / logicalBoard.height, 0, 0);
    }

    function syncCanvasesToPitch() {
        syncCanvasToPitch(canvas, ctx);
        syncCanvasToPitch(attachedCanvas, aCtx);
        syncCanvasToPitch(tempCanvas, tCtx);
    }

    function clearLogicalCanvas(context, canvasElement) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        syncCanvasToPitch(canvasElement, context);
    }

    function clearTempCanvas() {
        clearLogicalCanvas(tCtx, tempCanvas);
    }

    function clampLogicalPosition(value) {
        return Math.max(-18, Math.min(118, value));
    }

    function init() {
        syncCanvasesToPitch();
        initToolbarPanels();
        buildSidebar();
        createInitialPieces();
        initTimeline();
        initFormationButtons();
        setPlayerSize(defaultPlayerSize);
        updateToolSettingsLabels();
        updateToolOptionsVisibility();
        syncLayerCheckboxes();
        setZoom();
        updateAllToggleButtons();
        if ('ResizeObserver' in window) {
            pitchResizeObserver = new ResizeObserver(() => {
                syncCanvasesToPitch();
                renderAllDrawings();
                renderLinks();
            });
            pitchResizeObserver.observe(pitch);
        }
        tacticBoardAnimationFrameId = requestAnimationFrame(renderDynamics);
    }

    function initToolbarPanels() {
        // Stöder både legacy .toolbar-panel och nya .tactic-panel (vertikal).
        // Med ny vertikal layout vill vi tillåta flera öppna samtidigt — varje
        // panel är dess egen rullgardin. Men vi behåller toggle-eventet ifall
        // någon vill bygga på framöver.
        const selector = '.tactic-panel, .toolbar-panel';
        document.querySelectorAll(selector).forEach((panel) => {
            panel.addEventListener('toggle', () => {
                /* No-op idag: rullgardinerna är oberoende av varandra så
                   tränaren kan se flera samtidigt utan att tappa kontexten. */
            });
        });
    }

    function buildSidebar() {
        const playerInputs = document.getElementById('player-inputs');
        for (let i = 0; i < 11; i++) {
            const number = i + 1;
            playerInputs.innerHTML += `
                <div class="player-row">
                    <span style="width:25px; font-weight:bold; color:#f44336; font-size:12px;">${number}.</span>
                    <input type="text" id="input-home-${i}" oninput="updateSidebarName(${i}, this.value)" placeholder="Namn..." style="flex:1; background:#333; color:white; border:1px solid #555; padding:5px; border-radius:4px; font-size:12px; outline:none;">
                    <button type="button" id="toggle-home-${i}" class="player-toggle" onclick="togglePlayerBench('home-${i}')">In</button>
                </div>
            `;
        }
    }

    function createInitialPieces() {
        for (let i = 0; i < 11; i++) {
            createPiece('home', i + 1, 50 + (i * 40), -80, `home-${i}`);
            createPiece('away', i + 1, 50 + (i * 40), 760, `away-${i}`);
        }
    }

    function initTimeline() {
        const timeline = document.getElementById('timeline');
        for (let i = 0; i < totalFrames; i++) {
            const button = document.createElement('button');
            button.className = 'frame-btn';
            button.innerText = i + 1;
            button.title = "Klicka = Ladda ruta\nShift + Klicka = Spara ruta";
            button.onclick = (event) => handleFrameClick(i, button, event.shiftKey);
            timeline.appendChild(button);
        }
    }

    function initFormationButtons() {
        const homeContainer = document.getElementById('homeFormationButtons');
        const awayContainer = document.getElementById('awayFormationButtons');

        formationOrder.forEach((formation) => {
            homeContainer.appendChild(createFormationButton('home', formation));
            awayContainer.appendChild(createFormationButton('away', formation));
        });

        updateFormationButtonState('home', lastFormation.home);
        updateFormationButtonState('away', lastFormation.away);
    }

    function createFormationButton(team, formation) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'formation-btn';
        button.dataset.team = team;
        button.dataset.formation = formation;
        button.innerText = formation;
        button.onclick = () => applyFormation(team, formation);
        return button;
    }

    function createPiece(type, num, x, y, id, coordinateMode = 'legacy') {
        const piece = document.createElement('div');
        const isPlayer = type === 'home' || type === 'away';
        piece.className = `piece ${type}${isPlayer ? ' player-piece' : ''}`;
        piece.id = id;
        piece.dataset.kind = type;
        piece.dataset.num = num;
        const logicalX = coordinateMode === 'logical' ? normalizeLogicalX(x) : legacyXToLogical(x);
        const logicalY = coordinateMode === 'logical' ? normalizeLogicalY(y) : legacyYToLogical(y);
        setPieceCenter(piece, logicalX, logicalY);

        if (isPlayer) {
            piece.innerHTML = `${num}<span class="name" onclick="event.stopPropagation(); changeName(this, '${id}')">Namn</span>`;
        } else {
            piece.innerHTML = '';
        }

        piece.onmousedown = handlePieceClick;
        pitch.appendChild(piece);
        return piece;
    }

    function getPieceMetrics(piece) {
        const style = window.getComputedStyle(piece);
        const width = parseFloat(style.width) || piece.offsetWidth || defaultPlayerSize;
        const height = parseFloat(style.height) || piece.offsetHeight || defaultPlayerSize;
        const centerX = normalizeLogicalX(piece.dataset.x || piece.style.left);
        const centerY = normalizeLogicalY(piece.dataset.y || piece.style.top);
        const widthLogical = toLogicalX(width);
        const heightLogical = toLogicalY(height);
        return {
            left: centerX - (widthLogical / 2),
            top: centerY - (heightLogical / 2),
            width: widthLogical,
            height: heightLogical,
            centerX,
            centerY
        };
    }

    function setPieceCenter(piece, centerX, centerY) {
        const nextX = clampLogicalPosition(Number(centerX));
        const nextY = clampLogicalPosition(Number(centerY));
        piece.dataset.x = `${nextX}`;
        piece.dataset.y = `${nextY}`;
        piece.style.left = `${nextX}%`;
        piece.style.top = `${nextY}%`;
    }

    function isPieceBenched(piece) {
        const box = getPieceMetrics(piece);
        return box.centerY < 0 || box.centerY > logicalBoard.height;
    }

    function getMousePos(event) {
        const rect = pitch.getBoundingClientRect();
        return {
            x: ((event.clientX - rect.left) / Math.max(rect.width, 1)) * logicalBoard.width,
            y: ((event.clientY - rect.top) / Math.max(rect.height, 1)) * logicalBoard.height
        };
    }

    function updateSidebarName(index, value) {
        const piece = document.getElementById(`home-${index}`);
        if (!piece) return;
        const nameEl = piece.querySelector('.name');
        if (nameEl) nameEl.innerText = value || 'Namn';
    }

    function changeName(element, id) {
        const name = prompt("Ange nytt namn:", element.innerText);
        if (name === null) return;
        element.innerText = name;

        if (id.startsWith('home-')) {
            const index = id.split('-')[1];
            const input = document.getElementById(`input-home-${index}`);
            if (input) input.value = name;
        }
    }

    function updatePlayerToggleButton(id) {
        const piece = document.getElementById(id);
        const button = document.getElementById(`toggle-${id}`);
        if (!piece || !button) return;
        const onField = !isPieceBenched(piece);
        button.innerText = onField ? 'Ut' : 'In';
        button.classList.toggle('benched', !onField);
    }

    function updateAllToggleButtons() {
        for (let i = 0; i < 11; i++) updatePlayerToggleButton(`home-${i}`);
    }

    function togglePlayerBench(id) {
        const piece = document.getElementById(id);
        if (!piece) return;
        const onField = !isPieceBenched(piece);
        if (onField) {
            piece.dataset.lastFieldX = piece.dataset.x || piece.style.left;
            piece.dataset.lastFieldY = piece.dataset.y || piece.style.top;
            movePieceToBench(piece, 'home', Number(id.split('-')[1]));
        } else if (piece.dataset.lastFieldX && piece.dataset.lastFieldY) {
            setPieceCenter(piece, normalizeLogicalX(piece.dataset.lastFieldX), normalizeLogicalY(piece.dataset.lastFieldY));
        } else {
            applyFormation('home', lastFormation.home);
            return;
        }
        updatePlayerToggleButton(id);
    }

    function movePieceToBench(piece, team, index) {
        const benchTop = -7;
        const benchBottom = 107;
        setPieceCenter(piece, 4.5 + (index * 4.8), team === 'home' ? benchTop : benchBottom);
    }

    function serializePiecePosition(piece) {
        const box = getPieceMetrics(piece);
        return { id: piece.id, x: box.centerX, y: box.centerY };
    }

    function setTeamAvailability(team, shouldBeOnField) {
        const pieces = Array.from(document.querySelectorAll(`.piece.${team}`));
        if (shouldBeOnField) {
            const savedPositions = benchMemory[team];
            if (savedPositions && savedPositions.length === pieces.length) {
                const positionMap = new Map(savedPositions.map((item) => [item.id, item]));
                pieces.forEach((piece) => {
                    const saved = positionMap.get(piece.id);
                    if (saved) {
                        setPieceCenter(piece, normalizeLogicalX(saved.x), normalizeLogicalY(saved.y));
                    }
                });
            } else {
                applyFormation(team, lastFormation[team] || '4-4-2');
                return;
            }
        } else {
            benchMemory[team] = pieces.map(serializePiecePosition);
            pieces.forEach((piece, index) => movePieceToBench(piece, team, index));
        }
        updateAllToggleButtons();
    }

    function clearPlayers() {
        setTeamAvailability('home', false);
        setTeamAvailability('away', false);
        document.querySelectorAll('.ball').forEach((ball, index) => {
            setPieceCenter(ball, 49 + (index * 2.8), -7);
        });
    }

    function addBall() {
        createPiece('ball', '', 49 + (Math.random() * 4), 48 + (Math.random() * 5), `ball-${itemCounter++}`, 'logical');
    }

    function addCone() {
        createPiece('cone', '', 41 + (Math.random() * 18), 3, `cone-${itemCounter++}`, 'logical');
    }

    function setPlayerSize(value) {
        const size = Number(value);
        document.documentElement.style.setProperty('--player-size', `${size}px`);
        document.getElementById('playerSize').value = size;
        document.getElementById('playerSizeValue').innerText = `${Math.round((size / defaultPlayerSize) * 100)}%`;
    }

    function updateToolSettingsLabels() {
        document.getElementById('curveAngleValue').innerText = `${document.getElementById('curveAngle').value}\u00b0`;
        document.getElementById('curveSharpnessValue').innerText = `${document.getElementById('curveSharpness').value}%`;
        document.getElementById('textSizeValue').innerText = `${document.getElementById('textSize').value}px`;
        document.getElementById('zoomLevelValue').innerText = `${document.getElementById('zoomLevel').value}%`;
    }

    function updateToolOptionsVisibility() {
        const mode = document.getElementById('drawMode').value;
        const curveControls = document.getElementById('curveControls');
        const textControls = document.getElementById('textControls');
        curveControls.classList.toggle('hidden', !(mode === 'curve' || mode === 'curve-dashed'));
        textControls.classList.toggle('hidden', mode !== 'text');
        updateToolSettingsLabels();
    }

    function getCurveSettings() {
        return {
            curveDirection: document.getElementById('curveDirection').value,
            curveAngle: Number(document.getElementById('curveAngle').value),
            curveSharpness: Number(document.getElementById('curveSharpness').value)
        };
    }

    function getTextSettings() {
        const textValue = document.getElementById('textInput').value.trim();
        return {
            text: textValue || 'Text',
            fontSize: Number(document.getElementById('textSize').value)
        };
    }

    function updateFormationButtonState(team, formation) {
        document.querySelectorAll(`.formation-btn[data-team="${team}"]`).forEach((button) => {
            button.classList.toggle('active-formation', button.dataset.formation === formation);
        });
    }

    function applyFormation(team, formation) {
        const coords = formations[formation];
        if (!coords) return;

        const players = Array.from(document.querySelectorAll(`.piece.${team}`));
        lastFormation[team] = formation;

        players.forEach((piece, index) => {
            const coord = coords[index];
            if (!coord) return;
            const centerX = team === 'home' ? coord.x : logicalBoard.width - coord.x;
            const centerY = team === 'home' ? coord.y : logicalBoard.height - coord.y;
            setPieceCenter(piece, centerX, centerY);
        });

        benchMemory[team] = players.map(serializePiecePosition);
        updateFormationButtonState(team, formation);
        updateAllToggleButtons();
    }

    function toggleDropdownMenu(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.classList.toggle('open');
    }

    function toggleLayer(layerId, forcedState) {
        const layer = document.getElementById(layerId);
        const nextState = typeof forcedState === 'boolean'
            ? forcedState
            : layer.style.display === 'none' || layer.style.display === '';
        layer.style.display = nextState ? 'block' : 'none';
        const checkbox = document.querySelector(`[data-layer-target="${layerId}"]`);
        if (checkbox) checkbox.checked = nextState;
    }

    function syncLayerCheckboxes() {
        layerIds.forEach((layerId) => {
            const layer = document.getElementById(layerId);
            const checkbox = document.querySelector(`[data-layer-target="${layerId}"]`);
            if (layer && checkbox) checkbox.checked = layer.style.display !== 'none';
        });
    }

    function getLayerState() {
        return layerIds.reduce((result, layerId) => {
            const layer = document.getElementById(layerId);
            result[layerId] = layer && layer.style.display !== 'none';
            return result;
        }, {});
    }

    function applyLayerState(layerState = {}) {
        layerIds.forEach((layerId) => toggleLayer(layerId, !!layerState[layerId]));
    }

    function setZoom() {
        const value = document.getElementById('zoomSelect').value;
        const zoomPercent = Number(document.getElementById('zoomLevel').value);
        const preset = zoomPresets[value] || zoomPresets.full;
        const scale = zoomPercent / 100;
        captureArea.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        captureArea.style.transformOrigin = `${preset.originX}% ${preset.originY}%`;
        captureArea.style.transform = `scale(${scale})`;
        currentScale = scale;
        updateToolSettingsLabels();
    }

    function toggleLinkMode() {
        linkMode = !linkMode;
        const button = document.getElementById('linkBtn');
        button.classList.toggle('btn-active');
        linkStartNode = null;
        document.querySelectorAll('.piece').forEach((piece) => piece.classList.remove('linking'));
        if (linkMode && drawingActive) toggleDrawing();
    }

    function clearLinks() {
        links = [];
        if (linkStartNode) linkStartNode.classList.remove('linking');
        linkStartNode = null;
        svgLinks.innerHTML = '';
    }

    function handlePieceClick(event) {
        if (drawingActive) {
            const mode = document.getElementById('drawMode').value;
            if (mode === 'eraser') {
                drawings = drawings.filter((drawing) => drawing.attachedTo !== this.id);
                renderAllDrawings();
                event.preventDefault();
                return;
            }
            if (mode === 'free') {
                event.preventDefault();
                return;
            }

            drawingAttachedTo = this.id;
            isDrawing = true;
            const box = getPieceMetrics(this);
            startX = box.centerX;
            startY = box.centerY;
            lastX = startX;
            lastY = startY;
            clearTempCanvas();
            event.preventDefault();
            return;
        }

        if (linkMode) {
            if (!linkStartNode) {
                linkStartNode = this;
                this.classList.add('linking');
            } else {
                if (linkStartNode !== this) {
                    links.push({ id1: linkStartNode.id, id2: this.id });
                }
                linkStartNode.classList.remove('linking');
                linkStartNode = null;
            }
            return;
        }

        activeItem = this;
        activeItem.style.transition = 'none';
        const pos = getMousePos(event);
        const box = getPieceMetrics(activeItem);
        dragOffsetX = pos.x - box.centerX;
        dragOffsetY = pos.y - box.centerY;
        document.onmousemove = moveDrag;
        document.onmouseup = stopDrag;
    }

    function moveDrag(event) {
        if (!activeItem) return;
        const pos = getMousePos(event);
        setPieceCenter(activeItem, pos.x - dragOffsetX, pos.y - dragOffsetY);
    }

    function stopDrag() {
        if (activeItem) {
            activeItem.style.transition = 'left 0.8s cubic-bezier(0.25, 1, 0.5, 1), top 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            if (activeItem.dataset.kind === 'home') updatePlayerToggleButton(activeItem.id);
        }
        activeItem = null;
        document.onmousemove = null;
        document.onmouseup = null;
    }

    function toggleDrawing() {
        drawingActive = !drawingActive;
        const button = document.getElementById('drawBtn');
        button.classList.toggle('btn-active');
        button.innerText = drawingActive ? 'Ritverktyg P\u00c5' : 'Aktivera Ritverktyg';
        pitch.style.cursor = drawingActive ? 'crosshair' : 'default';
        if (drawingActive && linkMode) toggleLinkMode();
    }

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function cloneData(data) {
        return JSON.parse(JSON.stringify(data));
    }

    function getCurveControlPoint(x1, y1, x2, y2, settings = {}) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const directionMultiplier = settings.curveDirection === 'right' ? -1 : 1;
        const sharpnessFactor = typeof settings.curveSharpness === 'number' ? settings.curveSharpness / 100 : 0.25;
        const baseNx = (-dy / distance) * directionMultiplier;
        const baseNy = (dx / distance) * directionMultiplier;
        const curveAngle = ((typeof settings.curveAngle === 'number' ? settings.curveAngle : 0) * Math.PI) / 180;
        const cosAngle = Math.cos(curveAngle);
        const sinAngle = Math.sin(curveAngle);
        const nx = (baseNx * cosAngle) - ((dx / distance) * sinAngle);
        const ny = (baseNy * cosAngle) - ((dy / distance) * sinAngle);
        const offset = Math.min(toLogicalDistance(260), distance * sharpnessFactor);
        return {
            cx: ((x1 + x2) / 2) + (nx * offset),
            cy: ((y1 + y2) / 2) + (ny * offset)
        };
    }

    function buildWavePoints(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy) || 1;
        const ux = dx / length;
        const uy = dy / length;
        const px = -uy;
        const py = ux;
        const steps = Math.max(12, Math.round(length / Math.max(toLogicalDistance(10), 0.6)));
        const oscillations = Math.max(2, Math.round(length / Math.max(toLogicalDistance(70), 2)));
        const points = [];
        const waveOffset = toLogicalDistance(8);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const baseX = x1 + (dx * t);
            const baseY = y1 + (dy * t);
            const offset = Math.sin(t * Math.PI * oscillations * 2) * waveOffset;
            points.push({
                x: baseX + (px * offset),
                y: baseY + (py * offset)
            });
        }
        return points;
    }

    function drawArrowHead(context, x, y, angle, color) {
        const arrowLength = toLogicalDistance(15);
        const arrowWidth = toLogicalDistance(7);
        context.save();
        context.fillStyle = color;
        context.translate(x, y);
        context.rotate(angle);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-arrowLength, arrowWidth);
        context.lineTo(-arrowLength, -arrowWidth);
        context.closePath();
        context.fill();
        context.restore();
    }

    function getTextMetrics(text, fontSize) {
        const logicalFontSize = toLogicalY(fontSize);
        ctx.save();
        ctx.font = `700 ${logicalFontSize}px "Segoe UI", sans-serif`;
        const textWidth = ctx.measureText(text).width;
        ctx.restore();
        return {
            width: textWidth,
            height: logicalFontSize
        };
    }

    function drawTextLabel(context, x, y, text, color, fontSize) {
        const logicalFontSize = toLogicalY(fontSize);
        context.save();
        context.font = `700 ${logicalFontSize}px "Segoe UI", sans-serif`;
        context.textBaseline = 'top';
        context.lineWidth = Math.max(toLogicalDistance(2), logicalFontSize / 6);
        context.strokeStyle = 'rgba(0, 0, 0, 0.78)';
        context.fillStyle = color;
        context.strokeText(text, x, y);
        context.fillText(text, x, y);
        context.restore();
    }

    function drawShape(context, x1, y1, x2, y2, mode, color, fillColor, fill, arrow, options = {}) {
        context.save();
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = toLogicalDistance(3);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.setLineDash((mode === 'dashed' || mode === 'curve-dashed') ? [toLogicalDistance(12), toLogicalDistance(10)] : []);

        let arrowAngle = null;

        if (mode === 'curve' || mode === 'curve-dashed') {
            const { cx, cy } = getCurveControlPoint(x1, y1, x2, y2, options);
            context.moveTo(x1, y1);
            context.quadraticCurveTo(cx, cy, x2, y2);
            arrowAngle = Math.atan2(y2 - cy, x2 - cx);
        } else if (mode === 'line' || mode === 'dashed') {
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            arrowAngle = Math.atan2(y2 - y1, x2 - x1);
        } else if (mode === 'wave') {
            const wavePoints = buildWavePoints(x1, y1, x2, y2);
            context.setLineDash([]);
            context.moveTo(wavePoints[0].x, wavePoints[0].y);
            for (let i = 1; i < wavePoints.length; i++) {
                context.lineTo(wavePoints[i].x, wavePoints[i].y);
            }
            const previous = wavePoints[Math.max(0, wavePoints.length - 2)];
            const last = wavePoints[wavePoints.length - 1];
            arrowAngle = Math.atan2(last.y - previous.y, last.x - previous.x);
        } else if (mode === 'rect') {
            context.rect(x1, y1, x2 - x1, y2 - y1);
        } else if (mode === 'triangle') {
            context.moveTo(x1, y2);
            context.lineTo(x1 + ((x2 - x1) / 2), y1);
            context.lineTo(x2, y2);
            context.closePath();
        } else if (mode === 'text') {
            drawTextLabel(context, x1, y1, options.text || 'Text', color, options.fontSize || 24);
            context.restore();
            return;
        }

        if (fill && (mode === 'rect' || mode === 'triangle')) {
            context.fillStyle = hexToRgba(fillColor, 0.35);
            context.fill();
        }

        context.stroke();

        if (arrow && arrowAngle !== null) {
            drawArrowHead(context, x2, y2, arrowAngle, color);
        }

        context.restore();
    }

    function drawFreehand(context, points, color, fillColor, fill) {
        if (!points || points.length === 0) return;
        context.save();
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.strokeStyle = color;
        context.lineWidth = toLogicalDistance(3);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.setLineDash([]);
        if (fill && points.length > 2) {
            context.closePath();
            context.fillStyle = hexToRgba(fillColor, 0.35);
            context.fill();
        }
        context.stroke();
        context.restore();
    }

    function drawFreehandPreview(color, fillColor, fill) {
        clearTempCanvas();
        drawFreehand(tCtx, currentFreehandPoints, color, fillColor, fill);
    }

    function getDrawingGeometry(drawing) {
        if (drawing.attachedTo) {
            const piece = document.getElementById(drawing.attachedTo);
            if (!piece) return null;
            const box = getPieceMetrics(piece);
            if (drawing.mode === 'text') {
                return {
                    x1: box.centerX + drawing.relX,
                    y1: box.centerY + drawing.relY
                };
            }
            return {
                x1: box.centerX,
                y1: box.centerY,
                x2: box.centerX + drawing.relX,
                y2: box.centerY + drawing.relY
            };
        }
        return drawing;
    }

    function getDrawingLength(geometry) {
        if (!geometry || typeof geometry.x2 !== 'number' || typeof geometry.y2 !== 'number') return 0;
        return Math.hypot(geometry.x2 - geometry.x1, geometry.y2 - geometry.y1);
    }

    function isDrawingMovable(drawing) {
        if (!drawing || drawing.attachedTo) return false;
        if (drawing.mode === 'text' || drawing.mode === 'rect' || drawing.mode === 'triangle') return true;
        if (drawing.mode === 'line' || drawing.mode === 'dashed' || drawing.mode === 'curve' || drawing.mode === 'curve-dashed' || drawing.mode === 'wave') {
            return !!drawing.arrow || getDrawingLength(getDrawingGeometry(drawing)) >= toLogicalDistance(movableLineThresholdPx);
        }
        return false;
    }

    function drawingContainsPoint(drawing, point) {
        const geometry = getDrawingGeometry(drawing);
        if (!geometry) return false;
        const radius = toLogicalDistance(12);

        if (drawing.mode === 'line' || drawing.mode === 'dashed') {
            return distancePointToSegment(point.x, point.y, geometry.x1, geometry.y1, geometry.x2, geometry.y2) <= radius;
        }

        if (drawing.mode === 'curve' || drawing.mode === 'curve-dashed') {
            const { cx, cy } = getCurveControlPoint(geometry.x1, geometry.y1, geometry.x2, geometry.y2, drawing);
            const curvePoints = [];
            for (let i = 0; i <= 24; i++) {
                const t = i / 24;
                const inv = 1 - t;
                curvePoints.push({
                    x: (inv * inv * geometry.x1) + (2 * inv * t * cx) + (t * t * geometry.x2),
                    y: (inv * inv * geometry.y1) + (2 * inv * t * cy) + (t * t * geometry.y2)
                });
            }
            return pointNearPolyline(point, curvePoints, radius);
        }

        if (drawing.mode === 'wave') {
            return pointNearPolyline(point, buildWavePoints(geometry.x1, geometry.y1, geometry.x2, geometry.y2), radius);
        }

        if (drawing.mode === 'rect') {
            const left = Math.min(geometry.x1, geometry.x2);
            const right = Math.max(geometry.x1, geometry.x2);
            const top = Math.min(geometry.y1, geometry.y2);
            const bottom = Math.max(geometry.y1, geometry.y2);
            const margin = toLogicalDistance(8);
            return point.x >= left - margin && point.x <= right + margin && point.y >= top - margin && point.y <= bottom + margin;
        }

        if (drawing.mode === 'triangle') {
            const triangle = [
                { x: geometry.x1, y: geometry.y2 },
                { x: geometry.x1 + ((geometry.x2 - geometry.x1) / 2), y: geometry.y1 },
                { x: geometry.x2, y: geometry.y2 }
            ];
            return pointInPolygon(point, triangle) || pointNearPolyline(point, [...triangle, triangle[0]], radius);
        }

        if (drawing.mode === 'text') {
            const metrics = getTextMetrics(drawing.text || 'Text', drawing.fontSize || 24);
            const marginX = toLogicalX(8);
            const marginTop = toLogicalY(6);
            const marginBottom = toLogicalY(8);
            return (
                point.x >= geometry.x1 - marginX &&
                point.x <= geometry.x1 + metrics.width + marginX &&
                point.y >= geometry.y1 - marginTop &&
                point.y <= geometry.y1 + metrics.height + marginBottom
            );
        }

        return false;
    }

    function getMovableDrawingIndexAtPoint(point) {
        for (let i = drawings.length - 1; i >= 0; i--) {
            if (!isDrawingMovable(drawings[i])) continue;
            if (drawingContainsPoint(drawings[i], point)) return i;
        }
        return -1;
    }

    function startDrawingDrag(index, point) {
        activeDrawingIndex = index;
        activeDrawingStart = point;
        activeDrawingSnapshot = cloneData(drawings[index]);
        pitch.style.cursor = 'grabbing';
        document.onmousemove = moveDrawingDrag;
        document.onmouseup = stopDrawingDrag;
    }

    function moveDrawingDrag(event) {
        if (activeDrawingIndex < 0 || !activeDrawingSnapshot || !activeDrawingStart) return;
        const pos = getMousePos(event);
        const dx = pos.x - activeDrawingStart.x;
        const dy = pos.y - activeDrawingStart.y;
        const snapshot = activeDrawingSnapshot;
        const drawing = drawings[activeDrawingIndex];
        if (!drawing) return;

        if (snapshot.mode === 'text') {
            drawing.x1 = snapshot.x1 + dx;
            drawing.y1 = snapshot.y1 + dy;
            return;
        }

        drawing.x1 = snapshot.x1 + dx;
        drawing.y1 = snapshot.y1 + dy;
        drawing.x2 = snapshot.x2 + dx;
        drawing.y2 = snapshot.y2 + dy;
    }

    function stopDrawingDrag() {
        activeDrawingIndex = -1;
        activeDrawingStart = null;
        activeDrawingSnapshot = null;
        document.onmousemove = null;
        document.onmouseup = null;
        if (!drawingActive) pitch.style.cursor = 'default';
    }

    function renderAllDrawings() {
        syncCanvasesToPitch();
        clearLogicalCanvas(ctx, canvas);
        clearLogicalCanvas(aCtx, attachedCanvas);

        drawings.forEach((drawing) => {
            if (drawing.mode === 'free') {
                drawFreehand(ctx, drawing.points, drawing.color, drawing.fillColor, drawing.fill);
                return;
            }

            const geometry = getDrawingGeometry(drawing);
            if (!geometry) return;
            const targetContext = drawing.attachedTo ? aCtx : ctx;
            drawShape(
                targetContext,
                geometry.x1,
                geometry.y1,
                geometry.x2,
                geometry.y2,
                drawing.mode,
                drawing.color,
                drawing.fillColor,
                drawing.fill,
                drawing.arrow,
                drawing
            );
        });
    }

    function renderLinks() {
        let svgContent = '';
        links.forEach((link) => {
            const first = document.getElementById(link.id1);
            const second = document.getElementById(link.id2);
            if (!first || !second) return;
            const box1 = getPieceMetrics(first);
            const box2 = getPieceMetrics(second);
            svgContent += `<line x1="${box1.centerX}" y1="${box1.centerY}" x2="${box2.centerX}" y2="${box2.centerY}" stroke="white" stroke-width="${toLogicalDistance(3)}" stroke-dasharray="${toLogicalDistance(5)},${toLogicalDistance(5)}" />`;
        });
        svgLinks.innerHTML = svgContent;
    }

    function renderDynamics() {
        renderLinks();
        renderAllDrawings();
        tacticBoardAnimationFrameId = requestAnimationFrame(renderDynamics);
    }

    function distancePointToSegment(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
        const t = Math.max(0, Math.min(1, (((px - x1) * dx) + ((py - y1) * dy)) / ((dx * dx) + (dy * dy))));
        const projX = x1 + (t * dx);
        const projY = y1 + (t * dy);
        return Math.hypot(px - projX, py - projY);
    }

    function pointNearPolyline(point, polyline, radius) {
        for (let i = 1; i < polyline.length; i++) {
            if (distancePointToSegment(point.x, point.y, polyline[i - 1].x, polyline[i - 1].y, polyline[i].x, polyline[i].y) <= radius) {
                return true;
            }
        }
        return false;
    }

    function pointInPolygon(point, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;
            const intersects = ((yi > point.y) !== (yj > point.y)) && (point.x < (((xj - xi) * (point.y - yi)) / ((yj - yi) || 1)) + xi);
            if (intersects) inside = !inside;
        }
        return inside;
    }

    function getEraserCheckPoints(x1, y1, x2, y2) {
        return [
            { x: x1, y: y1 },
            { x: x2, y: y2 },
            { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
        ];
    }

    function drawingIntersectsEraser(drawing, eraserPoints, radius) {
        if (drawing.mode === 'free') {
            if (eraserPoints.some((point) => pointNearPolyline(point, drawing.points, radius))) return true;
            return !!drawing.fill && eraserPoints.some((point) => pointInPolygon(point, drawing.points));
        }

        const geometry = getDrawingGeometry(drawing);
        if (!geometry) return false;

        if (drawing.mode === 'line' || drawing.mode === 'dashed') {
            return eraserPoints.some((point) => distancePointToSegment(point.x, point.y, geometry.x1, geometry.y1, geometry.x2, geometry.y2) <= radius);
        }

        if (drawing.mode === 'curve' || drawing.mode === 'curve-dashed') {
            const { cx, cy } = getCurveControlPoint(geometry.x1, geometry.y1, geometry.x2, geometry.y2, drawing);
            const curvePoints = [];
            for (let i = 0; i <= 24; i++) {
                const t = i / 24;
                const inv = 1 - t;
                curvePoints.push({
                    x: (inv * inv * geometry.x1) + (2 * inv * t * cx) + (t * t * geometry.x2),
                    y: (inv * inv * geometry.y1) + (2 * inv * t * cy) + (t * t * geometry.y2)
                });
            }
            return eraserPoints.some((point) => pointNearPolyline(point, curvePoints, radius));
        }

        if (drawing.mode === 'wave') {
            const wavePoints = buildWavePoints(geometry.x1, geometry.y1, geometry.x2, geometry.y2);
            return eraserPoints.some((point) => pointNearPolyline(point, wavePoints, radius));
        }

        if (drawing.mode === 'rect') {
            const left = Math.min(geometry.x1, geometry.x2);
            const right = Math.max(geometry.x1, geometry.x2);
            const top = Math.min(geometry.y1, geometry.y2);
            const bottom = Math.max(geometry.y1, geometry.y2);
            const edges = [
                { x: left, y: top },
                { x: right, y: top },
                { x: right, y: bottom },
                { x: left, y: bottom },
                { x: left, y: top }
            ];
            if (eraserPoints.some((point) => pointNearPolyline(point, edges, radius))) return true;
            return !!drawing.fill && eraserPoints.some((point) => point.x >= left && point.x <= right && point.y >= top && point.y <= bottom);
        }

        if (drawing.mode === 'triangle') {
            const triangle = [
                { x: geometry.x1, y: geometry.y2 },
                { x: geometry.x1 + ((geometry.x2 - geometry.x1) / 2), y: geometry.y1 },
                { x: geometry.x2, y: geometry.y2 },
                { x: geometry.x1, y: geometry.y2 }
            ];
            if (eraserPoints.some((point) => pointNearPolyline(point, triangle, radius))) return true;
            return !!drawing.fill && eraserPoints.some((point) => pointInPolygon(point, triangle));
        }

        if (drawing.mode === 'text') {
            const metrics = getTextMetrics(drawing.text || 'Text', drawing.fontSize || 24);
            const marginX = toLogicalX(8);
            const marginTop = toLogicalY(6);
            const marginBottom = toLogicalY(8);
            return eraserPoints.some((point) =>
                point.x >= geometry.x1 - marginX &&
                point.x <= geometry.x1 + metrics.width + marginX &&
                point.y >= geometry.y1 - marginTop &&
                point.y <= geometry.y1 + metrics.height + marginBottom
            );
        }

        return false;
    }

    function eraseDrawingsAlongPath(x1, y1, x2, y2) {
        const eraserPoints = getEraserCheckPoints(x1, y1, x2, y2);
        const radius = toLogicalDistance(18);
        drawings = drawings.filter((drawing) => !drawingIntersectsEraser(drawing, eraserPoints, radius));
        renderAllDrawings();
    }

    function captureFrameState() {
        return {
            pieces: Array.from(document.querySelectorAll('.piece')).map((piece) => {
                const nameEl = piece.querySelector('.name');
                const box = getPieceMetrics(piece);
                return {
                    id: piece.id,
                    kind: piece.dataset.kind,
                    num: piece.dataset.num,
                    x: box.centerX,
                    y: box.centerY,
                    name: nameEl ? nameEl.innerText : ''
                };
            }),
            drawings: cloneData(drawings),
            links: cloneData(links),
            layers: getLayerState(),
            playerSize: Number(document.getElementById('playerSize').value),
            zoomPreset: document.getElementById('zoomSelect').value,
            zoomLevel: Number(document.getElementById('zoomLevel').value)
        };
    }

    function updateItemCounter() {
        let highest = 0;
        document.querySelectorAll('.piece.ball, .piece.cone').forEach((piece) => {
            const match = piece.id.match(/-(\d+)$/);
            if (match) highest = Math.max(highest, Number(match[1]));
        });
        itemCounter = highest + 1;
    }

    function applyPieceState(pieceState) {
        const stateMap = new Map(pieceState.map((entry) => [entry.id, entry]));

        document.querySelectorAll('.piece.ball, .piece.cone').forEach((piece) => {
            if (!stateMap.has(piece.id)) piece.remove();
        });

        pieceState.forEach((entry) => {
            let piece = document.getElementById(entry.id);
            const centerX = normalizeLogicalX(entry.x);
            const centerY = normalizeLogicalY(entry.y);
            if (!piece) {
                piece = createPiece(entry.kind, entry.num, centerX, centerY, entry.id, 'logical');
            }

            setPieceCenter(piece, centerX, centerY);

            const nameEl = piece.querySelector('.name');
            if (nameEl) nameEl.innerText = entry.name || 'Namn';

            if (entry.kind === 'home') {
                const index = entry.id.split('-')[1];
                const input = document.getElementById(`input-home-${index}`);
                if (input) input.value = entry.name && entry.name !== 'Namn' ? entry.name : '';
            }
        });

        updateItemCounter();
        updateAllToggleButtons();
    }

    function applyFrameState(frame) {
        applyPieceState(frame.pieces || []);
        drawings = cloneData(frame.drawings || []);
        links = cloneData(frame.links || []);
        applyLayerState(frame.layers || {});
        setPlayerSize(frame.playerSize || defaultPlayerSize);
        document.getElementById('zoomSelect').value = frame.zoomPreset || 'full';
        document.getElementById('zoomLevel').value = frame.zoomLevel || 100;
        setZoom();
        renderLinks();
        renderAllDrawings();
    }

    function handleFrameClick(index, button, isShift) {
        if (!frames[index] || isShift) {
            frames[index] = captureFrameState();
            button.classList.add('saved');
        } else {
            applyFrameState(frames[index]);
        }

        document.querySelectorAll('.frame-btn').forEach((frameButton) => frameButton.classList.remove('active'));
        button.classList.add('active');
    }

    function clearTimeline() {
        frames = new Array(totalFrames).fill(null);
        document.querySelectorAll('.frame-btn').forEach((button) => {
            button.classList.remove('saved');
            button.classList.remove('active');
        });
    }

    async function playMovie() {
        const buttons = document.querySelectorAll('.frame-btn');
        for (let i = 0; i < totalFrames; i++) {
            if (!frames[i]) continue;
            handleFrameClick(i, buttons[i], false);
            await new Promise((resolve) => setTimeout(resolve, frameDelayMs));
        }
        buttons.forEach((button) => button.classList.remove('active'));
    }

    function clearCanvas() {
        drawings = [];
        activeDrawingIndex = -1;
        activeDrawingStart = null;
        activeDrawingSnapshot = null;
        clearTempCanvas();
        renderAllDrawings();
    }

    function takeScreenshot() {
        const originalTransform = captureArea.style.transform;
        const originalTransformOrigin = captureArea.style.transformOrigin;
        captureArea.style.transform = 'scale(1)';
        captureArea.style.transformOrigin = 'center center';
        setTimeout(() => {
            html2canvas(document.querySelector('#capture-wrapper')).then((imageCanvas) => {
                const link = document.createElement('a');
                link.download = 'taktik_master.png';
                link.href = imageCanvas.toDataURL();
                link.click();
                captureArea.style.transform = originalTransform;
                captureArea.style.transformOrigin = originalTransformOrigin;
            });
        }, 300);
    }

    pitch.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('name') || event.target.classList.contains('piece')) return;

        const pos = getMousePos(event);

        if (!drawingActive) {
            if (linkMode) return;
            const drawingIndex = getMovableDrawingIndexAtPoint(pos);
            if (drawingIndex !== -1) {
                startDrawingDrag(drawingIndex, pos);
                event.preventDefault();
            }
            return;
        }

        isDrawing = true;
        startX = pos.x;
        startY = pos.y;
        lastX = pos.x;
        lastY = pos.y;
        currentFreehandPoints = [];
        drawingAttachedTo = null;

        const mode = document.getElementById('drawMode').value;
        if (mode === 'free') {
            currentFreehandPoints = [{ x: pos.x, y: pos.y }];
        } else if (mode === 'eraser') {
            eraseDrawingsAlongPath(pos.x, pos.y, pos.x, pos.y);
        }
    });

    pitch.addEventListener('mousemove', (event) => {
        if (!isDrawing) return;

        const pos = getMousePos(event);
        const mode = document.getElementById('drawMode').value;
        const color = document.getElementById('drawColor').value;
        const fillColor = document.getElementById('fillColor').value;
        const fill = document.getElementById('fillShape').checked;
        const arrow = document.getElementById('drawArrow').checked;
        const curveSettings = getCurveSettings();
        const textSettings = getTextSettings();

        if (mode === 'eraser') {
            eraseDrawingsAlongPath(lastX, lastY, pos.x, pos.y);
            lastX = pos.x;
            lastY = pos.y;
            return;
        }

        if (mode === 'free' && !drawingAttachedTo) {
            currentFreehandPoints.push({ x: pos.x, y: pos.y });
            drawFreehandPreview(color, fillColor, fill);
            return;
        }

        clearTempCanvas();
        let shapeStartX = startX;
        let shapeStartY = startY;

        if (drawingAttachedTo) {
            const piece = document.getElementById(drawingAttachedTo);
            if (piece) {
                const box = getPieceMetrics(piece);
                shapeStartX = box.centerX;
                shapeStartY = box.centerY;
            }
        }

        if (mode === 'text') {
            drawTextLabel(tCtx, pos.x, pos.y, textSettings.text, color, textSettings.fontSize);
            return;
        }

        drawShape(tCtx, shapeStartX, shapeStartY, pos.x, pos.y, mode, color, fillColor, fill, arrow, curveSettings);
    });

    window.addEventListener('mouseup', (event) => {
        if (!isDrawing) return;

        isDrawing = false;
        const pos = getMousePos(event);
        const mode = document.getElementById('drawMode').value;
        const color = document.getElementById('drawColor').value;
        const fillColor = document.getElementById('fillColor').value;
        const fill = document.getElementById('fillShape').checked;
        const arrow = document.getElementById('drawArrow').checked;
        const curveSettings = getCurveSettings();
        const textSettings = getTextSettings();

        if (mode === 'eraser') {
            drawingAttachedTo = null;
            clearTempCanvas();
            return;
        }

        if (drawingAttachedTo) {
            const piece = document.getElementById(drawingAttachedTo);
            if (piece) {
                const box = getPieceMetrics(piece);
                if (mode === 'text') {
                    drawings.push({
                        attachedTo: drawingAttachedTo,
                        relX: pos.x - box.centerX,
                        relY: pos.y - box.centerY,
                        mode,
                        color,
                        text: textSettings.text,
                        fontSize: textSettings.fontSize
                    });
                } else {
                    drawings.push({
                        attachedTo: drawingAttachedTo,
                        relX: pos.x - box.centerX,
                        relY: pos.y - box.centerY,
                        mode,
                        color,
                        fillColor,
                        fill,
                        arrow,
                        ...curveSettings
                    });
                }
            }
            drawingAttachedTo = null;
            clearTempCanvas();
            return;
        }

        if (mode === 'free') {
            if (currentFreehandPoints.length > 1) {
                drawings.push({
                    mode: 'free',
                    points: cloneData(currentFreehandPoints),
                    color,
                    fillColor,
                    fill,
                    arrow: false
                });
            }
            currentFreehandPoints = [];
            clearTempCanvas();
            return;
        }

        if (mode === 'text') {
            drawings.push({
                mode,
                x1: pos.x,
                y1: pos.y,
                color,
                text: textSettings.text,
                fontSize: textSettings.fontSize
            });
            clearTempCanvas();
            return;
        }

        drawings.push({
            mode,
            x1: startX,
            y1: startY,
            x2: pos.x,
            y2: pos.y,
            color,
            fillColor,
            fill,
            arrow,
            ...curveSettings
        });
        clearTempCanvas();
    });

    document.addEventListener('click', (event) => {
        const dropdown = document.getElementById('layerDropdown');
        if (dropdown && !dropdown.contains(event.target)) dropdown.classList.remove('open');
    });

    init();

    window.addEventListener = originalWindowAddEventListener;
    document.addEventListener = originalDocumentAddEventListener;

    window.__cleanupTacticBoard = () => {
        if (tacticBoardAnimationFrameId !== null) {
            cancelAnimationFrame(tacticBoardAnimationFrameId);
            tacticBoardAnimationFrameId = null;
        }

        if (pitchResizeObserver) {
            pitchResizeObserver.disconnect();
            pitchResizeObserver = null;
        }

        tacticBoardListeners.forEach(({ target, type, listener, options }) => {
            if (target === window) {
                originalWindowRemoveEventListener(type, listener, options);
            } else {
                originalDocumentRemoveEventListener(type, listener, options);
            }
        });

        tacticBoardListeners.length = 0;
        document.onmousemove = null;
        document.onmouseup = null;
    };


  window.init = init;
  window.buildSidebar = buildSidebar;
  window.createInitialPieces = createInitialPieces;
  window.initTimeline = initTimeline;
  window.initFormationButtons = initFormationButtons;
  window.createFormationButton = createFormationButton;
  window.createPiece = createPiece;
  window.getPieceMetrics = getPieceMetrics;
  window.setPieceCenter = setPieceCenter;
  window.isPieceBenched = isPieceBenched;
  window.getMousePos = getMousePos;
  window.__TACTICS_BOARD_BOUNDS = boardBounds;
  window.syncCanvasesToPitch = syncCanvasesToPitch;
  window.updateSidebarName = updateSidebarName;
  window.changeName = changeName;
  window.updatePlayerToggleButton = updatePlayerToggleButton;
  window.updateAllToggleButtons = updateAllToggleButtons;
  window.togglePlayerBench = togglePlayerBench;
  window.movePieceToBench = movePieceToBench;
  window.serializePiecePosition = serializePiecePosition;
  window.setTeamAvailability = setTeamAvailability;
  window.clearPlayers = clearPlayers;
  window.addBall = addBall;
  window.addCone = addCone;
  window.setPlayerSize = setPlayerSize;
  window.updateToolSettingsLabels = updateToolSettingsLabels;
  window.updateToolOptionsVisibility = updateToolOptionsVisibility;
  window.getCurveSettings = getCurveSettings;
  window.getTextSettings = getTextSettings;
  window.updateFormationButtonState = updateFormationButtonState;
  window.applyFormation = applyFormation;
  window.toggleDropdownMenu = toggleDropdownMenu;
  window.toggleLayer = toggleLayer;
  window.syncLayerCheckboxes = syncLayerCheckboxes;
  window.getLayerState = getLayerState;
  window.applyLayerState = applyLayerState;
  window.setZoom = setZoom;
  window.toggleLinkMode = toggleLinkMode;
  window.clearLinks = clearLinks;
  window.handlePieceClick = handlePieceClick;
  window.moveDrag = moveDrag;
  window.stopDrag = stopDrag;
  window.toggleDrawing = toggleDrawing;
  window.hexToRgba = hexToRgba;
  window.cloneData = cloneData;
  window.getCurveControlPoint = getCurveControlPoint;
  window.buildWavePoints = buildWavePoints;
  window.drawArrowHead = drawArrowHead;
  window.getTextMetrics = getTextMetrics;
  window.drawTextLabel = drawTextLabel;
  window.drawShape = drawShape;
  window.drawFreehand = drawFreehand;
  window.drawFreehandPreview = drawFreehandPreview;
  window.getDrawingGeometry = getDrawingGeometry;
  window.getDrawingLength = getDrawingLength;
  window.isDrawingMovable = isDrawingMovable;
  window.drawingContainsPoint = drawingContainsPoint;
  window.getMovableDrawingIndexAtPoint = getMovableDrawingIndexAtPoint;
  window.startDrawingDrag = startDrawingDrag;
  window.moveDrawingDrag = moveDrawingDrag;
  window.stopDrawingDrag = stopDrawingDrag;
  window.renderAllDrawings = renderAllDrawings;
  window.renderLinks = renderLinks;
  window.renderDynamics = renderDynamics;
  window.distancePointToSegment = distancePointToSegment;
  window.pointNearPolyline = pointNearPolyline;
  window.pointInPolygon = pointInPolygon;
  window.getEraserCheckPoints = getEraserCheckPoints;
  window.drawingIntersectsEraser = drawingIntersectsEraser;
  window.eraseDrawingsAlongPath = eraseDrawingsAlongPath;
  window.captureFrameState = captureFrameState;
  window.updateItemCounter = updateItemCounter;
  window.applyPieceState = applyPieceState;
  window.applyFrameState = applyFrameState;
  window.handleFrameClick = handleFrameClick;
  window.clearTimeline = clearTimeline;
  window.playMovie = playMovie;
  window.clearCanvas = clearCanvas;
  window.takeScreenshot = takeScreenshot;
})();
