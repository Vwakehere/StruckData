
import React, { useState } from 'react';
import { AlgorithmMetadata } from '../types';

interface AlgorithmInfoProps {
  data: AlgorithmMetadata;
  darkMode?: boolean;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ data, darkMode }) => {
  const [view, setView] = useState<'info' | 'code'>('info');

  return (
    <div className={`${darkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-200 shadow-sm'} p-6 rounded-3xl border h-full overflow-y-auto flex flex-col relative transition-all`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{data.name}</h2>
          <div className="flex gap-4 mt-2">
             <div className="text-[10px] text-green-600 font-mono uppercase bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded border border-green-100 dark:border-green-500/20">Best: {data.bestCase}</div>
             <div className="text-[10px] text-red-600 font-mono uppercase bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-500/20">Worst: {data.worstCase}</div>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
          <i className="fas fa-terminal"></i>
        </div>
      </div>

      <div className={`flex gap-2 mb-6 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} p-1 rounded-xl border`}>
        <button 
          onClick={() => setView('info')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'info' ? darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Details
        </button>
        <button 
          onClick={() => setView('code')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'code' ? darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
        >
          C Implementation
        </button>
      </div>

      <div className="flex-grow space-y-6">
        {view === 'info' ? (
          <>
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Flow</h3>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed font-medium`}>{data.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'} p-3 rounded-2xl border shadow-sm`}>
                <h4 className="text-[9px] font-black text-green-600 uppercase mb-2">Advantages</h4>
                <ul className="text-[11px] text-slate-500 space-y-1.5 font-medium">
                  {data.pros.map((p, i) => <li key={i} className="flex items-start gap-2"><i className="fas fa-check text-[8px] mt-1 text-green-500"></i> {p}</li>)}
                </ul>
              </div>
              <div className={`${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'} p-3 rounded-2xl border shadow-sm`}>
                <h4 className="text-[9px] font-black text-red-500 uppercase mb-2">Drawbacks</h4>
                <ul className="text-[11px] text-slate-500 space-y-1.5 font-medium">
                  {data.cons.map((c, i) => <li key={i} className="flex items-start gap-2"><i className="fas fa-times text-[8px] mt-1 text-red-400"></i> {c}</li>)}
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Space Complexity</span>
                 <span className="text-xs font-mono font-bold text-blue-600">{data.spaceComplexity}</span>
               </div>
            </div>
          </>
        ) : (
          <div className={`relative group rounded-2xl overflow-hidden border ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
            <div className={`absolute top-2 right-2 text-[8px] font-mono ${darkMode ? 'text-slate-600' : 'text-slate-400'} uppercase ${darkMode ? 'bg-slate-900' : 'bg-white'} px-1.5 rounded border ${darkMode ? 'border-slate-800' : 'border-slate-100'} shadow-sm`}>C Language</div>
            <pre className={`p-4 text-[10px] font-mono leading-relaxed overflow-x-auto ${darkMode ? 'text-blue-300' : 'text-slate-700'} custom-scrollbar`}>
              <code>{data.code}</code>
            </pre>
            <div className={`p-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border-t flex justify-end`}>
              <button 
                onClick={() => navigator.clipboard.writeText(data.code)}
                className={`text-[9px] font-bold ${darkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'} uppercase flex items-center gap-1.5 transition-colors`}
              >
                <i className="fas fa-copy"></i> Copy Logic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmInfo;
