
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LabView } from '../types';

interface StructureLabProps {
  type: LabView;
  darkMode?: boolean;
}

interface NodeState {
  id: string;
  values: number[];
  x: number;
  y: number;
  leftId?: string;
  rightId?: string;
  childrenIds?: string[];
  isHead?: boolean;
  left?: NodeState;
  right?: NodeState;
}

const PRESET_DATA: Record<string, number[]> = {
  [LabView.STACK]: [40, 30, 20, 10], 
  [LabView.QUEUE]: [5, 15, 25, 35],
  [LabView.S_LINKED_LIST]: [10, 20, 30, 40],
  [LabView.D_LINKED_LIST]: [12, 24, 36, 48],
  [LabView.C_LINKED_LIST]: [7, 14, 21, 28],
  [LabView.BST]: [50, 30, 70, 20, 40, 60, 80],
  [LabView.AVL]: [30, 20, 40, 10, 25, 35, 50],
  [LabView.BTREE]: [10, 20, 30, 40, 50, 60, 70]
};

const DESCRIPTIONS: Record<string, string> = {
  [LabView.STACK]: "A linear data structure following LIFO (Last-In-First-Out).",
  [LabView.QUEUE]: "A linear data structure following FIFO (First-In-First-Out).",
  [LabView.S_LINKED_LIST]: "A sequence of nodes where each node points to the next.",
  [LabView.D_LINKED_LIST]: "A sequence of nodes where each node points both forward and backward.",
  [LabView.C_LINKED_LIST]: "A variation where the last node points back to the first node.",
  [LabView.BST]: "A hierarchical structure where left child < parent < right child.",
  [LabView.AVL]: "A self-balancing search tree where height difference is at most 1.",
  [LabView.BTREE]: "A balanced search tree optimized for systems handling large data blocks."
};

const StructureLab: React.FC<StructureLabProps> = ({ type, darkMode }) => {
  const [data, setData] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editValue, setEditValue] = useState("");
  const [message, setMessage] = useState("System Ready");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(PRESET_DATA[type] || []);
    setSelectedNodeId(null);
    setZoom(1);
    setMessage(`${type} Mode Active`);
  }, [type]);

  const handleClear = () => {
    setData([]);
    setSelectedNodeId(null);
    setMessage("Structure Wiped");
  };

  const getButtonLabels = () => {
    if (type === LabView.STACK) return { add: "PUSH", del: "POP" };
    if (type === LabView.QUEUE) return { add: "ENQUEUE", del: "DEQUEUE" };
    return { add: "INSERT", del: "DELETE" };
  };

  const labels = getButtonLabels();

  const handleActionAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = inputValue ? parseInt(inputValue) : Math.floor(Math.random() * 99) + 1;
    if (isNaN(val)) return;
    if (data.includes(val) && !type.includes('List')) return setMessage("Duplicate value rejected.");
    
    if (type === LabView.STACK) {
      setData(prev => [val, ...prev]);
    } else {
      setData(prev => [...prev, val]);
    }
    setInputValue("");
    setMessage(`${labels.add}: ${val}`);
  };

  const handleActionDelete = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (data.length === 0) return setMessage("Empty buffer");
    
    if (selectedNodeId) {
      const node = nodes.find(n => n.id === selectedNodeId);
      if (node) {
        setData(prev => prev.filter(v => !node.values.includes(v)));
        setSelectedNodeId(null);
        setMessage("Node Purged");
        return;
      }
    }

    if (type === LabView.STACK || type === LabView.QUEUE) {
      const removed = data[0];
      setData(prev => prev.slice(1));
      setMessage(`Removed: ${removed}`);
    } else {
      const removed = data[data.length - 1];
      setData(prev => prev.slice(0, -1));
      setMessage("Tail Trimmed");
    }
  };

  const handleActionUpdate = () => {
    if (!selectedNodeId) return;
    const newVal = parseInt(editValue);
    if (isNaN(newVal)) return setMessage("Invalid Data Input");

    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return;

    const oldVal = node.values[0];
    setData(prev => prev.map(v => v === oldVal ? newVal : v));
    setMessage(`Updated to ${newVal}`);
    setEditValue("");
    setSelectedNodeId(null);
  };

  const nodes = useMemo(() => {
    const calculatedNodes: NodeState[] = [];

    if (type === LabView.BST || type === LabView.AVL) {
      const insert = (val: number, node: any = null, x: number, y: number, offset: number): any => {
        if (!node) {
          const newNode: NodeState = { id: `node-${val}-${Math.random()}`, values: [val], x, y };
          calculatedNodes.push(newNode);
          return newNode;
        }
        if (val < node.values[0]) {
          node.left = insert(val, node.left, x - offset, y + 120, offset / 1.7);
          node.leftId = node.left.id;
        } else {
          node.right = insert(val, node.right, x + offset, y + 120, offset / 1.7);
          node.rightId = node.right.id;
        }
        return node;
      };

      let root: any = null;
      const treeData = type === LabView.AVL ? [...data].sort((a,b) => a-b) : data;
      
      const buildAVL = (vals: number[], level: number, xStart: number, xEnd: number): any => {
        if (vals.length === 0) return null;
        const mid = Math.floor(vals.length / 2);
        const node: NodeState = { id: `node-${vals[mid]}-${level}`, values: [vals[mid]], x: (xStart + xEnd) / 2, y: 120 + level * 120 };
        calculatedNodes.push(node);
        node.leftId = buildAVL(vals.slice(0, mid), level + 1, xStart, node.x)?.id;
        node.rightId = buildAVL(vals.slice(mid + 1), level + 1, node.x, xEnd)?.id;
        return node;
      };

      if (type === LabView.AVL) {
        buildAVL(treeData, 0, 100, 1400);
      } else {
        treeData.forEach(v => root = insert(v, root, 750, 120, 350));
      }
      if (calculatedNodes.length > 0) calculatedNodes[0].isHead = true;

    } else if (type === LabView.BTREE) {
      const sorted = [...data].sort((a, b) => a - b);
      const chunkSize = 3;
      const groups: number[][] = [];
      for (let i = 0; i < sorted.length; i += chunkSize) groups.push(sorted.slice(i, i + chunkSize));

      if (groups.length > 0) {
        const midIdx = Math.floor(groups.length / 2);
        const root: NodeState = { id: 'root', values: groups[midIdx], x: 750, y: 150, isHead: true, childrenIds: [] as string[] };
        calculatedNodes.push(root);
        groups.forEach((g, i) => {
          if (i === midIdx) return;
          const cid = `child-${i}`;
          if (root.childrenIds) root.childrenIds.push(cid);
          calculatedNodes.push({ id: cid, values: g, x: 250 + i * 300, y: 350 });
        });
      }
    } else {
      data.forEach((val, i) => {
        const x = type === LabView.STACK ? 750 : 150 + i * 180;
        const y = type === LabView.STACK ? 120 + i * 90 : 300;
        calculatedNodes.push({ id: `node-${val}-${i}`, values: [val], x, y, isHead: i === 0 });
      });
    }
    return calculatedNodes;
  }, [data, type]);

  const renderLinks = () => {
    const links: React.ReactNode[] = [];
    const isDoubly = type === LabView.D_LINKED_LIST;
    const isLinear = [LabView.STACK, LabView.QUEUE, LabView.S_LINKED_LIST, LabView.D_LINKED_LIST, LabView.C_LINKED_LIST].includes(type);

    if (isDoubly) {
      for (let i = 0; i < nodes.length - 1; i++) {
        links.push(<DoublyArrow key={`da-${i}`} from={nodes[i]} to={nodes[i+1]} darkMode={darkMode} />);
      }
    } else if (isLinear) {
      const hasArrows = ![LabView.STACK, LabView.QUEUE].includes(type);
      for (let i = 0; i < nodes.length - 1; i++) {
        links.push(<Arrow key={`l-${i}`} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[i+1].x} y2={nodes[i+1].y} darkMode={darkMode} showArrow={hasArrows} />);
      }
      if (type === LabView.C_LINKED_LIST && nodes.length > 1) {
        links.push(<Arrow key="circ" x1={nodes[nodes.length-1].x} y1={nodes[nodes.length-1].y} x2={nodes[0].x} y2={nodes[0].y} darkMode={darkMode} isCurved showArrow={true} />);
      }
    } else {
      nodes.forEach(node => {
        const targets = [
          ...(node.leftId ? [nodes.find(n => n.id === node.leftId)] : []),
          ...(node.rightId ? [nodes.find(n => n.id === node.rightId)] : []),
          ...(node.childrenIds ? node.childrenIds.map(id => nodes.find(n => n.id === id)) : [])
        ].filter(Boolean);
        targets.forEach((t, idx) => {
          if (t) links.push(<Arrow key={`${node.id}-${idx}`} x1={node.x} y1={node.y} x2={t.x} y2={t.y} darkMode={darkMode} showArrow={false} />);
        });
      });
    }
    return links;
  };

  const whiteboardBounds = useMemo(() => {
    if (nodes.length === 0) return { width: 1200, height: 800 };
    const maxX = Math.max(...nodes.map(n => n.x)) + 500;
    const maxY = Math.max(...nodes.map(n => n.y)) + 500;
    return { width: Math.max(maxX, 1500), height: Math.max(maxY, 800) };
  }, [nodes]);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 w-full max-w-full overflow-hidden relative">
      
      {/* Side Control Panel */}
      <aside className={`w-72 shrink-0 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-2xl shadow-slate-200/50'} border rounded-[2.5rem] p-7 flex flex-col gap-8 backdrop-blur-xl z-50 transition-all duration-300`}>
        <div className="space-y-2">
           <h1 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-800'} tracking-tight uppercase leading-tight`}>{type}</h1>
           <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Data Structure Lab</p>
        </div>

        <div className="h-px bg-slate-400/20"></div>

        <div className="space-y-6">
           <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Value Injection</label>
             <form onSubmit={handleActionAdd} className="space-y-2">
               <input 
                 type="number" 
                 value={inputValue} 
                 onChange={(e) => setInputValue(e.target.value)} 
                 placeholder="00" 
                 className={`w-full h-12 rounded-2xl px-5 text-sm font-black outline-none transition-all ${darkMode ? 'bg-slate-950 text-white border-slate-700' : 'bg-slate-50 text-slate-800 border-slate-100 shadow-inner'} border focus:border-blue-500`} 
               />
               <div className="grid grid-cols-2 gap-2">
                 <button 
                   type="submit" 
                   className="h-11 rounded-xl text-[10px] font-black bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
                 >
                   {labels.add}
                 </button>
                 <button 
                   onClick={handleActionDelete} 
                   className={`h-11 rounded-xl text-[10px] font-black border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-red-400' : 'bg-white border-slate-200 text-red-600 hover:bg-red-50'}`}
                 >
                   {labels.del}
                 </button>
               </div>
             </form>
           </div>

           {selectedNodeId && (
             <div className="p-4 rounded-3xl bg-green-500/5 border border-green-500/10 animate-in slide-in-from-top-4 space-y-3">
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest block">Update Block</span>
                <input 
                  type="number" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)} 
                  placeholder="NEW" 
                  className={`w-full h-10 rounded-xl px-4 text-xs font-black outline-none ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 shadow-sm'} border focus:border-green-500`} 
                />
                <button 
                  onClick={handleActionUpdate} 
                  className="w-full h-10 rounded-xl bg-green-600 hover:bg-green-500 text-white text-[10px] font-black transition-all"
                >
                  COMMIT
                </button>
             </div>
           )}
        </div>

        <div className="mt-auto space-y-4">
           <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Workspace Zoom</label>
             <div className={`flex items-center p-1 rounded-2xl ${darkMode ? 'bg-slate-950/50' : 'bg-slate-50'} border ${darkMode ? 'border-slate-800' : 'border-slate-100 shadow-inner'}`}>
                <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.4))} className="flex-1 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-blue-500">
                  <i className="fas fa-minus text-xs"></i>
                </button>
                <span className="flex-1 text-center text-[10px] font-black text-slate-500">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))} className="flex-1 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-blue-500">
                  <i className="fas fa-plus text-xs"></i>
                </button>
             </div>
           </div>
           <button 
             onClick={handleClear} 
             className={`w-full h-12 rounded-2xl text-[10px] font-black tracking-widest transition-all ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'} border`}
           >
             CLEAR ALL
           </button>
        </div>
      </aside>

      {/* Main Lab Content */}
      <div 
        className={`flex-grow ${darkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-200 shadow-sm'} rounded-[2.5rem] border overflow-auto select-none relative custom-scrollbar group`}
        onClick={() => setSelectedNodeId(null)}
      >
        <div 
          style={{ width: whiteboardBounds.width, height: whiteboardBounds.height, transform: `scale(${zoom})`, transformOrigin: 'top left' }} 
          className="relative transition-transform duration-300"
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage: `radial-gradient(${darkMode ? '#fff' : '#000'} 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px'}}></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <marker id="subtle-arrow" markerWidth="8" markerHeight="8" refX="24" refY="4" orientation="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={darkMode ? "#475569" : "#cbd5e1"} />
              </marker>
            </defs>
            {renderLinks()}
          </svg>

          {nodes.map((node) => {
            const isStackTop = type === LabView.STACK && nodes.indexOf(node) === 0;
            const isQueueFront = type === LabView.QUEUE && nodes.indexOf(node) === 0;
            const isBTree = type === LabView.BTREE;
            return (
              <div
                key={node.id}
                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); setEditValue(node.values[0].toString()); }}
                style={{ 
                  left: node.x - (isBTree ? node.values.length * 40 : 45), 
                  top: node.y - 45,
                  width: isBTree ? node.values.length * 90 : 90,
                }}
                className={`absolute h-24 rounded-[2rem] flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 z-10 cursor-pointer ${
                  selectedNodeId === node.id 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] scale-110 ring-[15px] ring-blue-600/10' 
                  : node.isHead 
                    ? (darkMode ? 'bg-indigo-900/40 border-indigo-500 text-indigo-100 shadow-xl shadow-indigo-500/10' : 'bg-indigo-50 border-indigo-400 text-indigo-600 shadow-md')
                    : (darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500' : 'bg-white border-slate-200 text-slate-600 shadow-sm hover:border-blue-400 hover:scale-105')
                }`}
              >
                <div className="flex w-full h-full divide-x divide-slate-100 dark:divide-slate-700">
                  {node.values.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-center px-2">
                      <div className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-[0.2em]">
                        {isStackTop ? 'TOP' : isQueueFront ? 'FRONT' : 'VAL'}
                      </div>
                      <span className="text-2xl font-black tracking-tighter">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Message HUD */}
        <div className="absolute top-6 left-6 pointer-events-none">
           <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md flex items-center gap-3 shadow-lg`}>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{message}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

interface DoublyArrowProps {
  from: NodeState;
  to: NodeState;
  darkMode?: boolean;
}

// Custom Bidirectional Parallel Arrow matching the Switch/Reference image
const DoublyArrow: React.FC<DoublyArrowProps> = ({ from, to, darkMode }) => {
  const color = darkMode ? "#475569" : "#cbd5e1";
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);
  const offset = 55; 
  
  // Perpendicular shift for parallel look
  const perpX = Math.cos(angle + Math.PI/2) * 10;
  const perpY = Math.sin(angle + Math.PI/2) * 10;

  // Forward Path (Top)
  const fx1 = from.x + Math.cos(angle) * (offset - 5) + perpX;
  const fy1 = from.y + Math.sin(angle) * (offset - 5) + perpY;
  const fx2 = to.x - Math.cos(angle) * offset + perpX;
  const fy2 = to.y - Math.sin(angle) * offset + perpY;

  // Backward Path (Bottom)
  const bx1 = to.x - Math.cos(angle) * (offset - 5) - perpX;
  const by1 = to.y - Math.sin(angle) * (offset - 5) - perpY;
  const bx2 = from.x + Math.cos(angle) * offset - perpX;
  const by2 = from.y + Math.sin(angle) * offset - perpY;

  return (
    <g className="transition-all duration-300">
      <line x1={fx1} y1={fy1} x2={fx2} y2={fy2} stroke={color} strokeWidth="4" markerEnd="url(#subtle-arrow)" strokeLinecap="round" />
      <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke={color} strokeWidth="4" markerEnd="url(#subtle-arrow)" strokeLinecap="round" />
    </g>
  );
};

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  darkMode?: boolean;
  isCurved?: boolean;
  showArrow?: boolean;
}

const Arrow: React.FC<ArrowProps> = ({ x1, y1, x2, y2, darkMode, isCurved = false, showArrow = true }) => {
  const color = darkMode ? "#475569" : "#cbd5e1";
  
  if (isCurved) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 + 300;
    return <path d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`} stroke={color} strokeWidth="3" fill="none" markerEnd={showArrow ? "url(#subtle-arrow)" : undefined} strokeDasharray="8,8" />;
  }
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const offset = 55; 
  
  const sx1 = x1 + Math.cos(angle) * (offset - 5);
  const sy1 = y1 + Math.sin(angle) * (offset - 5);
  const sx2 = x2 - Math.cos(angle) * offset;
  const sy2 = y2 - Math.sin(angle) * offset;
  
  return <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth="3" markerEnd={showArrow ? "url(#subtle-arrow)" : undefined} strokeLinecap="round" />;
};

export default StructureLab;
