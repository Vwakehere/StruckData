
import React from 'react';
import { SortStep } from '../types';

interface VisualizerProps {
  step: SortStep;
  maxVal: number;
  darkMode?: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ step, maxVal, darkMode }) => {
  const { array, comparingIndices, swappingIndices, sortedIndices, pivotIndex, variables, swapCount } = step;

  const getCellSize = () => {
    if (array.length > 100) return 'w-6 h-6 text-[8px]';
    if (array.length > 50) return 'w-8 h-8 text-[10px]';
    if (array.length > 20) return 'w-10 h-10 text-xs';
    return 'w-14 h-14 text-sm';
  };

  const cellSize = getCellSize();

  return (
    <div className={`${darkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-200 shadow-sm'} p-6 rounded-3xl border flex flex-col gap-6 h-full relative overflow-hidden transition-all duration-500`}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none transition-opacity ${darkMode ? 'opacity-20' : 'opacity-100'}`}></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
            <i className="fas fa-microchip"></i> Processor State
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className={`${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} px-3 py-1 rounded-lg border flex items-center gap-2 shadow-sm`}>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Swaps:</span>
              <span className="text-xs font-mono font-bold text-red-500">{swapCount}</span>
            </div>
            {variables && Object.entries(variables).map(([key, val]) => (
              <div key={key} className={`${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} px-3 py-1 rounded-lg border flex items-center gap-2 shadow-sm`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{key}:</span>
                <span className={`text-xs font-mono font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-[9px] uppercase font-black tracking-wider text-slate-500">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Comp</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Swap</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Sorted</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-600"></div> Pivot</div>
        </div>
      </div>

      <div className={`flex flex-wrap gap-2 justify-center content-start overflow-y-auto max-h-[450px] custom-scrollbar p-6 ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'} rounded-2xl border`}>
        {array.map((value, idx) => {
          const isComparing = comparingIndices.includes(idx);
          const isSwapping = swappingIndices.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const isPivot = pivotIndex === idx;

          let bgColor = darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600';
          let scale = 'scale-100';
          let shadow = 'shadow-sm';
          let ring = '';

          if (isSorted) {
            bgColor = darkMode ? 'bg-green-900/30 border-green-500/50 text-green-400' : 'bg-green-50 border-green-200 text-green-600';
          }
          
          if (isComparing) {
            bgColor = 'bg-yellow-400 border-yellow-500 text-slate-900';
            scale = 'scale-110 z-10';
            shadow = 'shadow-[0_0_15px_rgba(250,204,21,0.5)]';
          }

          if (isSwapping) {
            bgColor = 'bg-red-500 border-red-600 text-white';
            scale = 'scale-115 z-20';
            shadow = 'shadow-[0_0_20px_rgba(239,68,68,0.6)]';
          }

          if (isPivot) {
            bgColor = isComparing ? 'bg-yellow-400' : isSwapping ? 'bg-red-500' : 'bg-purple-600';
            ring = darkMode ? 'ring-4 ring-purple-900 ring-offset-2 ring-offset-slate-900' : 'ring-4 ring-purple-200 ring-offset-2 ring-offset-white';
            scale = 'scale-110 z-30';
            shadow = 'shadow-[0_0_20px_rgba(168,85,247,0.4)]';
          }

          return (
            <div
              key={idx}
              className={`
                ${cellSize} 
                flex items-center justify-center 
                rounded-lg border 
                font-mono font-bold 
                transition-all duration-200 ease-in-out
                ${bgColor} ${scale} ${shadow} ${ring}
              `}
            >
              {array.length <= 150 ? value : ''}
            </div>
          );
        })}
      </div>

      {array.length === 0 && (
        <div className="flex-grow flex flex-col items-center justify-center gap-4 text-slate-300">
          <i className="fas fa-layer-group text-4xl opacity-50"></i>
          <span className="text-sm italic font-medium">Memory buffer empty...</span>
        </div>
      )}
    </div>
  );
};

export default Visualizer;
