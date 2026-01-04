import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Sparkles, Coffee, Moon, Wind, RefreshCcw, ChevronUp, ChevronDown, Cloud, Zap, Trophy, Play, Circle, ChevronLeft, ChevronRight, Boxes, Layout, Star, MousePointer2, LayoutGrid, Timer } from 'lucide-react';
import VerticalElevator from './VerticalElevator';

interface BreakRoomProps {
  onClose: () => void;
  timeLeft?: number; // Added to sync with App session break
}

type GameType = 'selection' | 'zen' | 'stars' | 'balloon' | 'snake' | 'merge' | 'blast';

const BreakRoom: React.FC<BreakRoomProps> = ({ onClose, timeLeft }) => {
  const [activeGame, setActiveGame] = useState<GameType>('selection');
  
  // Game Icons for Elevator
  const gameElevatorActions = [
    { id: 'selection', icon: <LayoutGrid size={18} />, label: 'Menu' },
    { id: 'blast', icon: <Layout size={18} />, label: 'Blast' },
    { id: 'merge', icon: <Boxes size={18} />, label: 'Merge' },
    { id: 'snake', icon: <Zap size={18} />, label: 'Snake' },
    { id: 'stars', icon: <Star size={18} />, label: 'Stars' },
    { id: 'balloon', icon: <ChevronUp size={18} />, label: 'Rise' },
    { id: 'zen', icon: <Wind size={18} />, label: 'Zen' },
  ];

  // Zen Logic
  const [breathingStep, setBreathingStep] = useState(0); 
  
  // Stars Logic
  const [starCount, setStarCount] = useState(0);
  const [fallingStars, setFallingStars] = useState<{id: number, x: number, y: number, size: number}[]>([]);
  
  // Balloon Logic
  const [altitude, setAltitude] = useState(0);
  const [isRising, setIsRising] = useState(false);

  // Snake Logic
  const SNAKE_GRID_SIZE = 15;
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [isSnakeGameOver, setIsSnakeGameOver] = useState(false);
  const [snakeStarted, setSnakeStarted] = useState(false);

  // Merge Logic
  const MERGE_GRID_SIZE = 5;
  const [mergeGrid, setMergeGrid] = useState<number[][]>([]);
  const [mergeScore, setMergeScore] = useState(0);
  const [mergingCells, setMergingCells] = useState<{r: number, c: number}[]>([]);

  // Scholar Blast Logic
  const BLAST_GRID_SIZE = 8;
  const [blastGrid, setBlastGrid] = useState<number[][]>(Array(BLAST_GRID_SIZE).fill(0).map(() => Array(BLAST_GRID_SIZE).fill(0)));
  const [blastScore, setBlastScore] = useState(0);
  const [blastShapes, setBlastShapes] = useState<(number[][] | null)[]>([null, null, null]);
  const [draggingShape, setDraggingShape] = useState<{ shape: number[][], idx: number } | null>(null);
  const [draggingPos, setDraggingPos] = useState<{ x: number, y: number } | null>(null);
  const [isBlastGameOver, setIsBlastGameOver] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const SHAPES = [
    [[1, 1], [1, 1]], // Square
    [[1, 1, 1]],      // Horizontal 3
    [[1], [1], [1]],  // Vertical 3
    [[1, 1, 1, 1]],   // Horizontal 4
    [[1, 0], [1, 0], [1, 1]], // L shape
    [[1, 1, 1], [0, 1, 0]], // T shape
    [[1, 1], [0, 1], [0, 1]], // Inverse L
    [[1, 1], [1, 0]], // Small L
    [[1]], // Dot
  ];

  // Game Initialization
  const initBlastGame = () => {
    setBlastGrid(Array(BLAST_GRID_SIZE).fill(0).map(() => Array(BLAST_GRID_SIZE).fill(0)));
    setBlastScore(0);
    setBlastShapes(Array(3).fill(0).map(() => SHAPES[Math.floor(Math.random() * SHAPES.length)]));
    setIsBlastGameOver(false);
  };

  const initMergeGame = () => {
    const grid = Array(MERGE_GRID_SIZE).fill(0).map(() => 
      Array(MERGE_GRID_SIZE).fill(0).map(() => [2, 4, 8, 16][Math.floor(Math.random() * 3)])
    );
    setMergeGrid(grid);
    setMergeScore(0);
    setMergingCells([]);
  };

  const resetSnake = () => {
    setSnake([{ x: 7, y: 7 }]);
    setFood({ x: 5, y: 5 });
    setDir({ x: 0, y: -1 });
    setSnakeScore(0);
    setIsSnakeGameOver(false);
    setSnakeStarted(false);
  };

  const resetStars = () => {
    setStarCount(0);
    setFallingStars([]);
  };

  // BLAST LOGIC
  const canPlaceShape = (grid: number[][], shape: number[][], row: number, col: number) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;
        const targetR = row + r;
        const targetC = col + c;
        if (targetR < 0 || targetR >= BLAST_GRID_SIZE || targetC < 0 || targetC >= BLAST_GRID_SIZE) return false;
        if (grid[targetR][targetC] !== 0) return false;
      }
    }
    return true;
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, shape: number[][], idx: number) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDraggingShape({ shape, idx });
    setDraggingPos({ x: clientX, y: clientY });
  };

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggingShape) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDraggingPos({ x: clientX, y: clientY });
  }, [draggingShape]);

  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggingShape || !gridRef.current) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

    const rect = gridRef.current.getBoundingClientRect();
    const cellSize = rect.width / BLAST_GRID_SIZE;
    
    const gridX = Math.round((clientX - rect.left - (draggingShape.shape[0].length * cellSize / 2)) / cellSize);
    const gridY = Math.round((clientY - rect.top - (draggingShape.shape.length * cellSize / 2)) / cellSize);

    if (canPlaceShape(blastGrid, draggingShape.shape, gridY, gridX)) {
      const newGrid = blastGrid.map(r => [...r]);
      for (let r = 0; r < draggingShape.shape.length; r++) {
        for (let c = 0; c < draggingShape.shape[r].length; c++) {
          if (draggingShape.shape[r][c] !== 0) newGrid[gridY + r][gridX + c] = 1;
        }
      }

      let rowsToClear: number[] = [];
      let colsToClear: number[] = [];
      for (let r = 0; r < BLAST_GRID_SIZE; r++) {
        if (newGrid[r].every(cell => cell !== 0)) rowsToClear.push(r);
      }
      for (let c = 0; c < BLAST_GRID_SIZE; c++) {
        if (newGrid.every(r => r[c] !== 0)) colsToClear.push(c);
      }

      rowsToClear.forEach(r => newGrid[r] = Array(BLAST_GRID_SIZE).fill(0));
      colsToClear.forEach(c => newGrid.forEach(row => row[c] = 0));

      setBlastScore(prev => prev + (rowsToClear.length + colsToClear.length) * 100 + 10);
      setBlastGrid(newGrid);

      const nextShapes = [...blastShapes];
      nextShapes[draggingShape.idx] = null;
      if (nextShapes.every(s => s === null)) {
        setBlastShapes(Array(3).fill(0).map(() => SHAPES[Math.floor(Math.random() * SHAPES.length)]));
      } else {
        setBlastShapes(nextShapes);
      }
    }

    setDraggingShape(null);
    setDraggingPos(null);
  }, [draggingShape, blastGrid, blastShapes]);

  // MERGE LOGIC
  const handleMergeClick = (r: number, c: number) => {
    const value = mergeGrid[r][c];
    if (value === 0) return;
    const matches: {r: number, c: number}[] = [];
    const visited = new Set<string>();

    const findMatches = (row: number, col: number) => {
      const key = `${row},${col}`;
      if (visited.has(key)) return;
      visited.add(key);
      if (row < 0 || row >= MERGE_GRID_SIZE || col < 0 || col >= MERGE_GRID_SIZE) return;
      if (mergeGrid[row][col] !== value) return;
      matches.push({r: row, c: col});
      findMatches(row + 1, col);
      findMatches(row - 1, col);
      findMatches(row, col + 1);
      findMatches(row, col - 1);
    };

    findMatches(r, c);

    if (matches.length >= 2) {
      setMergingCells(matches);
      setTimeout(() => {
        const newGrid = [...mergeGrid.map(row => [...row])];
        matches.forEach(m => newGrid[m.r][m.c] = 0);
        newGrid[r][c] = value * 2;
        
        for (let j = 0; j < MERGE_GRID_SIZE; j++) {
          let emptyIdx = MERGE_GRID_SIZE - 1;
          for (let i = MERGE_GRID_SIZE - 1; i >= 0; i--) {
            if (newGrid[i][j] !== 0) {
              const temp = newGrid[i][j];
              newGrid[i][j] = 0;
              newGrid[emptyIdx][j] = temp;
              emptyIdx--;
            }
          }
          for (let i = emptyIdx; i >= 0; i--) {
            newGrid[i][j] = [2, 4, 8][Math.floor(Math.random() * 3)];
          }
        }
        setMergeGrid(newGrid);
        setMergeScore(prev => prev + (value * matches.length));
        setMergingCells([]);
      }, 200);
    }
  };

  const getMergeColor = (val: number) => {
    const colors: Record<number, string> = {
      2: 'bg-blue-100 text-blue-600 border-blue-200',
      4: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      8: 'bg-purple-100 text-purple-600 border-purple-200',
      16: 'bg-pink-100 text-pink-600 border-pink-200',
      32: 'bg-rose-100 text-rose-600 border-rose-200',
      64: 'bg-orange-100 text-orange-600 border-orange-200',
      128: 'bg-amber-100 text-amber-600 border-amber-200',
      256: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      512: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      1024: 'bg-teal-500 text-white border-teal-400',
      2048: 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
    };
    return colors[val] || 'bg-slate-900 text-white border-slate-700';
  };

  // SNAKE LOGIC
  const moveSnake = useCallback(() => {
    if (!snakeStarted || isSnakeGameOver) return;
    setSnake(prev => {
      const head = prev[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };
      if (newHead.x < 0 || newHead.x >= SNAKE_GRID_SIZE || newHead.y < 0 || newHead.y >= SNAKE_GRID_SIZE) {
        setIsSnakeGameOver(true);
        return prev;
      }
      if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsSnakeGameOver(true);
        return prev;
      }
      const newSnake = [newHead, ...prev];
      if (newHead.x === food.x && newHead.y === food.y) {
        setSnakeScore(s => s + 100);
        setFood({ x: Math.floor(Math.random() * SNAKE_GRID_SIZE), y: Math.floor(Math.random() * SNAKE_GRID_SIZE) });
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [dir, food, snakeStarted, isSnakeGameOver]);

  // STAR CATCHER LOGIC
  useEffect(() => {
    if (activeGame !== 'stars') return;
    const interval = setInterval(() => {
      setFallingStars(prev => [
        ...prev.map(s => ({ ...s, y: s.y + 2 })),
        { id: Date.now(), x: Math.random() * 90 + 5, y: -10, size: Math.random() * 20 + 10 }
      ].filter(s => s.y < 110));
    }, 50);
    return () => clearInterval(interval);
  }, [activeGame]);

  const catchStar = (id: number) => {
    setFallingStars(prev => prev.filter(s => s.id !== id));
    setStarCount(prev => prev + 1);
  };

  // GLOBAL INTERVALS
  useEffect(() => {
    if (activeGame === 'blast') {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      initBlastGame();
    }
    if (activeGame === 'merge') initMergeGame();
    if (activeGame === 'snake') resetSnake();
    if (activeGame === 'stars') resetStars();
    if (activeGame === 'zen') {
      const int = setInterval(() => setBreathingStep(p => (p + 1) % 3), 4000);
      return () => {
        clearInterval(int);
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [activeGame]);

  useEffect(() => {
    if (activeGame === 'snake') {
      const int = setInterval(moveSnake, 180);
      return () => clearInterval(int);
    }
  }, [activeGame, moveSnake]);

  useEffect(() => {
    if (activeGame === 'balloon') {
      const int = setInterval(() => {
        setAltitude(prev => isRising ? Math.min(prev + 0.5, 100) : Math.max(prev - 0.2, 0));
      }, 30);
      return () => clearInterval(int);
    }
  }, [activeGame, isRising]);

  return (
    <div className="fixed inset-0 bg-white z-[80] flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
      
      {/* The Scholar Lift - Game Elevator */}
      <VerticalElevator 
        actions={gameElevatorActions}
        activeId={activeGame}
        onSelect={(id) => setActiveGame(id as GameType)}
        onScrollUp={() => setActiveGame('selection')}
        onScrollDown={() => {}}
      />

      <div className="flex items-center justify-between mb-10 shrink-0 pr-16">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors"><ChevronLeft size={20} /></button>
          <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg">
            <Coffee size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">Break Room</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mindful Refreshment</p>
          </div>
        </div>

        {/* Global Session Timer Overlay */}
        {timeLeft !== undefined && (
          <div className="flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-2xl shadow-xl border border-white/10 animate-pulse">
            <Timer size={18} className="text-emerald-400" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Break Time</span>
              <span className="text-lg font-black text-white tabular-nums tracking-tight">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden pr-16">
        {activeGame === 'selection' && (
          <div className="space-y-4 animate-in zoom-in-95 h-full overflow-y-auto no-scrollbar pb-10">
            <h2 className="text-3xl font-black tracking-tighter text-slate-800 mb-6 px-2 leading-tight uppercase italic">
              Choose your<br/>refreshment.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setActiveGame('blast')} className="bg-emerald-600 p-8 rounded-[3rem] text-left group hover:scale-[1.02] transition-all relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
                <Layout className="text-white mb-4" size={32} />
                <h3 className="text-xl font-black text-white mb-1">Scholar Blast</h3>
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest leading-relaxed">Line-clearing puzzle action!</p>
              </button>
              
              <button onClick={() => setActiveGame('merge')} className="bg-purple-600 p-8 rounded-[3rem] text-left group hover:scale-[1.02] transition-all relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
                <Boxes className="text-white mb-4" size={32} />
                <h3 className="text-xl font-black text-white mb-1">Scholar Merge</h3>
                <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest leading-relaxed">Combine and multiply knowledge!</p>
              </button>

              <button onClick={() => setActiveGame('snake')} className="bg-indigo-600 p-8 rounded-[3rem] text-left group hover:scale-[1.02] transition-all relative overflow-hidden shadow-xl">
                <Zap className="text-amber-400 mb-4" size={32} />
                <h3 className="text-xl font-black text-white mb-1">Scholar Snake</h3>
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-relaxed">Collect A+ grades to grow!</p>
              </button>

              <button onClick={() => setActiveGame('stars')} className="bg-amber-500 p-8 rounded-[3rem] text-left group hover:scale-[1.02] transition-all relative overflow-hidden shadow-xl">
                <Star className="text-white mb-4" size={32} />
                <h3 className="text-xl font-black text-white mb-1">Star Catcher</h3>
                <p className="text-[10px] font-bold text-amber-100 uppercase tracking-widest leading-relaxed">Catch inspiration from the sky!</p>
              </button>

              <button onClick={() => setActiveGame('balloon')} className="bg-sky-50 border border-sky-100 p-8 rounded-[3rem] text-left group hover:scale-[1.02] transition-all">
                <ChevronUp className="text-sky-600 mb-4" size={32} />
                <h3 className="text-xl font-black text-sky-900 mb-1">Balloon Rise</h3>
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest leading-relaxed">Floating mindful ascent</p>
              </button>

              <button onClick={() => setActiveGame('zen')} className="bg-indigo-50 border border-indigo-100 p-8 rounded-[3rem] text-left group hover:scale-[1.02] transition-all">
                <Wind className="text-indigo-600 mb-4" size={32} />
                <h3 className="text-xl font-black text-indigo-900 mb-1">Zen Breathing</h3>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-relaxed">Rhythmic focus practice</p>
              </button>
            </div>
          </div>
        )}

        {/* GAME: BLAST */}
        {activeGame === 'blast' && (
          <div className="flex-1 flex flex-col bg-slate-100 rounded-[3rem] p-6 overflow-hidden animate-in zoom-in-95 relative">
             <div className="flex justify-between items-center mb-4">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Blast Score</p>
                   <h4 className="text-4xl font-black text-slate-900 tabular-nums">{blastScore}</h4>
                </div>
                <button onClick={initBlastGame} className="p-3 bg-white rounded-2xl text-slate-500 shadow-sm"><RefreshCcw size={20} /></button>
             </div>
             <div ref={gridRef} className="flex-1 aspect-square max-w-[400px] mx-auto grid gap-1 p-1 bg-slate-300 rounded-[2rem] shadow-inner relative" style={{ gridTemplateColumns: `repeat(${BLAST_GRID_SIZE}, 1fr)` }}>
                {blastGrid.map((row, r) => row.map((cell, c) => (
                  <div key={`${r}-${c}`} className={`w-full aspect-square rounded-md transition-all duration-300 ${cell !== 0 ? 'bg-emerald-500 shadow-[0_4px_10px_rgba(16,185,129,0.3)]' : 'bg-white/40'}`} />
                )))}
             </div>
             <div className="mt-4 flex justify-around items-center h-24 bg-white/50 rounded-3xl p-2 border border-white">
                {blastShapes.map((shape, i) => (
                  <div key={i} className="flex-1 flex justify-center items-center h-full">
                    {shape ? (
                      <div onMouseDown={(e) => handleDragStart(e, shape, i)} onTouchStart={(e) => handleDragStart(e, shape, i)} className="cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform origin-center" style={{ display: 'grid', gridTemplateColumns: `repeat(${shape[0].length}, 18px)`, gap: '2px' }}>
                        {shape.map((row, r) => row.map((cell, c) => (
                          <div key={`${r}-${c}`} className={`w-[18px] h-[18px] rounded-[4px] ${cell ? 'bg-emerald-600' : 'bg-transparent'}`} />
                        )))}
                      </div>
                    ) : null}
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeGame === 'merge' && (
          <div className="flex-1 flex flex-col bg-[#f0f4f8] rounded-[3rem] p-8 overflow-hidden animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-purple-600">Merge Score</p>
                   <h4 className="text-4xl font-black text-slate-900 tabular-nums">{mergeScore}</h4>
                </div>
                <button onClick={initMergeGame} className="p-3 bg-white rounded-2xl text-slate-500 shadow-sm"><RefreshCcw size={20} /></button>
             </div>
             <div className="flex-1 aspect-square max-w-[400px] mx-auto grid gap-2 p-2 bg-slate-200 rounded-[2rem] shadow-inner" style={{ gridTemplateColumns: `repeat(${MERGE_GRID_SIZE}, 1fr)` }}>
                {mergeGrid.map((row, r) => row.map((cell, c) => {
                  const isMerging = mergingCells.some(m => m.r === r && m.c === c);
                  return (
                    <button key={`${r}-${c}`} onClick={() => handleMergeClick(r, c)} className={`w-full aspect-square rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-all duration-300 ${getMergeColor(cell)} ${isMerging ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-[1.05] active:scale-90 shadow-sm'}`}>
                      {cell}
                    </button>
                  );
                }))}
             </div>
          </div>
        )}

        {/* Catch all for other games */}
        {['snake', 'stars', 'balloon', 'zen'].includes(activeGame) && (
          <div className="flex-1 flex flex-col items-center justify-center">
             <p className="text-slate-400 font-black uppercase tracking-widest mb-4">Entering the Scholar Lift Area...</p>
             <div className="w-full h-full">
                {activeGame === 'snake' && (
                  <div className="flex-1 flex flex-col bg-slate-950 rounded-[3rem] p-8 overflow-hidden animate-in zoom-in-95 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Scholar Score</p>
                          <h4 className="text-4xl font-black text-white tabular-nums">{snakeScore}</h4>
                        </div>
                        <button onClick={resetSnake} className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white"><RefreshCcw size={20} /></button>
                    </div>
                    <div className="flex-1 relative bg-black/40 rounded-3xl border border-white/5 overflow-hidden grid" style={{ gridTemplateColumns: `repeat(${SNAKE_GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${SNAKE_GRID_SIZE}, 1fr)` }}>
                        {snake.map((segment, i) => (
                          <div key={i} className={`rounded-sm transition-all duration-200 ${i === 0 ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10' : 'bg-indigo-900/40'}`} style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1 }}>
                            {i === 0 && <div className="w-full h-full flex items-center justify-center"><Circle size={8} className="fill-white" /></div>}
                          </div>
                        ))}
                        <div className="bg-amber-400 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.5)]" style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}>
                          <span className="text-[8px] font-black text-amber-900">A+</span>
                        </div>
                    </div>
                  </div>
                )}
                {activeGame === 'stars' && (
                   <div className="flex-1 flex flex-col bg-slate-900 rounded-[3rem] p-8 overflow-hidden animate-in zoom-in-95 relative h-full">
                      <div className="flex justify-between items-center mb-6 relative z-10">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Stars Caught</p>
                            <h4 className="text-4xl font-black text-white tabular-nums">{starCount}</h4>
                          </div>
                          <button onClick={resetStars} className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white"><RefreshCcw size={20} /></button>
                      </div>
                      <div className="flex-1 relative bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                          {fallingStars.map(star => (
                            <button key={star.id} onClick={() => catchStar(star.id)} className="absolute transition-transform transform hover:scale-150 active:scale-75 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ left: `${star.x}%`, top: `${star.y}%` }}>
                                <Star size={star.size} fill="currentColor" />
                            </button>
                          ))}
                      </div>
                   </div>
                )}
                {activeGame === 'balloon' && (
                   <div className={`flex-1 relative rounded-[3rem] overflow-hidden animate-in zoom-in-95 h-full transition-colors duration-[2000ms] bg-gradient-to-b ${altitude < 30 ? 'from-sky-300 to-sky-100' : altitude < 70 ? 'from-indigo-400 to-sky-300' : 'from-slate-900 to-indigo-800'}`}>
                      <div className="absolute top-8 left-8 z-10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Altitude</p>
                          <h4 className="text-4xl font-black text-white">{Math.floor(altitude * 10)}m</h4>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-out" style={{ bottom: `${10 + (altitude * 0.75)}%` }}>
                          <div className="relative">
                            <div className={`w-20 h-24 bg-rose-500 rounded-t-full rounded-b-[40%] shadow-2xl transition-transform ${isRising ? 'scale-110' : 'scale-100'}`}></div>
                            <div className="w-0.5 h-10 bg-slate-400 mx-auto"></div>
                            <div className="w-8 h-6 bg-amber-800 rounded-sm mx-auto shadow-lg"></div>
                          </div>
                      </div>
                      <div className="absolute bottom-12 w-full px-8 flex flex-col items-center gap-4">
                          <button onMouseDown={() => setIsRising(true)} onMouseUp={() => setIsRising(false)} onTouchStart={() => setIsRising(true)} onTouchEnd={() => setIsRising(false)} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl border-4 ${isRising ? 'bg-white border-white' : 'bg-transparent border-white/20 text-white'}`}>
                            <ChevronUp size={40} className={isRising ? 'text-sky-600' : ''} />
                          </button>
                      </div>
                   </div>
                )}
                {activeGame === 'zen' && (
                   <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-90 h-full">
                      <div className="relative mb-10 flex items-center justify-center">
                          <div className={`absolute w-48 h-48 bg-indigo-500/10 rounded-full transition-all duration-[4000ms] ease-in-out ${breathingStep === 0 ? 'scale-150' : breathingStep === 2 ? 'scale-75' : 'scale-150'}`}></div>
                          <div className={`w-24 h-24 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-[4000ms] ease-in-out ${breathingStep === 0 ? 'scale-125' : breathingStep === 2 ? 'scale-90' : 'scale-125'}`}>
                            <Wind size={32} />
                          </div>
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter text-indigo-900 mb-4">{breathingStep === 0 ? 'Inhale...' : breathingStep === 1 ? 'Hold...' : 'Exhale...'}</h3>
                   </div>
                )}
             </div>
          </div>
        )}

        <button onClick={() => setActiveGame('selection')} className="mt-6 text-slate-400 font-black uppercase text-[10px] flex items-center justify-center gap-2 mb-4">
          <RefreshCcw size={14} /> Back to Selection
        </button>
      </div>
    </div>
  );
};

export default BreakRoom;