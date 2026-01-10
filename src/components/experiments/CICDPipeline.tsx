/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   CI/CD PIPELINE - Interactive deployment simulator  ###
   ###   Visualizes build, test & deploy stages with logs   ###
   ###   Last Updated: 28-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import {
  Package,
  Hammer,
  Rocket,
  FlaskConical,
  Download,
  Search,
  Lock,
} from 'lucide-react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface Stage {
  id: string;
  name: string;
  icon: ReactNode;
  duration: number;
}

interface Pipeline {
  name: string;
  stages: Stage[];
}

type StageStatus = 'pending' | 'running' | 'success' | 'failed';

interface StageState {
  status: StageStatus;
  duration?: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

/* ###########################################################
   ###   2. Configuration                                   ###
   ########################################################### */

const iconSize = 24;
const iconSizeSm = 20;

const pipelines: Record<string, Pipeline> = {
  simple: {
    name: 'Simple',
    stages: [
      { id: 'checkout', name: 'Checkout', icon: <Package size={iconSize} />, duration: 2000 },
      { id: 'build', name: 'Build', icon: <Hammer size={iconSize} />, duration: 3000 },
      { id: 'deploy', name: 'Deploy', icon: <Rocket size={iconSize} />, duration: 2500 },
    ],
  },
  standard: {
    name: 'Standard',
    stages: [
      { id: 'checkout', name: 'Checkout', icon: <Package size={iconSize} />, duration: 2000 },
      { id: 'build', name: 'Build', icon: <Hammer size={iconSize} />, duration: 3000 },
      { id: 'test', name: 'Test', icon: <FlaskConical size={iconSize} />, duration: 4000 },
      { id: 'deploy', name: 'Deploy', icon: <Rocket size={iconSize} />, duration: 2500 },
    ],
  },
  full: {
    name: 'Full',
    stages: [
      { id: 'checkout', name: 'Checkout', icon: <Package size={iconSizeSm} />, duration: 1500 },
      { id: 'install', name: 'Install', icon: <Download size={iconSizeSm} />, duration: 2500 },
      { id: 'lint', name: 'Lint', icon: <Search size={iconSizeSm} />, duration: 1500 },
      { id: 'build', name: 'Build', icon: <Hammer size={iconSizeSm} />, duration: 2500 },
      { id: 'test', name: 'Test', icon: <FlaskConical size={iconSizeSm} />, duration: 3000 },
      { id: 'security', name: 'Security', icon: <Lock size={iconSizeSm} />, duration: 2500 },
      { id: 'deploy', name: 'Deploy', icon: <Rocket size={iconSizeSm} />, duration: 2000 },
    ],
  },
};

/* ###########################################################
   ###   3. Component                                       ###
   ########################################################### */

export default function CICDPipeline() {
  /* ###########################################################
     ###   State & Refs                                       ###
     ########################################################### */

  const [currentPipeline, setCurrentPipeline] = useState('simple');
  const [isRunning, setIsRunning] = useState(false);
  const [stageStates, setStageStates] = useState<Record<string, StageState>>({});
  const [activeConnectors, setActiveConnectors] = useState<Set<number>>(new Set());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState<'pending' | 'running' | 'success' | 'failed'>('pending');
  const [stats, setStats] = useState({ totalRuns: 0, successfulRuns: 0, totalDuration: 0 });
  const [showLogs, setShowLogs] = useState(false);
  const logsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  /* ###########################################################
     ###   Helper Functions                                  ###
     ########################################################### */

  // Add log entry with timestamp
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { timestamp, message, type }]);
  }, []);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    addLog('Pipeline initialized. Ready to run.', 'info');
  }, [addLog]);

  // Reset pipeline to initial state
  const resetPipeline = useCallback(() => {
    setStageStates({});
    setActiveConnectors(new Set());
    setProgress(0);
    setPipelineStatus('pending');
    addLog('Pipeline reset', 'info');
  }, [addLog]);

  useEffect(() => {
    resetPipeline();
  }, [currentPipeline, resetPipeline]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Run a single pipeline stage with simulated delay
  const runStage = async (stage: Stage, allStages: Stage[], stageIndex: number): Promise<void> => {
    if (abortRef.current) throw new Error('Pipeline stopped');

    setStageStates((prev) => ({
      ...prev,
      [stage.id]: { status: 'running' },
    }));

    addLog(`Starting: ${stage.name}`, 'info');

    const progressVal = ((stageIndex + 0.5) / allStages.length) * 100;
    setProgress(progressVal);

    const startTime = Date.now();
    const shouldFail = Math.random() < 0.1;

    await delay(stage.duration);

    if (abortRef.current) throw new Error('Pipeline stopped');

    const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';

    if (shouldFail) {
      setStageStates((prev) => ({
        ...prev,
        [stage.id]: { status: 'failed', duration },
      }));
      addLog(`${stage.name} failed (${duration})`, 'error');
      throw new Error(`Stage ${stage.name} failed`);
    }

    setStageStates((prev) => ({
      ...prev,
      [stage.id]: { status: 'success', duration },
    }));
    addLog(`${stage.name} completed (${duration})`, 'success');

    setProgress(((stageIndex + 1) / allStages.length) * 100);
  };

  // Run entire pipeline sequentially
  const runPipeline = async () => {
    if (isRunning) return;

    abortRef.current = false;
    setIsRunning(true);
    setPipelineStatus('running');
    resetPipeline();
    addLog('Pipeline started', 'info');

    const pipeline = pipelines[currentPipeline];
    const stages = pipeline.stages;
    const startTime = Date.now();

    try {
      for (let i = 0; i < stages.length; i++) {
        await runStage(stages[i], stages, i);
        if (i < stages.length - 1) {
          setActiveConnectors((prev) => new Set([...prev, i]));
        }
      }

      const duration = Date.now() - startTime;
      setPipelineStatus('success');
      addLog(`Pipeline completed in ${(duration / 1000).toFixed(1)}s`, 'success');
      setStats((prev) => ({
        totalRuns: prev.totalRuns + 1,
        successfulRuns: prev.successfulRuns + 1,
        totalDuration: prev.totalDuration + duration,
      }));
    } catch (error) {
      setPipelineStatus('failed');
      addLog(`Pipeline failed: ${(error as Error).message}`, 'error');
      setStats((prev) => ({
        ...prev,
        totalRuns: prev.totalRuns + 1,
      }));
    }

    setIsRunning(false);
  };

  // Stop running pipeline
  const stopPipeline = () => {
    if (!isRunning) return;
    abortRef.current = true;
    setPipelineStatus('failed');
    addLog('Pipeline stopped by user', 'warning');
    setIsRunning(false);
  };

  const pipeline = pipelines[currentPipeline];
  const isFullPipeline = currentPipeline === 'full';

  /* ###########################################################
     ###   Render Helpers                                    ###
     ########################################################### */

  // Get icon classes based on stage status
  const getIconClasses = (status: StageStatus) => {
    const base = `rounded-full flex items-center justify-center border-2 transition-all ${
      isFullPipeline ? 'w-9 h-9 sm:w-11 sm:h-11' : 'w-11 h-11 sm:w-14 sm:h-14'
    }`;
    switch (status) {
      case 'running':
        return `${base} bg-blue-500/30 border-blue-400 text-blue-400 animate-pulse`;
      case 'success':
        return `${base} bg-green-500/30 border-green-400 text-green-400`;
      case 'failed':
        return `${base} bg-red-500/30 border-red-400 text-red-400`;
      default:
        return `${base} bg-white/5 border-white/20 text-white/50`;
    }
  };

  // Get status text color
  const getStatusColor = (status: StageStatus) => {
    switch (status) {
      case 'running':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-white/40';
    }
  };

  // Render individual stage with icon and connector
  const renderStage = (stage: Stage, index: number, showConnectorInline: boolean) => {
    const state = stageStates[stage.id] || { status: 'pending' as StageStatus };
    const showConnector = showConnectorInline && index < pipeline.stages.length - 1;
    const connectorActive = activeConnectors.has(index);
    const iconHeight = isFullPipeline ? 'h-9 sm:h-11' : 'h-11 sm:h-14';

    return (
      <div key={stage.id} className="flex items-start">
        <div className="flex flex-col items-center min-w-[48px]">
          <div className={getIconClasses(state.status)}>{stage.icon}</div>
          <div className={`mt-1 text-[10px] font-medium text-center truncate w-full`}>
            {stage.name}
          </div>
          <div className={`text-[9px] uppercase tracking-wide ${getStatusColor(state.status)}`}>
            {state.status === 'pending' ? '' : state.status.slice(0, 4)}
          </div>
        </div>
        {showConnector && (
          <div className={`flex items-center ${iconHeight}`}>
            <div
              className="relative bg-white/10 overflow-hidden w-4 sm:w-8 h-0.5 -mx-1"
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: connectorActive ? '100%' : '0%' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render stage reversed for bottom row (U-shaped flow)
  const renderStageReversed = (stage: Stage, index: number, showConnector: boolean, connectorIndex: number) => {
    const state = stageStates[stage.id] || { status: 'pending' as StageStatus };
    const connectorActive = activeConnectors.has(connectorIndex);
    const iconHeight = isFullPipeline ? 'h-9 sm:h-11' : 'h-11 sm:h-14';

    return (
      <div key={stage.id} className="flex items-start">
        <div className="flex flex-col items-center min-w-[48px]">
          <div className={getIconClasses(state.status)}>{stage.icon}</div>
          <div className={`mt-1 text-[10px] font-medium text-center truncate w-full`}>
            {stage.name}
          </div>
          <div className={`text-[9px] uppercase tracking-wide ${getStatusColor(state.status)}`}>
            {state.status === 'pending' ? '' : state.status.slice(0, 4)}
          </div>
        </div>
        {showConnector && (
          <div className={`flex items-center ${iconHeight}`}>
            <div className="relative bg-white/10 overflow-hidden w-4 sm:w-8 h-0.5 -mx-1">
              <div
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: connectorActive ? '100%' : '0%' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const successRate = stats.totalRuns > 0 ? ((stats.successfulRuns / stats.totalRuns) * 100).toFixed(0) : '0';

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden font-sans text-sm"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          CI/CD Pipeline
        </h2>
        <p className="text-white/40 text-xs mt-0.5">Simulate deployment pipelines</p>
      </div>

      {/* Controls */}
      <div className="p-3 sm:p-4 border-b border-white/10 flex flex-wrap gap-2 items-center">
        <button
          onClick={runPipeline}
          disabled={isRunning}
          className="px-3 py-1.5 rounded-lg font-semibold text-xs uppercase tracking-wide bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition disabled:opacity-50"
        >
          Run
        </button>
        <button
          onClick={stopPipeline}
          className="px-3 py-1.5 rounded-lg font-semibold text-xs uppercase tracking-wide bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 transition"
        >
          Stop
        </button>
        <button
          onClick={resetPipeline}
          className="px-3 py-1.5 rounded-lg font-semibold text-xs uppercase tracking-wide bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 transition"
        >
          Reset
        </button>
        <div className="flex gap-1 rounded-lg bg-white/10 border border-white/20 p-0.5">
          {['simple', 'standard', 'full'].map((type) => (
            <button
              key={type}
              onClick={() => setCurrentPipeline(type)}
              className={`px-2 py-1 rounded text-xs font-medium transition ${
                currentPipeline === type
                  ? 'bg-purple-500/80 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {type === 'simple' ? '3' : type === 'standard' ? '4' : '7'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="ml-auto px-3 py-1.5 rounded-lg font-semibold text-xs uppercase tracking-wide bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 transition"
        >
          {showLogs ? 'Hide' : 'Logs'}
        </button>
      </div>

      {/* Pipeline View */}
      <div className="p-4 sm:p-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4 p-2.5 bg-black/20 rounded-lg">
          <div className="text-sm font-medium text-white/80">{pipeline.name} Pipeline</div>
          <div
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
              pipelineStatus === 'running'
                ? 'bg-blue-500/20 text-blue-400'
                : pipelineStatus === 'success'
                ? 'bg-green-500/20 text-green-400'
                : pipelineStatus === 'failed'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-white/10 text-white/40'
            }`}
          >
            {pipelineStatus}
          </div>
        </div>

        {/* Stages */}
        <div className="py-4">
          {isFullPipeline ? (
            /* Two-row layout for full pipeline - U-shaped flow */
            <div className="flex flex-col items-center">
              {/* Top row: first 4 stages (left to right) */}
              <div className="flex items-start justify-center">
                {pipeline.stages.slice(0, 4).map((stage, i) => renderStage(stage, i, i < 3))}
              </div>
              {/* Vertical connector on right side */}
              <div className="flex justify-center w-full">
                <div className="w-[220px] sm:w-[320px] flex justify-end">
                  <div className="relative w-0.5 h-4 bg-white/10 overflow-hidden -mt-1 mr-5 sm:mr-6">
                    <div
                      className="absolute inset-x-0 top-0 bg-gradient-to-b from-purple-500 to-indigo-500 transition-all duration-500"
                      style={{ height: activeConnectors.has(3) ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
              {/* Bottom row: last 3 stages (reversed for U-flow: Deploy ← Security ← Test) */}
              <div className="flex items-start justify-center -mt-1">
                {[...pipeline.stages.slice(4)].reverse().map((stage, i, arr) => {
                  const originalIndex = 6 - i; // Deploy=6, Security=5, Test=4
                  const showConnector = i < arr.length - 1;
                  const connectorIndex = originalIndex - 1; // connector activates when previous stage completes
                  return renderStageReversed(stage, originalIndex, showConnector, connectorIndex);
                })}
              </div>
            </div>
          ) : (
            /* Horizontal layout for simple/standard pipelines */
            <div className="flex items-start justify-center gap-1 sm:gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {pipeline.stages.map((stage, i) => renderStage(stage, i, true))}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10">
            <div className="text-lg font-bold">{stats.totalRuns}</div>
            <div className="text-[10px] text-white/40 uppercase">Runs</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10">
            <div className="text-lg font-bold">{successRate}%</div>
            <div className="text-[10px] text-white/40 uppercase">Success</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10">
            <div className="text-lg font-bold">{stats.successfulRuns}</div>
            <div className="text-[10px] text-white/40 uppercase">Passed</div>
          </div>
        </div>
      </div>

      {/* Logs Panel - Collapsible */}
      {showLogs && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-purple-400">Pipeline Logs</div>
            <button
              onClick={() => setLogs([])}
              className="px-2 py-1 rounded bg-white/10 text-white/50 text-[10px] hover:bg-white/15 transition"
            >
              Clear
            </button>
          </div>
          <div
            ref={logsRef}
            className="bg-black rounded-lg p-3 font-mono text-[11px] overflow-y-auto max-h-[150px] space-y-0.5"
          >
            {logs.map((log, i) => (
              <div
                key={i}
                className={`${
                  log.type === 'success'
                    ? 'text-green-400'
                    : log.type === 'error'
                    ? 'text-red-400'
                    : log.type === 'warning'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }`}
              >
                <span className="text-white/20">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
