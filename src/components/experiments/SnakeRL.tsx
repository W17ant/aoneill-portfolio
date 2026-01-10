/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   SNAKE RL - Q-Learning snake game that learns       ###
   ###   to play in real-time using neural network          ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface Point {
  x: number;
  y: number;
}

interface GameState {
  snake: Point[];
  food: Point;
  direction: number; // 0=up, 1=right, 2=down, 3=left
  score: number;
  gameOver: boolean;
  stepsSinceFood: number; // Prevents infinite loops
}

/* ###########################################################
   ###   2. Neural Network (Simple feedforward)             ###
   ########################################################### */

class NeuralNetwork {
  weights1: number[][];
  weights2: number[][];
  bias1: number[];
  bias2: number[];

  constructor(inputSize: number, hiddenSize: number, outputSize: number) {
    // Initialize with small random weights
    this.weights1 = this.randomMatrix(inputSize, hiddenSize, 0.5);
    this.weights2 = this.randomMatrix(hiddenSize, outputSize, 0.5);
    this.bias1 = new Array(hiddenSize).fill(0).map(() => Math.random() * 0.2 - 0.1);
    this.bias2 = new Array(outputSize).fill(0).map(() => Math.random() * 0.2 - 0.1);
  }

  randomMatrix(rows: number, cols: number, scale: number): number[][] {
    return Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => (Math.random() - 0.5) * scale)
    );
  }

  relu(x: number): number {
    return Math.max(0, x);
  }

  forward(input: number[]): number[] {
    // Hidden layer
    const hidden = this.bias1.map((b, j) => {
      let sum = b;
      for (let i = 0; i < input.length; i++) {
        sum += input[i] * this.weights1[i][j];
      }
      return this.relu(sum);
    });

    // Output layer (no activation - raw Q-values)
    const output = this.bias2.map((b, j) => {
      let sum = b;
      for (let i = 0; i < hidden.length; i++) {
        sum += hidden[i] * this.weights2[i][j];
      }
      return sum;
    });

    return output;
  }

  // Simple gradient descent update
  train(input: number[], targetIdx: number, targetValue: number, lr: number) {
    const output = this.forward(input);
    const error = targetValue - output[targetIdx];

    // Hidden layer values (for backprop)
    const hidden = this.bias1.map((b, j) => {
      let sum = b;
      for (let i = 0; i < input.length; i++) {
        sum += input[i] * this.weights1[i][j];
      }
      return this.relu(sum);
    });

    // Update output weights for target action only
    for (let i = 0; i < hidden.length; i++) {
      this.weights2[i][targetIdx] += lr * error * hidden[i];
    }
    this.bias2[targetIdx] += lr * error;

    // Update hidden weights (simplified backprop)
    for (let j = 0; j < hidden.length; j++) {
      if (hidden[j] > 0) { // ReLU derivative
        const grad = error * this.weights2[j][targetIdx];
        for (let i = 0; i < input.length; i++) {
          this.weights1[i][j] += lr * grad * input[i] * 0.1;
        }
        this.bias1[j] += lr * grad * 0.1;
      }
    }
  }

  clone(): NeuralNetwork {
    const nn = new NeuralNetwork(0, 0, 0);
    nn.weights1 = this.weights1.map(row => [...row]);
    nn.weights2 = this.weights2.map(row => [...row]);
    nn.bias1 = [...this.bias1];
    nn.bias2 = [...this.bias2];
    return nn;
  }
}

/* ###########################################################
   ###   3. Q-Learning Agent                                ###
   ########################################################### */

class QLearningAgent {
  model: NeuralNetwork;
  targetModel: NeuralNetwork;
  memory: { state: number[]; action: number; reward: number; nextState: number[]; done: boolean }[];
  epsilon: number;
  epsilonDecay: number;
  epsilonMin: number;
  gamma: number;
  learningRate: number;
  batchSize: number;
  updateTargetEvery: number;
  stepCount: number;

  constructor() {
    // 11 inputs (state), 64 hidden, 3 outputs (straight, right, left)
    this.model = new NeuralNetwork(11, 64, 3);
    this.targetModel = this.model.clone();
    this.memory = [];
    this.epsilon = 1.0;
    this.epsilonDecay = 0.995;
    this.epsilonMin = 0.01;
    this.gamma = 0.95;
    this.learningRate = 0.001;
    this.batchSize = 32;
    this.updateTargetEvery = 100;
    this.stepCount = 0;
  }

  getState(game: GameState, gridSize: number): number[] {
    const head = game.snake[0];
    const dir = game.direction;

    // Points around head
    const pointAhead = this.getPointInDirection(head, dir, gridSize);
    const pointRight = this.getPointInDirection(head, (dir + 1) % 4, gridSize);
    const pointLeft = this.getPointInDirection(head, (dir + 3) % 4, gridSize);

    // Check dangers
    const dangerStraight = this.isCollision(pointAhead, game.snake, gridSize) ? 1 : 0;
    const dangerRight = this.isCollision(pointRight, game.snake, gridSize) ? 1 : 0;
    const dangerLeft = this.isCollision(pointLeft, game.snake, gridSize) ? 1 : 0;

    // Direction encoding
    const dirUp = dir === 0 ? 1 : 0;
    const dirRight = dir === 1 ? 1 : 0;
    const dirDown = dir === 2 ? 1 : 0;
    const dirLeft = dir === 3 ? 1 : 0;

    // Food direction
    const foodLeft = game.food.x < head.x ? 1 : 0;
    const foodRight = game.food.x > head.x ? 1 : 0;
    const foodUp = game.food.y < head.y ? 1 : 0;
    const foodDown = game.food.y > head.y ? 1 : 0;

    return [
      dangerStraight, dangerRight, dangerLeft,
      dirUp, dirRight, dirDown, dirLeft,
      foodLeft, foodRight, foodUp, foodDown
    ];
  }

  getPointInDirection(point: Point, direction: number, gridSize: number): Point {
    const moves = [
      { x: 0, y: -1 }, // up
      { x: 1, y: 0 },  // right
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }  // left
    ];
    return {
      x: point.x + moves[direction].x,
      y: point.y + moves[direction].y
    };
  }

  isCollision(point: Point, snake: Point[], gridSize: number): boolean {
    // Wall collision
    if (point.x < 0 || point.x >= gridSize || point.y < 0 || point.y >= gridSize) {
      return true;
    }
    // Self collision
    return snake.some(s => s.x === point.x && s.y === point.y);
  }

  getAction(state: number[]): number {
    // Epsilon-greedy
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * 3);
    }
    const qValues = this.model.forward(state);
    return qValues.indexOf(Math.max(...qValues));
  }

  remember(state: number[], action: number, reward: number, nextState: number[], done: boolean) {
    this.memory.push({ state, action, reward, nextState, done });
    if (this.memory.length > 10000) {
      this.memory.shift();
    }
  }

  replay() {
    if (this.memory.length < this.batchSize) return;

    // Sample random batch
    const batch = [];
    for (let i = 0; i < this.batchSize; i++) {
      batch.push(this.memory[Math.floor(Math.random() * this.memory.length)]);
    }

    for (const { state, action, reward, nextState, done } of batch) {
      let target = reward;
      if (!done) {
        const nextQValues = this.targetModel.forward(nextState);
        target = reward + this.gamma * Math.max(...nextQValues);
      }
      this.model.train(state, action, target, this.learningRate);
    }

    this.stepCount++;
    if (this.stepCount % this.updateTargetEvery === 0) {
      this.targetModel = this.model.clone();
    }

    // Decay epsilon
    if (this.epsilon > this.epsilonMin) {
      this.epsilon *= this.epsilonDecay;
    }
  }
}

/* ###########################################################
   ###   4. Main Component                                  ###
   ########################################################### */

export default function SnakeRL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agentRef = useRef<QLearningAgent | null>(null);
  const gameRef = useRef<GameState | null>(null);
  const animationRef = useRef<number>(0);

  const [isTraining, setIsTraining] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [stats, setStats] = useState({
    games: 0,
    score: 0,
    highScore: 0,
    avgScore: 0,
    epsilon: 1.0
  });
  const [logs, setLogs] = useState<{ text: string; type: 'info' | 'success' | 'danger' | 'warning' }[]>([
    { text: 'Agent initialized. Press Train to start learning.', type: 'info' }
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((text: string, type: 'info' | 'success' | 'danger' | 'warning' = 'info') => {
    setLogs(prev => [...prev.slice(-50), { text, type }]); // Keep last 50 logs
  }, []);

  const GRID_SIZE = 20;
  const CELL_SIZE = 15;

  const spawnFood = useCallback((snake: Point[]): Point => {
    let food: Point;
    do {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
    return food;
  }, []);

  const initGame = useCallback((): GameState => {
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = Math.floor(GRID_SIZE / 2);
    return {
      snake: [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
      ],
      food: spawnFood([{ x: startX, y: startY }]),
      direction: 1, // right
      score: 0,
      gameOver: false,
      stepsSinceFood: 0
    };
  }, [spawnFood]);

  const MAX_STEPS_WITHOUT_FOOD = 200; // Prevents infinite loops

  const step = useCallback((game: GameState, action: number): { game: GameState; reward: number; timeout?: boolean } => {
    // Action: 0=straight, 1=right, 2=left
    const dirChanges = [0, 1, -1];
    const newDir = (game.direction + dirChanges[action] + 4) % 4;

    const moves = [
      { x: 0, y: -1 }, // up
      { x: 1, y: 0 },  // right
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }  // left
    ];

    const newHead = {
      x: game.snake[0].x + moves[newDir].x,
      y: game.snake[0].y + moves[newDir].y
    };

    // Check collision
    const hitWall = newHead.x < 0 || newHead.x >= GRID_SIZE ||
                    newHead.y < 0 || newHead.y >= GRID_SIZE;
    const hitSelf = game.snake.some(s => s.x === newHead.x && s.y === newHead.y);

    if (hitWall || hitSelf) {
      return {
        game: { ...game, gameOver: true, direction: newDir },
        reward: -10
      };
    }

    // Check food
    const ateFood = newHead.x === game.food.x && newHead.y === game.food.y;
    const newSnake = [newHead, ...game.snake];
    if (!ateFood) {
      newSnake.pop();
    }

    const newStepsSinceFood = ateFood ? 0 : game.stepsSinceFood + 1;

    // Check for timeout (stuck in loop)
    if (newStepsSinceFood >= MAX_STEPS_WITHOUT_FOOD) {
      return {
        game: { ...game, gameOver: true, direction: newDir, stepsSinceFood: newStepsSinceFood },
        reward: -5, // Smaller penalty for timeout vs collision
        timeout: true
      };
    }

    return {
      game: {
        snake: newSnake,
        food: ateFood ? spawnFood(newSnake) : game.food,
        direction: newDir,
        score: game.score + (ateFood ? 1 : 0),
        gameOver: false,
        stepsSinceFood: newStepsSinceFood
      },
      reward: ateFood ? 10 : 0
    };
  }, []);

  const draw = useCallback((game: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      game.food.x * CELL_SIZE + CELL_SIZE / 2,
      game.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    game.snake.forEach((segment, i) => {
      const gradient = ctx.createRadialGradient(
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        0,
        segment.x * CELL_SIZE + CELL_SIZE / 2,
        segment.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2
      );
      if (i === 0) {
        gradient.addColorStop(0, '#22c55e');
        gradient.addColorStop(1, '#16a34a');
      } else {
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#22c55e');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });
  }, []);

  const runTrainingStep = useCallback(() => {
    if (!agentRef.current || !gameRef.current) return;

    const agent = agentRef.current;
    let game = gameRef.current;

    if (game.gameOver) {
      // Update stats and log death
      setStats(prev => {
        const newGames = prev.games + 1;
        const newAvg = ((prev.avgScore * prev.games) + game.score) / newGames;
        const isNewHighScore = game.score > prev.highScore;

        // Log game over
        if (isNewHighScore && game.score > 0) {
          addLog(`New high score! ${game.score} points`, 'success');
        }

        // Milestone logs
        if (newGames % 100 === 0) {
          addLog(`Completed ${newGames} games. Avg: ${Math.round(newAvg * 10) / 10}`, 'info');
        }

        return {
          games: newGames,
          score: 0,
          highScore: Math.max(prev.highScore, game.score),
          avgScore: Math.round(newAvg * 10) / 10,
          epsilon: Math.round(agent.epsilon * 100) / 100
        };
      });
      game = initGame();
      gameRef.current = game;
      addLog('New game started', 'info');
    }

    const state = agent.getState(game, GRID_SIZE);
    const isExploring = Math.random() < agent.epsilon;
    const action = agent.getAction(state);
    const { game: newGame, reward, timeout } = step(game, action);
    const nextState = agent.getState(newGame, GRID_SIZE);

    // Log significant events
    if (reward === 10) {
      addLog(`Food eaten! Score: ${newGame.score}`, 'success');
    } else if (timeout) {
      addLog(`Timeout: Stuck in loop (Score: ${game.score})`, 'warning');
    } else if (reward === -10) {
      const head = game.snake[0];
      const moves = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
      const dirChanges = [0, 1, -1];
      const newDir = (game.direction + dirChanges[action] + 4) % 4;
      const newHead = { x: head.x + moves[newDir].x, y: head.y + moves[newDir].y };
      const hitWall = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;
      addLog(`Death: ${hitWall ? 'Hit wall' : 'Hit self'} (Score: ${game.score})`, 'danger');
    }

    // Occasionally log exploration status
    if (Math.random() < 0.02 && isExploring) {
      addLog(`Exploring... (ε=${Math.round(agent.epsilon * 100)}%)`, 'warning');
    }

    agent.remember(state, action, reward, nextState, newGame.gameOver);

    // Check epsilon before replay (which decays it)
    const prevEpsilon = agent.epsilon;
    agent.replay();

    // Log epsilon milestones
    const epsilonThresholds = [0.5, 0.25, 0.1, 0.05];
    for (const threshold of epsilonThresholds) {
      if (prevEpsilon > threshold && agent.epsilon <= threshold) {
        addLog(`Epsilon dropped to ${Math.round(threshold * 100)}% - less random exploration`, 'info');
        break;
      }
    }

    gameRef.current = newGame;
    setStats(prev => ({ ...prev, score: newGame.score, epsilon: Math.round(agent.epsilon * 100) / 100 }));
    draw(newGame);
  }, [initGame, step, draw, addLog]);

  useEffect(() => {
    agentRef.current = new QLearningAgent();
    gameRef.current = initGame();
    draw(gameRef.current);
  }, [initGame, draw]);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!isTraining) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    let lastTime = 0;
    const interval = 1000 / speed;

    const loop = (time: number) => {
      if (time - lastTime >= interval) {
        runTrainingStep();
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isTraining, speed, runTrainingStep]);

  const reset = () => {
    setIsTraining(false);
    agentRef.current = new QLearningAgent();
    gameRef.current = initGame();
    setStats({ games: 0, score: 0, highScore: 0, avgScore: 0, epsilon: 1.0 });
    setLogs([{ text: 'Agent reset. Press Train to start learning.', type: 'info' }]);
    draw(gameRef.current!);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Canvas and Logs Container */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        {/* Canvas */}
        <div
          className="rounded-xl overflow-hidden border shrink-0"
          style={{ borderColor: 'var(--stroke)', background: '#0a0f1a' }}
        >
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
          />
        </div>

        {/* Live Activity Log */}
        <div
          className="flex-1 rounded-xl border overflow-hidden flex flex-col"
          style={{
            borderColor: 'var(--stroke)',
            background: 'var(--background-secondary)',
            minHeight: '200px',
            maxHeight: `${GRID_SIZE * CELL_SIZE}px`
          }}
        >
          <div
            className="px-3 py-2 text-xs font-semibold border-b"
            style={{ borderColor: 'var(--stroke)', color: 'var(--ink-muted)' }}
          >
            Live Activity
          </div>
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto p-2 space-y-1 text-xs font-mono"
          >
            {logs.map((log, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded"
                style={{
                  background: log.type === 'success' ? 'rgba(34, 197, 94, 0.1)' :
                              log.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' :
                              log.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                              'rgba(255, 255, 255, 0.03)',
                  color: log.type === 'success' ? '#22c55e' :
                         log.type === 'danger' ? '#ef4444' :
                         log.type === 'warning' ? '#f59e0b' :
                         'var(--ink-muted)'
                }}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 text-center text-sm">
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{stats.games}</div>
          <div style={{ color: 'var(--ink-muted)' }}>Games</div>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{stats.score}</div>
          <div style={{ color: 'var(--ink-muted)' }}>Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--link)' }}>{stats.highScore}</div>
          <div style={{ color: 'var(--ink-muted)' }}>High Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{stats.avgScore}</div>
          <div style={{ color: 'var(--ink-muted)' }}>Avg Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--warning, #f59e0b)' }}>{stats.epsilon}</div>
          <div style={{ color: 'var(--ink-muted)' }}>Epsilon</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setIsTraining(!isTraining);
            addLog(isTraining ? 'Training paused' : 'Training started...', 'info');
          }}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all"
          style={{
            background: isTraining ? 'var(--danger, #ef4444)' : 'var(--accent)',
            color: 'white'
          }}
        >
          {isTraining ? 'Pause' : 'Train'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all"
          style={{ background: 'var(--stroke)', color: 'var(--ink)' }}
        >
          Reset
        </button>
      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>Slow</span>
        <input
          type="range"
          min="10"
          max="200"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1 accent-[var(--accent)]"
        />
        <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>Fast</span>
      </div>

      {/* Info */}
      <div
        className="text-xs text-center max-w-md leading-relaxed"
        style={{ color: 'var(--ink-muted)' }}
      >
        Watch the AI learn to play Snake using Q-Learning. Epsilon (exploration rate)
        decreases as training progresses. Higher scores indicate better learning.
      </div>
    </div>
  );
}

/* ###########################################################
   ###           END OF SNAKE RL                            ###
   ########################################################### */
