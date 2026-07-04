/**
 * Jokuh Arcade Chess — minimalist monochrome chess vs the OO agent.
 * Dependency-free canvas runtime. Posts `arcade-session-complete` on game end.
 *
 * You play White; OO plays Black. The HUD rows above/below the board show whose
 * turn it is (row highlight + animated "thinking" dots while OO computes).
 *
 * Engine: full legal move generation including castling, en passant, and pawn
 * promotion, with a correct square-attack test (pawn pushes never attack).
 * OO uses minimax with alpha-beta pruning and capture-first move ordering.
 *
 * Rendering: HiDPI-aware canvas, soft two-tone board, distinct glyph sets per
 * side (outline for White, filled for Black), selected/legal-move/last-move/check
 * highlights, and a short slide animation for every move so nothing pops.
 *
 * OO commentary: dynamic quips displayed in OO's row based on game events —
 * captures, checks, advantages, and general banter.
 */
(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('status');
  const rowOo = document.getElementById('row-oo');
  const rowYou = document.getElementById('row-you');
  const capturesOoEl = document.getElementById('captures-oo');
  const capturesYouEl = document.getElementById('captures-you');
  const ooQuipEl = document.getElementById('oo-quip');

  // ---- Palette --------------------------------------------------------------
  const LIGHT_SQ = '#f6f4ef';
  const DARK_SQ = '#b9b2a6';
  const SELECT_FILL = 'rgba(17,17,17,0.20)';
  const LAST_MOVE_FILL = 'rgba(180,160,60,0.28)';
  const CHECK_FILL = 'rgba(200,60,45,0.38)';
  const DOT_FILL = 'rgba(17,17,17,0.30)';
  const RING_STROKE = 'rgba(17,17,17,0.34)';
  const COORD_LIGHT = 'rgba(17,17,17,0.35)';

  // Outline glyphs for White (♔♕♖♗♘♙) — visually distinct from Black's filled set.
  const GLYPH_WHITE = { k: '\u2654', q: '\u2655', r: '\u2656', b: '\u2657', n: '\u2658', p: '\u2659' };
  // Filled glyphs for Black (♚♛♜♝♞♟).
  const GLYPH_BLACK = { k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F' };
  // Captures display: White pieces captured by OO shown as outline, Black captured by you as filled.
  const CAPTURE_GLYPH_WHITE = GLYPH_WHITE;
  const CAPTURE_GLYPH_BLACK = GLYPH_BLACK;
  const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

  // ---- OO Commentary --------------------------------------------------------
  const OO_QUIPS = {
    gameStart: [
      "Let's see what you've got.",
      "Your move first. No pressure.",
      "I've been waiting for this.",
      "Hope you warmed up.",
      "Show me something interesting.",
    ],
    yourMove: [
      "Take your time\u2026 I'm patient.",
      "Hmm, curious position.",
      "What will you do?",
      "I see several options for you.",
      "Interesting\u2026",
      "Go on then.",
      "I'm watching.",
      "\u2026",
    ],
    ooThinking: [
      "Let me think about this\u2026",
      "Hmm\u2026",
      "Calculating\u2026",
      "One moment\u2026",
      "Let me see\u2026",
      "Processing\u2026",
    ],
    ooCapturedYours: [
      "I'll take that, thanks.",
      "Mine now.",
      "You left that hanging.",
      "Snack time.",
      "Oops\u2026 was that important?",
      "Don't worry, I'll take good care of it.",
      "Nom nom.",
      "That's one fewer piece for you.",
    ],
    youCapturedOos: [
      "Nice move, I'll admit.",
      "Fair enough.",
      "I see you.",
      "Okay, respect.",
      "That stings a little.",
      "Well played\u2026 this time.",
      "You'll pay for that.",
      "I was done with that piece anyway.",
    ],
    youCapturedQueen: [
      "My queen! You monster.",
      "Okay that actually hurts.",
      "Well. This got real.",
    ],
    ooCapturedQueen: [
      "Your queen is mine. Sorry not sorry.",
      "Checkmate is inevitable now\u2026 maybe.",
      "That was your best piece.",
    ],
    ooInCheck: [
      "Hey! Watch it.",
      "Rude.",
      "I see what you did there.",
      "Not bad. But I'll recover.",
      "You're getting bold.",
    ],
    youInCheck: [
      "Check. Careful now.",
      "Check! What are you gonna do?",
      "Your king is sweating.",
      "Nowhere to hide\u2026",
      "Check. Choose wisely.",
    ],
    ooWinning: [
      "I like where this is going.",
      "Things are looking good for me.",
      "You seem a bit\u2026 outmatched.",
      "Should I go easy on you?",
    ],
    youWinning: [
      "Okay, you're actually good.",
      "I underestimated you.",
      "Fine. I'll try harder.",
      "Lucky\u2026",
    ],
    ooWins: [
      "GG! Better luck next time.",
      "I enjoyed that. Rematch?",
      "Checkmate. I tried to go easy.",
      "Don't feel bad. I'm literally software.",
    ],
    youWin: [
      "Wait\u2026 what just happened?",
      "Okay, you got me. Rematch?",
      "Impressive. I won't make that mistake again.",
      "GG. That was clean.",
    ],
    draw: [
      "A draw? I'll take it.",
      "Stalemate. We're equally matched\u2026 for now.",
      "Neither of us loses. I can live with that.",
    ],
  };

  let lastQuipIndex = {};
  function pickQuip(category) {
    const pool = OO_QUIPS[category];
    if (!pool || pool.length === 0) return '';
    if (lastQuipIndex[category] === undefined) lastQuipIndex[category] = -1;
    let idx;
    do {
      idx = Math.floor(Math.random() * pool.length);
    } while (pool.length > 1 && idx === lastQuipIndex[category]);
    lastQuipIndex[category] = idx;
    return pool[idx];
  }

  function setOoQuip(text) {
    if (ooQuipEl) {
      ooQuipEl.textContent = text;
      ooQuipEl.style.opacity = '0';
      requestAnimationFrame(() => {
        ooQuipEl.style.transition = 'opacity 0.3s ease';
        ooQuipEl.style.opacity = '1';
      });
    }
  }

  // ---- Multiplayer state (inactive until jokuhArcadeInit is called) ---------
  let multiplayerMode = false;
  let myMatchId = null;
  let mySide = null;       // 'w' or 'b' — which color the local player controls
  let opponentName = '';

  // ---- State ----------------------------------------------------------------
  // Board: 8x8 of null or { type: 'p|n|b|r|q|k', color: 'w|b' }.
  let board, turn, gameOver, resultText, moveCount;
  let castling;              // { wK, wQ, bK, bQ } rights
  let enPassant;             // target square {r,c} capturable this ply, or null
  let selected = null;       // {r,c} of the player's selected piece
  let legalForSelected = []; // legal moves for the selected piece
  let lastMove = null;       // { from:{r,c}, to:{r,c} } for highlight
  let captured = { w: [], b: [] }; // piece types each side has captured
  let anim = null;           // { piece, from, to, start, dur } slide animation
  let aiTimer = null;

  let cell = 64;             // CSS px per square
  let dpr = 1;

  function initialBoard() {
    const back = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    const b = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let c = 0; c < 8; c++) {
      b[0][c] = { type: back[c], color: 'b' };
      b[1][c] = { type: 'p', color: 'b' };
      b[6][c] = { type: 'p', color: 'w' };
      b[7][c] = { type: back[c], color: 'w' };
    }
    return b;
  }

  // ---- Attack / move generation ----------------------------------------------

  function isAttackedSlider(b, r, c, color) {
    const scans = [
      { dirs: [[-1,0],[1,0],[0,-1],[0,1]], types: ['r', 'q'] },
      { dirs: [[-1,-1],[-1,1],[1,-1],[1,1]], types: ['b', 'q'] },
    ];
    for (const { dirs, types } of scans) {
      for (const [dr, dc] of dirs) {
        for (let k = 1; k < 8; k++) {
          const nr = r + dr * k, nc = c + dc * k;
          if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
          const p = b[nr][nc];
          if (!p) continue;
          if (p.color === color && types.includes(p.type)) return true;
          break;
        }
      }
    }
    return false;
  }

  function squareAttacked(b, r, c, byColor) {
    const pr = byColor === 'w' ? r + 1 : r - 1;
    for (const dc of [-1, 1]) {
      const p = b[pr]?.[c + dc];
      if (p && p.color === byColor && p.type === 'p') return true;
    }
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
      const p = b[r + dr]?.[c + dc];
      if (p && p.color === byColor && p.type === 'n') return true;
    }
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const p = b[r + dr]?.[c + dc];
        if (p && p.color === byColor && p.type === 'k') return true;
      }
    return isAttackedSlider(b, r, c, byColor);
  }

  function findKing(b, color) {
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.type === 'k' && p.color === color) return { r, c };
      }
    return null;
  }

  function inCheck(b, color) {
    const k = findKing(b, color);
    return !k || squareAttacked(b, k.r, k.c, color === 'w' ? 'b' : 'w');
  }

  function pieceMoves(st, r, c) {
    const b = st.board;
    const piece = b[r][c];
    if (!piece) return [];
    const color = piece.color;
    const out = [];
    const push = (tr, tc, extra) => out.push({ from: { r, c }, to: { r: tr, c: tc }, ...(extra || {}) });

    const tryStep = (tr, tc) => {
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return false;
      const t = b[tr][tc];
      if (t && t.color === color) return false;
      push(tr, tc);
      return !t;
    };

    switch (piece.type) {
      case 'p': {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        const promoRow = color === 'w' ? 0 : 7;
        const one = r + dir;
        if (one >= 0 && one <= 7 && !b[one][c]) {
          if (one === promoRow) push(one, c, { promo: 'q' });
          else push(one, c);
          if (r === startRow && !b[r + dir * 2][c]) push(r + dir * 2, c);
        }
        for (const dc of [-1, 1]) {
          const nc = c + dc;
          if (nc < 0 || nc > 7) continue;
          const t = b[one]?.[nc];
          if (t && t.color !== color) {
            if (one === promoRow) push(one, nc, { promo: 'q' });
            else push(one, nc);
          } else if (st.enPassant && st.enPassant.r === one && st.enPassant.c === nc) {
            push(one, nc, { ep: true });
          }
        }
        break;
      }
      case 'n':
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) tryStep(r + dr, c + dc);
        break;
      case 'k': {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (dr || dc) tryStep(r + dr, c + dc);
          }
        const home = color === 'w' ? 7 : 0;
        const enemy = color === 'w' ? 'b' : 'w';
        if (r === home && c === 4 && !squareAttacked(b, home, 4, enemy)) {
          const rights = st.castling;
          if ((color === 'w' ? rights.wK : rights.bK) &&
              !b[home][5] && !b[home][6] &&
              b[home][7] && b[home][7].type === 'r' && b[home][7].color === color &&
              !squareAttacked(b, home, 5, enemy) && !squareAttacked(b, home, 6, enemy)) {
            push(home, 6, { castle: 'K' });
          }
          if ((color === 'w' ? rights.wQ : rights.bQ) &&
              !b[home][3] && !b[home][2] && !b[home][1] &&
              b[home][0] && b[home][0].type === 'r' && b[home][0].color === color &&
              !squareAttacked(b, home, 3, enemy) && !squareAttacked(b, home, 2, enemy)) {
            push(home, 2, { castle: 'Q' });
          }
        }
        break;
      }
      default: {
        const dirs = piece.type === 'r' ? [[-1,0],[1,0],[0,-1],[0,1]]
          : piece.type === 'b' ? [[-1,-1],[-1,1],[1,-1],[1,1]]
          : [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
        for (const [dr, dc] of dirs)
          for (let k = 1; k < 8; k++)
            if (!tryStep(r + dr * k, c + dc * k)) break;
      }
    }
    return out;
  }

  function applyMove(st, mv) {
    const b = st.board.map(row => row.map(p => (p ? { ...p } : null)));
    const piece = b[mv.from.r][mv.from.c];
    let capturedPiece = b[mv.to.r][mv.to.c];

    if (mv.ep) {
      capturedPiece = b[mv.from.r][mv.to.c];
      b[mv.from.r][mv.to.c] = null;
    }

    b[mv.to.r][mv.to.c] = mv.promo ? { type: mv.promo, color: piece.color } : piece;
    b[mv.from.r][mv.from.c] = null;

    if (mv.castle) {
      const home = piece.color === 'w' ? 7 : 0;
      if (mv.castle === 'K') { b[home][5] = b[home][7]; b[home][7] = null; }
      else { b[home][3] = b[home][0]; b[home][0] = null; }
    }

    const castlingNext = { ...st.castling };
    if (piece.type === 'k') {
      if (piece.color === 'w') { castlingNext.wK = false; castlingNext.wQ = false; }
      else { castlingNext.bK = false; castlingNext.bQ = false; }
    }
    const touches = (r, c) => (mv.from.r === r && mv.from.c === c) || (mv.to.r === r && mv.to.c === c);
    if (touches(7, 0)) castlingNext.wQ = false;
    if (touches(7, 7)) castlingNext.wK = false;
    if (touches(0, 0)) castlingNext.bQ = false;
    if (touches(0, 7)) castlingNext.bK = false;

    let epNext = null;
    if (piece.type === 'p' && Math.abs(mv.to.r - mv.from.r) === 2) {
      epNext = { r: (mv.to.r + mv.from.r) / 2, c: mv.from.c };
    }

    return { board: b, castling: castlingNext, enPassant: epNext, capturedPiece };
  }

  function legalMoves(st, color) {
    const out = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = st.board[r][c];
        if (!p || p.color !== color) continue;
        for (const mv of pieceMoves(st, r, c)) {
          const next = applyMove(st, mv);
          if (!inCheck(next.board, color)) out.push(mv);
        }
      }
    return out;
  }

  // ---- Evaluation + search (OO plays Black, minimizing) -----------------------
  const PST_PAWN = [
    [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],
    [0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0],
  ];
  const PST_KNIGHT = [
    [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],
    [-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50],
  ];

  function evaluate(b) {
    let score = 0;
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (!p) continue;
        let v = PIECE_VALUES[p.type];
        if (p.type === 'p') v += p.color === 'w' ? PST_PAWN[r][c] : PST_PAWN[7 - r][c];
        if (p.type === 'n') v += p.color === 'w' ? PST_KNIGHT[r][c] : PST_KNIGHT[7 - r][c];
        score += p.color === 'w' ? v : -v;
      }
    return score;
  }

  function materialBalance(b) {
    let w = 0, bk = 0;
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (!p || p.type === 'k') continue;
        if (p.color === 'w') w += PIECE_VALUES[p.type];
        else bk += PIECE_VALUES[p.type];
      }
    return w - bk;
  }

  function orderedMoves(st, color) {
    const moves = legalMoves(st, color);
    return moves.sort((a, b2) => {
      const ta = st.board[a.to.r][a.to.c] ? PIECE_VALUES[st.board[a.to.r][a.to.c].type] : 0;
      const tb = st.board[b2.to.r][b2.to.c] ? PIECE_VALUES[st.board[b2.to.r][b2.to.c].type] : 0;
      return tb - ta;
    });
  }

  function minimax(st, depth, alpha, beta, maximizing) {
    const color = maximizing ? 'w' : 'b';
    const moves = orderedMoves(st, color);
    if (moves.length === 0) {
      if (inCheck(st.board, color)) return maximizing ? -100000 + depth : 100000 - depth;
      return 0;
    }
    if (depth === 0) return evaluate(st.board);

    if (maximizing) {
      let best = -Infinity;
      for (const mv of moves) {
        const nx = applyMove(st, mv);
        best = Math.max(best, minimax({ board: nx.board, castling: nx.castling, enPassant: nx.enPassant }, depth - 1, alpha, beta, false));
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
      return best;
    }
    let best = Infinity;
    for (const mv of moves) {
      const nx = applyMove(st, mv);
      best = Math.min(best, minimax({ board: nx.board, castling: nx.castling, enPassant: nx.enPassant }, depth - 1, alpha, beta, true));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  function chooseOoMove() {
    const st = { board, castling, enPassant };
    const moves = orderedMoves(st, 'b');
    if (moves.length === 0) return null;
    let bestScore = Infinity;
    let best = [];
    for (const mv of moves) {
      const nx = applyMove(st, mv);
      const s = minimax({ board: nx.board, castling: nx.castling, enPassant: nx.enPassant }, 2, -Infinity, Infinity, true);
      if (s < bestScore - 0.001) { bestScore = s; best = [mv]; }
      else if (Math.abs(s - bestScore) < 0.001) best.push(mv);
    }
    return best[Math.floor(Math.random() * best.length)];
  }

  // ---- Game flow ---------------------------------------------------------------

  function commitMove(mv, mover) {
    const st = { board, castling, enPassant };
    const movingPiece = board[mv.from.r][mv.from.c];
    const next = applyMove(st, mv);
    const wasCaptured = next.capturedPiece;
    if (wasCaptured) captured[mover].push(wasCaptured.type);

    board = next.board;
    castling = next.castling;
    enPassant = next.enPassant;
    lastMove = { from: mv.from, to: mv.to };
    moveCount++;

    anim = { piece: { ...movingPiece, ...(mv.promo ? { type: mv.promo } : {}) }, from: mv.from, to: mv.to, start: performance.now(), dur: 180 };

    turn = mover === 'w' ? 'b' : 'w';
    updateTurnUi();

    // OO / opponent commentary based on what just happened.
    const opponentColor = multiplayerMode ? (mySide === 'w' ? 'b' : 'w') : 'b';
    if (mover === opponentColor && wasCaptured) {
      if (wasCaptured.type === 'q') setOoQuip(pickQuip('ooCapturedQueen'));
      else setOoQuip(pickQuip('ooCapturedYours'));
    } else if (mover !== opponentColor && wasCaptured) {
      if (wasCaptured.type === 'q') setOoQuip(pickQuip('youCapturedQueen'));
      else setOoQuip(pickQuip('youCapturedOos'));
    }

    checkEndCondition(mv, mover);
  }

  /**
   * Checks for checkmate, stalemate, or draw after a move. In single-player
   * mode triggers the AI opponent; in multiplayer posts the move to the native
   * shell and waits for the remote opponent's move via jokuhArcadeApplyMove.
   */
  function checkEndCondition(lastMv, mover) {
    const moves = legalMoves({ board, castling, enPassant }, turn);
    const checked = inCheck(board, turn);
    const localColor = multiplayerMode ? mySide : 'w';
    const opponentLabel = multiplayerMode ? opponentName : 'OO';

    if (moves.length === 0) {
      gameOver = true;
      let resultKind = null;
      if (checked) {
        const loserIsLocal = turn === localColor;
        resultText = loserIsLocal
          ? `${opponentLabel} wins \u2014 checkmate.`
          : 'You win \u2014 checkmate!';
        resultKind = loserIsLocal ? 'loss' : 'win';
        setOoQuip(pickQuip(loserIsLocal ? 'ooWins' : 'youWin'));
      } else {
        resultText = 'Draw \u2014 stalemate.';
        resultKind = 'draw';
        setOoQuip(pickQuip('draw'));
      }
      statusEl.textContent = resultText + (multiplayerMode ? ' Tap for rematch.' : ' Tap to play again.');
      setThinking(false);

      if (multiplayerMode && lastMv && mover === localColor) {
        postMultiplayerMove(lastMv, true, resultKind);
      }
      postResult();
      return;
    }

    // --- Multiplayer: post the local player's move, then wait ---
    if (multiplayerMode) {
      if (lastMv && mover === localColor) {
        postMultiplayerMove(lastMv, false, null);
      }
      if (turn === localColor) {
        statusEl.textContent = checked ? 'Check! Your move.' : 'Your move.';
        if (checked) setOoQuip(pickQuip('youInCheck'));
        else if (moveCount > 2 && Math.random() < 0.35) setOoQuip(pickQuip('yourMove'));
      } else {
        statusEl.textContent = checked
          ? `${opponentLabel} is in check\u2026`
          : `Waiting for ${opponentLabel}\u2026`;
        if (checked) setOoQuip(pickQuip('ooInCheck'));
      }
      return;
    }

    // --- Single-player path (original OO AI logic) ---
    if (turn === 'w') {
      statusEl.textContent = checked ? 'Check! Your move.' : 'Your move.';
      if (checked) {
        setOoQuip(pickQuip('youInCheck'));
      } else {
        const bal = materialBalance(board);
        if (bal < -300 && moveCount > 6) setOoQuip(pickQuip('ooWinning'));
        else if (bal > 300 && moveCount > 6) setOoQuip(pickQuip('youWinning'));
        else if (moveCount > 2 && Math.random() < 0.35) setOoQuip(pickQuip('yourMove'));
      }
    } else {
      statusEl.textContent = checked ? 'OO is in check\u2026' : 'OO is thinking\u2026';
      if (checked) setOoQuip(pickQuip('ooInCheck'));
      else if (Math.random() < 0.3) setOoQuip(pickQuip('ooThinking'));
      setThinking(true);
      aiTimer = setTimeout(() => {
        const mv = chooseOoMove();
        setThinking(false);
        if (mv) commitMove(mv, 'b');
      }, 420 + Math.random() * 500);
    }
  }

  function setThinking(on) {
    rowOo.classList.toggle('thinking-on', on);
  }

  function updateTurnUi() {
    const localColor = multiplayerMode ? mySide : 'w';
    rowYou.classList.toggle('active', !gameOver && turn === localColor);
    rowOo.classList.toggle('active', !gameOver && turn !== localColor);
    if (multiplayerMode && mySide === 'b') {
      capturesYouEl.textContent = captured.b.map(t => GLYPH_WHITE[t]).join(' ');
      capturesOoEl.textContent = captured.w.map(t => GLYPH_BLACK[t]).join(' ');
    } else {
      capturesYouEl.textContent = captured.w.map(t => GLYPH_BLACK[t]).join(' ');
      capturesOoEl.textContent = captured.b.map(t => GLYPH_WHITE[t]).join(' ');
    }
  }

  // ---- Multiplayer move posting ------------------------------------------------

  /**
   * Serializes the full board state for storage in arcade_matches.board_state.
   * Returns piece positions, castling rights, en passant target, side to move,
   * and the move counter — enough to fully restore the game.
   */
  function serializeBoardState() {
    const pieces = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) pieces.push({ r, c, type: p.type, color: p.color });
      }
    return {
      pieces,
      castling: { ...castling },
      enPassant: enPassant ? { ...enPassant } : null,
      turn,
      moveCount,
    };
  }

  /**
   * Posts a move to the native shell (WKWebView messageHandler) and to the
   * parent frame (web iframe). Called only in multiplayer mode after the local
   * player makes a move.
   */
  function postMultiplayerMove(mv, isTerminal, resultKind) {
    const payload = {
      source: 'jokuh-arcade',
      type: 'arcade-move',
      matchId: myMatchId,
      move: { from: mv.from, to: mv.to, promotion: mv.promo || null },
      boardState: serializeBoardState(),
      isTerminal: !!isTerminal,
      winnerId: null,
      resultKind: resultKind,
    };
    try { window.webkit?.messageHandlers?.jokuhArcade?.postMessage(payload); } catch (_) {}
    try { window.parent?.postMessage(payload, '*'); } catch (_) {}
  }

  /** Posts a rematch request to the native shell; the host creates a new match and invite. */
  function postRematchRequest() {
    statusEl.textContent = 'Rematch requested\u2026';
    const payload = {
      source: 'jokuh-arcade',
      type: 'arcade-rematch',
      matchId: myMatchId,
      gameSlug: 'chess',
      opponentName: opponentName,
    };
    try { window.webkit?.messageHandlers?.jokuhArcade?.postMessage(payload); } catch (_) {}
    try { window.parent?.postMessage(payload, '*'); } catch (_) {}
  }

  function postResult() {
    const won = resultText.includes('You win');
    const lost = !won && !resultText.includes('Draw');
    const payload = {
      source: 'jokuh-arcade',
      type: 'arcade-session-complete',
      gameSlug: 'chess',
      gameName: 'Chess',
      result: won ? 'won' : lost ? 'lost' : 'draw',
      score: won ? 1 : 0,
      playerPoints: won ? 1 : 0,
      cpuPoints: lost ? 1 : 0,
      playerSets: 0,
      cpuSets: 0,
      longestRally: moveCount,
      totalRallies: moveCount,
      topBallSpeed: 0,
      completedAt: new Date().toISOString(),
      ...(multiplayerMode ? { matchId: myMatchId } : {}),
    };
    try { window.parent?.postMessage(payload, '*'); } catch (_) {}
    try { window.webkit?.messageHandlers?.jokuhArcade?.postMessage(payload); } catch (_) {}
  }

  // ---- Rendering -----------------------------------------------------------------

  function resize() {
    const root = document.getElementById('root');
    dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const rowOo = document.getElementById('row-oo');
    const rowYou = document.getElementById('row-you');
    const quip = document.getElementById('oo-quip');
    const status = document.getElementById('status');
    const rootStyle = getComputedStyle(root);
    const padX = parseFloat(rootStyle.paddingLeft) + parseFloat(rootStyle.paddingRight);
    const padY = parseFloat(rootStyle.paddingTop) + parseFloat(rootStyle.paddingBottom);
    const gap = parseFloat(rootStyle.rowGap || rootStyle.gap) || 8;
    const hudCount = 4;
    const hudH =
      (rowOo?.offsetHeight || 48) +
      (rowYou?.offsetHeight || 48) +
      (quip?.offsetHeight || 18) +
      (status?.offsetHeight || 18) +
      padY +
      gap * hudCount;

    const maxBoard = Math.min(viewportW - padX - 8, 680);
    const available = Math.min(maxBoard, Math.max(240, viewportH - hudH - 12));
    cell = Math.floor(available / 8);
    const size = cell * 8;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Board-flip helpers: when the local player is Black in multiplayer, rows
   * and columns are mirrored so the player's pieces sit at the bottom.
   */
  function viewRow(r) { return (multiplayerMode && mySide === 'b') ? 7 - r : r; }
  function viewCol(c) { return (multiplayerMode && mySide === 'b') ? 7 - c : c; }

  function sqX(c) { return viewCol(c) * cell; }
  function sqY(r) { return viewRow(r) * cell; }

  function drawPiece(piece, x, y) {
    const size = cell * 0.74;
    ctx.font = `${size}px -apple-system, "Segoe UI Symbol", "Noto Sans Symbols 2", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cx = x + cell / 2;
    const cy = y + cell / 2 + cell * 0.04;

    ctx.save();
    ctx.shadowColor = 'rgba(17,17,17,0.22)';
    ctx.shadowBlur = cell * 0.05;
    ctx.shadowOffsetY = cell * 0.02;
    if (piece.color === 'w') {
      // White: outline glyphs rendered with warm off-white fill and crisp dark stroke.
      const glyph = GLYPH_WHITE[piece.type];
      ctx.fillStyle = '#fdfcfa';
      ctx.fillText(glyph, cx, cy);
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = Math.max(1, cell * 0.022);
      ctx.strokeStyle = '#333';
      ctx.strokeText(glyph, cx, cy);
    } else {
      // Black: filled glyphs rendered solid dark.
      const glyph = GLYPH_BLACK[piece.type];
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText(glyph, cx, cy);
    }
    ctx.restore();
  }

  function draw() {
    const size = cell * 8;
    ctx.clearRect(0, 0, size, size);

    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? LIGHT_SQ : DARK_SQ;
        ctx.fillRect(sqX(c), sqY(r), cell, cell);
      }

    if (lastMove) {
      ctx.fillStyle = LAST_MOVE_FILL;
      ctx.fillRect(sqX(lastMove.from.c), sqY(lastMove.from.r), cell, cell);
      ctx.fillRect(sqX(lastMove.to.c), sqY(lastMove.to.r), cell, cell);
    }

    if (!gameOver && inCheck(board, turn)) {
      const k = findKing(board, turn);
      if (k) {
        ctx.fillStyle = CHECK_FILL;
        ctx.fillRect(sqX(k.c), sqY(k.r), cell, cell);
      }
    }

    if (selected) {
      ctx.fillStyle = SELECT_FILL;
      ctx.fillRect(sqX(selected.c), sqY(selected.r), cell, cell);
      for (const mv of legalForSelected) {
        const tx = sqX(mv.to.c), ty = sqY(mv.to.r);
        if (board[mv.to.r][mv.to.c] || mv.ep) {
          ctx.strokeStyle = RING_STROKE;
          ctx.lineWidth = Math.max(2, cell * 0.06);
          ctx.beginPath();
          ctx.arc(tx + cell / 2, ty + cell / 2, cell * 0.42, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = DOT_FILL;
          ctx.beginPath();
          ctx.arc(tx + cell / 2, ty + cell / 2, cell * 0.13, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.font = `600 ${Math.max(8, cell * 0.16)}px -apple-system, sans-serif`;
    ctx.fillStyle = COORD_LIGHT;
    const flipped = multiplayerMode && mySide === 'b';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (let r = 0; r < 8; r++) {
      const dispRank = String(8 - r);
      const px = viewCol(0) * cell + 3;
      const py = viewRow(r) * cell + 2;
      ctx.fillText(dispRank, px, py);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    for (let c = 0; c < 8; c++) {
      const dispFile = 'abcdefgh'[c];
      const px = viewCol(c) * cell + cell - 3;
      const py = viewRow(7) * cell + cell - 2;
      ctx.fillText(dispFile, px, py);
    }

    let animT = null;
    if (anim) {
      const t = (performance.now() - anim.start) / anim.dur;
      if (t >= 1) anim = null;
      else animT = 1 - Math.pow(1 - t, 3);
    }
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (!p) continue;
        if (anim && animT !== null && anim.to.r === r && anim.to.c === c) continue;
        drawPiece(p, sqX(c), sqY(r));
      }
    if (anim && animT !== null) {
      const x = sqX(anim.from.c) + (sqX(anim.to.c) - sqX(anim.from.c)) * animT;
      const y = sqY(anim.from.r) + (sqY(anim.to.r) - sqY(anim.from.r)) * animT;
      drawPiece(anim.piece, x, y);
    }
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  // ---- Input ----------------------------------------------------------------------

  function onTap(clientX, clientY) {
    if (gameOver) {
      if (multiplayerMode) {
        postRematchRequest();
        return;
      }
      restart();
      return;
    }
    // In multiplayer, only allow input on the local player's turn.
    const localColor = multiplayerMode ? mySide : 'w';
    if (turn !== localColor || anim) return;

    const rect = canvas.getBoundingClientRect();
    // Convert screen coords to board coords, inverting the view flip.
    const flipped = multiplayerMode && mySide === 'b';
    let vc = Math.floor((clientX - rect.left) / cell);
    let vr = Math.floor((clientY - rect.top) / cell);
    const c = flipped ? 7 - vc : vc;
    const r = flipped ? 7 - vr : vr;
    if (r < 0 || r > 7 || c < 0 || c > 7) return;

    if (selected) {
      const mv = legalForSelected.find(m => m.to.r === r && m.to.c === c);
      if (mv) {
        selected = null;
        legalForSelected = [];
        commitMove(mv, localColor);
        return;
      }
      selected = null;
      legalForSelected = [];
    }

    const p = board[r][c];
    if (p && p.color === localColor) {
      selected = { r, c };
      legalForSelected = legalMoves({ board, castling, enPassant }, localColor)
        .filter(m => m.from.r === r && m.from.c === c);
    }
  }

  canvas.addEventListener('click', e => onTap(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    onTap(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  window.addEventListener('resize', resize);

  function restart() {
    if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
    board = initialBoard();
    turn = 'w';
    gameOver = false;
    resultText = '';
    moveCount = 0;
    castling = { wK: true, wQ: true, bK: true, bQ: true };
    enPassant = null;
    selected = null;
    legalForSelected = [];
    lastMove = null;
    captured = { w: [], b: [] };
    anim = null;
    lastQuipIndex = {};
    setThinking(false);
    updateTurnUi();
    setOoQuip(pickQuip('gameStart'));
    statusEl.textContent = 'Your move.';
  }

  // ---- Multiplayer initialization hook -----------------------------------------

  /**
   * Called by the native shell (Swift/Kotlin/web host) to activate 1v1
   * multiplayer mode. When this is invoked the AI opponent is completely
   * disabled; moves arrive from the remote player via jokuhArcadeApplyMove.
   *
   * @param {object} payload
   * @param {string} payload.matchId       - arcade_matches row ID
   * @param {string} payload.mySide        - 'w' or 'b'
   * @param {string} payload.opponentName  - display name for the HUD
   * @param {Array}  [payload.existingMoves] - ordered move history to replay
   *        Each entry: { from: {r,c}, to: {r,c}, promotion?: string }
   */
  window.jokuhArcadeInit = function (payload) {
    multiplayerMode = true;
    myMatchId = payload.matchId;
    mySide = payload.mySide;
    opponentName = payload.opponentName || 'Opponent';

    // Update HUD label to show opponent name instead of "OO".
    const ooLabelEl = document.getElementById('label-oo');
    if (ooLabelEl) ooLabelEl.textContent = opponentName;

    // Reset board to starting position.
    if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
    board = initialBoard();
    turn = 'w';
    gameOver = false;
    resultText = '';
    moveCount = 0;
    castling = { wK: true, wQ: true, bK: true, bQ: true };
    enPassant = null;
    selected = null;
    legalForSelected = [];
    lastMove = null;
    captured = { w: [], b: [] };
    anim = null;
    lastQuipIndex = {};
    setThinking(false);

    // Replay any existing moves to reconstruct mid-game state.
    if (payload.existingMoves && payload.existingMoves.length) {
      for (const raw of payload.existingMoves) {
        const mv = buildMoveFromPayload(raw);
        if (mv) {
          const st = { board, castling, enPassant };
          const next = applyMove(st, mv);
          if (next.capturedPiece) captured[turn].push(next.capturedPiece.type);
          board = next.board;
          castling = next.castling;
          enPassant = next.enPassant;
          lastMove = { from: mv.from, to: mv.to };
          moveCount++;
          turn = turn === 'w' ? 'b' : 'w';
        }
      }
    }

    updateTurnUi();
    setOoQuip(
      turn === mySide
        ? 'Your move.'
        : `Waiting for ${opponentName}\u2026`
    );
    statusEl.textContent =
      turn === mySide ? 'Your move.' : `Waiting for ${opponentName}\u2026`;
  };

  /**
   * Converts a wire-format move payload { from, to, promotion } into the
   * internal move representation, resolving en passant / castling / promo flags
   * from the current board state.
   */
  function buildMoveFromPayload(raw) {
    const from = raw.from;
    const to = raw.to;
    const piece = board[from.r]?.[from.c];
    if (!piece) return null;

    const mv = { from, to };

    // Detect pawn promotion.
    if (raw.promotion) mv.promo = raw.promotion;

    // Detect en passant capture.
    if (piece.type === 'p' && to.c !== from.c && !board[to.r][to.c]) {
      mv.ep = true;
    }

    // Detect castling.
    if (piece.type === 'k' && Math.abs(to.c - from.c) === 2) {
      mv.castle = to.c > from.c ? 'K' : 'Q';
    }

    return mv;
  }

  /**
   * Called by the native shell when the remote opponent submits a move.
   * Applies the move, animates it, checks for terminal state, and enables
   * input for the local player.
   *
   * @param {object} movePayload - { from: {r,c}, to: {r,c}, promotion?: string }
   */
  window.jokuhArcadeApplyMove = function (movePayload) {
    if (!multiplayerMode || gameOver) return;
    const opponentColor = mySide === 'w' ? 'b' : 'w';
    if (turn !== opponentColor) return;

    const mv = buildMoveFromPayload(movePayload);
    if (!mv) return;

    commitMove(mv, opponentColor);
  };

  resize();
  restart();
  loop();
})();
