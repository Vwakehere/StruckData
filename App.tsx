import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlgorithmType, SortStep, LabView } from './types';
import { ALGORITHM_DATA } from './constants';
import * as SortingService from './services/sortingService';
import Visualizer from './components/Visualizer';
import AlgorithmInfo from './components/AlgorithmInfo';
import StructureLab from './components/StructureLab';

const INITIAL_ARRAY_SIZE = 16;
const INITIAL_SPEED = 70;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<LabView>(LabView.SORTING);
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.QUICK);
  const [isSorting, setIsSorting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [customInput, setCustomInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fix: Use any for timeout reference to avoid NodeJS namespace issues in browser environment
  const timeoutRef = useRef<any>(null);

  const generateRandomArray = useCallback((size: number = INITIAL_ARRAY_SIZE) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    setArray(newArray);
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsSorting(false);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    generateRandomArray(array.length);
  };

  const prepareSorting = () => {
    setIsSorting(true);
    let gen: Generator<SortStep>;
    switch (algorithm) {
      case AlgorithmType.BUBBLE: gen = SortingService.bubbleSort(array); break;
      case AlgorithmType.SELECTION: gen = SortingService.selectionSort(array); break;
      case AlgorithmType.INSERTION: gen = SortingService.insertionSort(array); break;
      case AlgorithmType.MERGE: gen = SortingService.mergeSort(array); break;
      case AlgorithmType.QUICK: gen = SortingService.quickSort(array); break;
      case AlgorithmType.HEAP: gen = SortingService.heapSort(array); break;
      case AlgorithmType.SHELL: gen = SortingService.shellSort(array); break;
      default: gen = SortingService.bubbleSort(array);
    }

    const allSteps: SortStep[] = [];
    let result = gen.next();
    while (!result.done) {
      allSteps.push(result.value);
      result = gen.next();
    }
    setSteps(allSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!isSorting) {
      prepareSorting();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && isSorting && currentView === LabView.SORTING) {
      const delay = Math.max(10, Math.pow(101 - speed, 1.8));
      timeoutRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          goToNextStep();
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentStepIndex, speed, steps.length, currentView]);

  const handleCustomInput = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      setArray(parsed);
      setSteps([]);
      setCurrentStepIndex(-1);
      setCustomInput("");
      setIsSorting(false);
      setIsPlaying(false);
    }
  };

  const activeStep: SortStep = currentStepIndex >= 0 && steps[currentStepIndex] 
    ? steps[currentStepIndex] 
    : { array, comparingIndices: [], swappingIndices: [], sortedIndices: [], swapCount: 0 };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex selection:bg-blue-100 transition-colors duration-500`}>
      <aside className={`w-72 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/20'} border-r flex flex-col shrink-0 z-50 transition-all`}>
        <div className={`p-8 border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between gap-8`}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-600/30">
              <i className="fas fa-layer-group text-white text-base"></i>
            </div>
            <h2 className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>STRUCK<span className="text-blue-600">DATA</span></h2>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-16 h-9 rounded-xl flex items-center justify-center transition-all border ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800'}`}
          >
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
          </button>
        </div>
        
        <nav className="p-6 flex flex-col gap-2 overflow-y-auto flex-grow custom-scrollbar">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 mt-2">Sorting Module</div>
          <button 
            onClick={() => setCurrentView(LabView.SORTING)}
            className={`w-full text-left px-4 py-3.5 rounded-2xl text-[11px] font-black tracking-wider transition-all flex items-center gap-3 ${currentView === LabView.SORTING ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <i className="fas fa-chart-simple"></i> VISUALIZER
          </button>
          
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 mt-6">Data Structures</div>
          {[
            { v: LabView.STACK, i: 'fa-layer-group', l: 'STACK' },
            { v: LabView.QUEUE, i: 'fa-ellipsis-h', l: 'QUEUE' },
            { v: LabView.S_LINKED_LIST, i: 'fa-link', l: 'SINGLY LIST' },
            { v: LabView.D_LINKED_LIST, i: 'fa-arrows-left-right', l: 'DOUBLY LIST' },
            { v: LabView.C_LINKED_LIST, i: 'fa-circle-notch', l: 'CIRCULAR LIST' },
            { v: LabView.BST, i: 'fa-tree', l: 'BST' },
            { v: LabView.AVL, i: 'fa-scale-balanced', l: 'AVL TREE' },
            { v: LabView.BTREE, i: 'fa-diagram-project', l: 'B-TREE' }
          ].map((item) => (
            <button 
              key={item.v}
              onClick={() => setCurrentView(item.v)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-[11px] font-black tracking-wider transition-all flex items-center gap-3 ${currentView === item.v ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <i className={`fas ${item.i}`}></i> {item.l}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800">
           <div className={`${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'} p-4 rounded-[1.5rem] border`}>
             <span className="text-[9px] font-black text-slate-400 uppercase block mb-1.5">Kernel Status</span>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] text-slate-600 dark:text-slate-400 font-black">SYNCHRONIZED</span>
             </div>
           </div>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12 overflow-y-auto flex flex-col gap-8 custom-scrollbar relative">
        <div className="lg:hidden flex items-center justify-between mb-2">
          <button 
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'} border`}
          >
            <i className="fas fa-bars text-blue-600"></i>
          </button>
          <div className="text-right">
             <h1 className="text-sm font-black tracking-tighter uppercase leading-none">STRUCK<span className="text-blue-600">DATA</span></h1>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mobile Access</p>
          </div>
        </div>

        {currentView === LabView.SORTING ? (
          <div className="max-w-full mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-700">
            <header className={`flex flex-col lg:flex-row justify-between items-center gap-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/20'} p-8 rounded-[2.5rem] border transition-all`}>
              <div className="flex items-center gap-5">
                <div className="bg-blue-600 p-3.5 rounded-2xl shadow-xl shadow-blue-600/30">
                  <i className="fas fa-microchip text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Algorithm <span className="text-blue-600">Visualizer</span></h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">High-Fidelity Sorting Engine</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 justify-center">
                <form onSubmit={handleCustomInput} className="relative group">
                  <input 
                    type="text" 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter numbers (e.g. 10, 4, 15...)"
                    disabled={isSorting && isPlaying}
                    className={`w-64 h-12 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'} border rounded-2xl px-5 text-xs font-black outline-none focus:border-blue-500 transition-all`}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 px-4 rounded-xl text-[9px] font-black text-white shadow-lg shadow-blue-600/20 transition-all"
                  >
                    APPLY
                  </button>
                </form>

                <div className={`h-8 w-px ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} mx-2`}></div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={togglePlay}
                    className={`h-12 px-10 rounded-2xl font-black text-[11px] tracking-widest transition-all flex items-center gap-3 ${isPlaying ? 'bg-amber-500 hover:bg-amber-400 shadow-xl shadow-amber-500/30' : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30'} text-white active:scale-95`}
                  >
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    {isPlaying ? 'PAUSE' : isSorting ? 'RESUME' : 'INITIATE'}
                  </button>

                  <button 
                    onClick={handleReset}
                    className={`h-12 w-12 rounded-2xl ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm'} border transition-all flex items-center justify-center`}
                  >
                    <i className="fas fa-rotate-left"></i>
                  </button>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <section className="xl:col-span-8 flex flex-col gap-8">
                <div className="flex-grow min-h-[500px]">
                  <Visualizer step={activeStep} maxVal={Math.max(...array, 100)} darkMode={darkMode} />
                </div>
                
                <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} p-8 rounded-[2.5rem] border grid grid-cols-1 lg:grid-cols-3 gap-8`}>
                  <div className="space-y-4 lg:col-span-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Speed</span>
                      <span className="text-xs font-black text-blue-600">{speed}% OVERCLOCK</span>
                    </div>
                    <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <select 
                        className={`w-full ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 shadow-inner'} border rounded-2xl px-5 h-12 text-xs font-black outline-none appearance-none cursor-pointer transition-all hover:border-blue-500`}
                        value={algorithm}
                        onChange={(e) => {
                          setAlgorithm(e.target.value as AlgorithmType);
                          handleReset();
                        }}
                        disabled={isSorting && isPlaying}
                      >
                        {Object.values(AlgorithmType).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        {[16, 64].map(size => (
                          <button 
                            key={size}
                            onClick={() => generateRandomArray(size)} 
                            disabled={isSorting && isPlaying}
                            className={`flex-1 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'} disabled:opacity-50 text-[10px] h-12 rounded-2xl border transition-all font-black ${array.length === size ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600' : 'text-slate-500'}`}
                          >
                            {size === 16 ? 'TINY' : 'DENSE'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-4">
                    <div className={`p-5 rounded-3xl ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'} border text-center`}>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Complexity Class</span>
                      <span className="text-xl font-black text-blue-600">{ALGORITHM_DATA[algorithm].averageCase}</span>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="xl:col-span-4 h-full">
                <AlgorithmInfo data={ALGORITHM_DATA[algorithm]} darkMode={darkMode} />
              </aside>
            </div>
          </div>
        ) : (
          <StructureLab type={currentView} darkMode={darkMode} />
        )}

        <footer className="text-center py-10 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] opacity-60">
            STRUCKDATA • MULTI-MODAL ALGORITHM LAB • V3.2
          </p>
        </footer>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${darkMode ? '#1e293b' : '#cbd5e1'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${darkMode ? '#334155' : '#94a3b8'}; }
      `}</style>
    </div>
  );
};

export default App;
