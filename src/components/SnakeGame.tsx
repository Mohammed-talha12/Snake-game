import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, hasStarted, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setHasStarted(true);
      }

      const currentDir = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (hasStarted && !isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, hasStarted, isPaused, gameOver]);

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      <div className="flex justify-between items-center w-full mb-2 px-2 border-b-2 border-fuchsia-500 pb-2">
        <div className="text-cyan-400 font-display text-sm tracking-wider">
          SEQ_SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-fuchsia-500 font-display text-xs uppercase tracking-widest animate-pulse">
          {isPaused ? 'ERR: PAUSED' : 'SYS: ACTIVE'}
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-cyan-500 overflow-hidden"
        style={{ 
          width: 400, 
          height: 400,
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Food */}
        <div 
          className="absolute bg-fuchsia-500"
          style={{
            width: 20,
            height: 20,
            left: food.x * 20,
            top: food.y * 20,
            boxShadow: '0 0 10px #f0f'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute ${index === 0 ? 'bg-white' : 'bg-cyan-500'}`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
              border: '1px solid #000',
              boxShadow: index === 0 ? '0 0 10px #0ff' : 'none'
            }}
          />
        ))}

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 border-4 border-fuchsia-500 m-4">
            <h2 className="text-xl font-display text-white mb-6 tracking-widest glitch-text" data-text="AWAITING_INPUT">
              AWAITING_INPUT
            </h2>
            <p className="text-cyan-400 font-mono text-lg mb-8 uppercase">
              &gt; WASD / ARROWS TO EXECUTE<br/>&gt; SPACE TO HALT
            </p>
            <button 
              onClick={() => setHasStarted(true)}
              className="px-6 py-3 bg-fuchsia-500 text-black font-display text-sm tracking-widest hover:bg-white hover:text-black transition-none"
            >
              INITIALIZE
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-fuchsia-900/90 flex flex-col items-center justify-center text-center p-6 z-20 border-4 border-cyan-500 m-4 screen-tear">
            <h2 className="text-2xl font-display text-white mb-4 tracking-widest glitch-text" data-text="FATAL_ERR">
              FATAL_ERR
            </h2>
            <p className="text-black bg-cyan-400 font-mono text-2xl mb-8 p-2 font-bold">
              COLLISION_DETECTED<br/>SCORE: {score}
            </p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-black text-cyan-400 border-2 border-cyan-400 font-display text-sm tracking-widest hover:bg-cyan-400 hover:text-black transition-none"
            >
              REBOOT_SEQ
            </button>
          </div>
        )}
        
        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <h2 className="text-2xl font-display text-fuchsia-500 tracking-widest bg-black p-4 border-2 border-fuchsia-500">
              EXECUTION_HALTED
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
