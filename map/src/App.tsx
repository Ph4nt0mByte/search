import React, { useState } from 'react';
import { Search, Navigation, RotateCcw, AlertTriangle, BarChart3 } from 'lucide-react';

// --- Internal CSS Styles for Dark Mode ---
const STYLES = `
  * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body { margin: 0; background-color: #1a202c; color: #a0aec0; } /* Darker background, lighter text */
  
  .app-container {
    min-height: 100vh;
    padding: 2rem;
    background-color: #1a202c;
  }

  .main-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    .main-grid { grid-template-columns: 350px 1fr; }
  }

  /* Cards */
  .card {
    background: #2d3748; /* Darker card background */
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2); /* Darker shadow */
    border: 1px solid #4a5568; /* Darker border */
    overflow: hidden;
    padding: 1.5rem;
  }

  .header { margin-bottom: 1.5rem; }
  .title { font-size: 1.5rem; font-weight: 700; color: #e2e8f0; display: flex; align-items: center; gap: 0.5rem; margin: 0; }
  .subtitle { color: #cbd5e1; font-size: 0.875rem; margin-top: 0.25rem; } /* Lighter subtitle */

  /* Controls */
  .control-group { margin-bottom: 1rem; }
  .label { display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #a0aec0; margin-bottom: 0.5rem; letter-spacing: 0.05em; } /* Lighter label */
  
  .select-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #4a5568; /* Darker border */
    border-radius: 8px;
    font-size: 1rem;
    background-color: #4a5568; /* Darker input background */
    color: #e2e8f0; /* Lighter input text */
    outline: none;
    transition: border-color 0.2s;
  }
  .select-input:focus { border-color: #63b3ed; ring: 2px solid #63b3ed; } /* Blue focus */

  /* Mode Switch */
  .mode-switch {
    display: flex;
    background: #4a5568; /* Darker switch background */
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }
  .mode-btn {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #cbd5e1; /* Lighter text */
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }
  .mode-btn.active { background: #63b3ed; color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.4); } /* Blue active */

  /* Algo Buttons */
  .algo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .algo-btn {
    padding: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid #4a5568; /* Darker border */
    background: #2d3748; /* Darker background */
    color: #cbd5e1; /* Lighter text */
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .algo-btn:hover { background: #4a5568; } /* Darker hover */
  .algo-btn.active { background: #63b3ed; color: white; border-color: #63b3ed; } /* Blue active */

  /* Main Action Button */
  .search-btn {
    width: 100%;
    padding: 0.875rem;
    background: linear-gradient(to right, #63b3ed, #5a67d8); /* Blue/Indigo gradient */
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: opacity 0.2s;
    margin-top: 1rem;
  }
  .search-btn:disabled { opacity: 0.7; cursor: not-allowed; background: #718096; } /* Grey disabled */
  .search-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }

  /* Messages */
  .msg-box { margin-top: 1rem; padding: 0.75rem; border-radius: 8px; font-size: 0.875rem; line-height: 1.4; }
  .msg-success { background: #2f855a; color: #d6e8dd; border: 1px solid #48bb78; } /* Dark green */
  .msg-error { background: #c53030; color: #fcebeb; border: 1px solid #fc8181; } /* Dark red */

  /* Constraints Area */
  .constraints { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #4a5568; } /* Darker border */
  .constraints-title { font-size: 0.875rem; font-weight: 600; color: #e2e8f0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; } /* Lighter title */
  .tag-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
  .tag { 
    font-size: 0.75rem; background: #c53030; color: #fcebeb; padding: 2px 8px; 
    border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #fc8181; /* Dark red tag */
  }
  .tag-close { cursor: pointer; font-weight: bold; }

  /* Map Area */
  .map-wrapper { position: relative; height: 500px; background: #2d3748; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; } /* Darker map background */
  .map-label { 
    position: absolute; top: 1rem; left: 1rem; background: rgba(45,55,72,0.9); /* Darker transparent background */
    padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.75rem; 
    font-weight: 600; color: #cbd5e1; border: 1px solid #4a5568; pointer-events: none;
  }

  /* Results Card */
  .results-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }
  .metric-box {
    padding: 1rem;
    border-radius: 8px;
    background: #4a5568; /* Dark gray for metric boxes */
    text-align: center;
    border: 1px solid #63b3ed; /* Blue border to highlight results */
  }
  .metric-value { font-size: 1.5rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.25rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem; }
  .metric-label { font-size: 0.75rem; color: #cbd5e1; text-transform: uppercase; font-weight: 600; }
`;

// --- Types ---
type Node = string;
type Graph = Record<Node, Record<string, number>>;
type Coords = Record<Node, { x: number; y: number }>;
type PathResult = { path: Node[], explored: Node[], message: string, note?: string, path_length: number, path_cost: number };

// --- Data ---
const GRAPH: Graph = {
  'Meskel Square': { 'Bole': 5, 'Megenagna': 6, '4 Kilo': 4, 'Mexico': 3, 'Gotera': 5 },
  'Bole': { 'Meskel Square': 5, 'Megenagna': 4, 'Gotera': 6, 'CMC': 7 },
  'Megenagna': { 'Bole': 4, 'Meskel Square': 6, '4 Kilo': 5, 'CMC': 5 },
  '4 Kilo': { 'Meskel Square': 4, 'Megenagna': 5, 'Piazza': 3, '6 Kilo': 2 },
  '6 Kilo': { '4 Kilo': 2, 'Piazza': 3 },
  'Piazza': { '4 Kilo': 3, '6 Kilo': 3, 'Mexico': 4, 'Merkato': 2 },
  'Merkato': { 'Piazza': 2, 'Mexico': 3 },
  'Mexico': { 'Meskel Square': 3, 'Piazza': 4, 'Merkato': 3, 'Sarbet': 4 },
  'Sarbet': { 'Mexico': 4, 'Gotera': 5, 'Mekanisa': 4 },
  'Gotera': { 'Meskel Square': 5, 'Bole': 6, 'Sarbet': 5, 'Kality': 6 },
  'CMC': { 'Bole': 7, 'Megenagna': 5 },
  'Kality': { 'Gotera': 6 },
  'Mekanisa': { 'Sarbet': 4 }
};

const COORDS: Coords = {
  'Meskel Square': { x: 50, y: 50 },
  'Bole': { x: 80, y: 55 },
  'Megenagna': { x: 75, y: 30 },
  '4 Kilo': { x: 50, y: 25 },
  '6 Kilo': { x: 50, y: 10 },
  'Piazza': { x: 35, y: 25 },
  'Merkato': { x: 20, y: 35 },
  'Mexico': { x: 35, y: 50 },
  'Sarbet': { x: 30, y: 70 },
  'Gotera': { x: 60, y: 75 },
  'CMC': { x: 95, y: 35 },
  'Kality': { x: 65, y: 95 },
  'Mekanisa': { x: 20, y: 85 }
};

export default function CitySearchApp() {
  const [startNode, setStartNode] = useState<Node | ''>('');
  const [goalNode, setGoalNode] = useState<Node | ''>('');
  const [algorithm, setAlgorithm] = useState<'BFS' | 'DFS' | 'Greedy'>('BFS');
  const [blockedNodes, setBlockedNodes] = useState<Node[]>([]);
  
  const [path, setPath] = useState<Node[]>([]);
  const [exploredNodes, setExploredNodes] = useState<Node[]>([]); 
  const [pathLength, setPathLength] = useState<number | null>(null); 
  const [pathCost, setPathCost] = useState<number | null>(null);     
  
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'Backend' | 'Simulation'>('Simulation');

  // --- Helper: Euclidean Distance ---
  const getHeuristic = (n1: Node, n2: Node) => {
    const c1 = COORDS[n1];
    const c2 = COORDS[n2];
    return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
  };
  
  // --- Helper: Calculate Path Cost (Client-side) ---
  const calculatePathCost = (currentPath: Node[]): number => {
    let cost = 0;
    if (currentPath.length < 2) return 0;
    
    for (let i = 0; i < currentPath.length - 1; i++) {
      const from = currentPath[i];
      const to = currentPath[i + 1];
      const distance = GRAPH[from][to];
      if (distance !== undefined) {
        cost += distance;
      } else {
        console.error(`Edge from ${from} to ${to} missing in graph.`);
        return -1; 
      }
    }
    return cost;
  };

  // --- Client-Side Algorithms (Fallback) ---
  const runSimulation = () => {
    if (!startNode || !goalNode) return;
    
    if (startNode === goalNode) {
      setPath([startNode]);
      setExploredNodes([startNode]);
      setPathLength(0);
      setPathCost(0);
      setMessage("Start and Goal are the same.");
      return;
    }

    let foundPath: Node[] | null = null;
    const blockedSet = new Set(blockedNodes);
    const explored: Node[] = [];

    // --- Search Logic (BFS, DFS, Greedy) ---
    if (algorithm === 'BFS') {
      const queue: Node[][] = [[startNode]];
      const visited = new Set<Node>();
      while (queue.length > 0) {
        const currentPath = queue.shift()!;
        const node = currentPath[currentPath.length - 1];
        if (!visited.has(node)) {
          visited.add(node);
          explored.push(node);
          if (node === goalNode) { foundPath = currentPath; break; }
          for (const neighbor of Object.keys(GRAPH[node])) {
            if (!blockedSet.has(neighbor)) {
              queue.push([...currentPath, neighbor]);
            }
          }
        }
      }
    } else if (algorithm === 'DFS') {
      const stack: Node[][] = [[startNode]];
      const visited = new Set<Node>();
      while (stack.length > 0) {
        const currentPath = stack.pop()!;
        const node = currentPath[currentPath.length - 1];
        if (!visited.has(node)) {
          visited.add(node);
          explored.push(node);
          if (node === goalNode) { foundPath = currentPath; break; }
          for (const neighbor of Object.keys(GRAPH[node]).reverse()) { 
            if (!blockedSet.has(neighbor)) {
              stack.push([...currentPath, neighbor]);
            }
          }
        }
      }
    } else if (algorithm === 'Greedy') {
       const pq: { cost: number, path: Node[] }[] = [{ cost: getHeuristic(startNode, goalNode), path: [startNode] }];
       const visited = new Set<Node>();
       
       while (pq.length > 0) {
         pq.sort((a, b) => a.cost - b.cost); 
         const { path: currentPath } = pq.shift()!;
         const node = currentPath[currentPath.length - 1];
         
         if (node === goalNode) { foundPath = currentPath; break; }
         
         if (!visited.has(node)) {
           visited.add(node);
           explored.push(node);
           
           for (const neighbor of Object.keys(GRAPH[node])) {
             if (!blockedSet.has(neighbor)) {
               pq.push({
                 cost: getHeuristic(neighbor, goalNode),
                 path: [...currentPath, neighbor]
               });
             }
           }
         }
       }
    }
    // --- End Search Logic ---

    if (foundPath) {
      const cost = calculatePathCost(foundPath);
      setPath(foundPath);
      setPathLength(foundPath.length - 1);
      setPathCost(cost);
      setMessage(`Simulation found path using ${algorithm}. Explored ${explored.length} nodes.`);
      setError('');
    } else {
      setPath([]);
      setPathLength(0);
      setPathCost(0);
      setError('No path found (destination unreachable or blocked).');
      setMessage('');
    }
    setExploredNodes(explored); 
    setLoading(false);
  };

  // --- API Call ---
  const handleSearch = async () => {
    setError('');
    setMessage('');
    setPath([]);
    setExploredNodes([]);
    setPathLength(null);
    setPathCost(null);
    setLoading(true);

    if (!startNode || !goalNode) {
      setError("Please select both start and goal states.");
      setLoading(false);
      return;
    }

    if (mode === 'Simulation') {
      setTimeout(() => runSimulation(), 600);
      return;
    }

    // Backend (Python) mode
    try {
      const response = await fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: startNode,
          goal: goalNode,
          algorithm: algorithm,
          blocked: blockedNodes
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const result: PathResult = data as PathResult;
        setPath(result.path);
        setExploredNodes(result.explored);
        setPathLength(result.path_length);
        setPathCost(result.path_cost);
        setMessage(result.message + (result.note ? ` ${result.note}` : ''));
      } else {
        setError(data.error || 'An error occurred');
        setExploredNodes(data.explored || []);
        setPathLength(0);
        setPathCost(0);
      }
    } catch (err) {
      setError('Failed to connect to Python backend. Ensure the server is running on port 5000, or switch to Simulation Mode.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlocked = (node: Node) => {
    if (blockedNodes.includes(node)) {
      setBlockedNodes(blockedNodes.filter(n => n !== node));
    } else {
      setBlockedNodes([...blockedNodes, node]);
    }
  };
  
  const isExplored = (node: Node) => exploredNodes.includes(node) && !path.includes(node) && node !== startNode && node !== goalNode;

  const ResultsCard = () => (
    <div className="card" style={{marginTop: '1.5rem'}}>
        <h3 className="constraints-title">
            <BarChart3 size={14} color="#63b3ed"/> 
            Results Summary ({algorithm})
        </h3>
        {pathCost !== null ? (
            <div className="results-grid">
                <div className="metric-box">
                    <div className="metric-value">
                        {pathLength !== null ? pathLength : 'N/A'}
                    </div>
                    <div className="metric-label">Path Length (Steps)</div>
                </div>

                <div className="metric-box">
                    <div className="metric-value">
                        {pathCost !== null ? `${pathCost.toFixed(2)}` : 'N/A'}
                    </div>
                    <div className="metric-label">Total Distance (Cost)</div>
                </div>
                
                <div className="metric-box">
                    <div className="metric-value">
                        {exploredNodes.length}
                    </div>
                    <div className="metric-label">Explored Nodes</div>
                </div>
            </div>
        ) : (
             <p style={{fontSize: '0.875rem', color: '#718096', fontStyle: 'italic', margin: 0, padding: '0.5rem 0'}}>
                Run a search to see the metrics here.
             </p>
        )}
    </div>
  );

  return (
    <div className="app-container">
      {/* Inject Styles */}
      <style>{STYLES}</style>

      <div className="main-grid">
        
        {/* LEFT COLUMN: Controls */}
        <div className="card">
          <div className="header">
            <p className="subtitle" style={{marginBottom: '1.5rem'}}>Addis Ababa Simplified Graph</p>
          </div>

          <div>
            {/* Mode Switch */}
            <div className="mode-switch">
              <button 
                onClick={() => setMode('Simulation')}
                className={`mode-btn ${mode === 'Simulation' ? 'active' : ''}`}
              >
                Simulation (JS)
              </button>
              <button 
                onClick={() => setMode('Backend')}
                className={`mode-btn ${mode === 'Backend' ? 'active' : ''}`}
              >
                Backend (Python)
              </button>
            </div>

            {/* Inputs */}
            <div className="control-group">
              <label className="label">Start State</label>
              <select 
                value={startNode} 
                onChange={(e) => setStartNode(e.target.value)}
                className="select-input"
              >
                <option value="">Select Start...</option>
                {Object.keys(GRAPH).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="control-group">
              <label className="label">Goal State</label>
              <select 
                value={goalNode} 
                onChange={(e) => setGoalNode(e.target.value)}
                className="select-input"
              >
                <option value="">Select Goal...</option>
                {Object.keys(GRAPH).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="control-group">
              <label className="label">Algorithm</label>
              <div className="algo-grid">
                {['BFS', 'DFS', 'Greedy'].map((alg) => (
                  <button
                    key={alg}
                    onClick={() => setAlgorithm(alg as any)}
                    className={`algo-btn ${algorithm === alg ? 'active' : ''}`}
                  >
                    {alg}
                  </button>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div className="constraints">
              <h3 className="constraints-title">
                <AlertTriangle size={14} color="#f59e0b"/> 
                Constraints
              </h3>
              <p style={{fontSize: '0.75rem', color: '#a0aec0'}}>Click nodes on the map to toggle blockages.</p>
              
              {blockedNodes.length > 0 ? (
                <div className="tag-container">
                  {blockedNodes.map(node => (
                    <span key={node} className="tag">
                      {node}
                      <span onClick={() => toggleBlocked(node)} className="tag-close">&times;</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{fontSize: '0.75rem', color: '#718096', fontStyle: 'italic', marginTop: '0.5rem'}}>No nodes blocked.</div>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="search-btn"
            >
              {loading ? (
                 <RotateCcw className="animate-spin" size={20}/>
              ) : (
                <>
                  <Search size={20} />
                  Find Optimal Path
                </>
              )}
            </button>

            {/* Messages */}
            {message && (
              <div className="msg-box msg-success">
                <strong>Success:</strong> {message}
              </div>
            )}
            {error && (
              <div className="msg-box msg-error">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Map Visualization & Results */}
        <div>
           <div className="card map-wrapper">
             <div className="map-label">
               Interactive Map
             </div>
             
             <svg 
               style={{width: '100%', height: '100%', background: '#2d3748', cursor: 'crosshair'}} 
               viewBox="0 0 120 120"
             >
               {/* Draw Edges */}
               {Object.keys(GRAPH).map((fromNode) => 
                 Object.keys(GRAPH[fromNode]).map((toNode) => {
                   if (fromNode > toNode) return null;
                   
                   const start = COORDS[fromNode];
                   const end = COORDS[toNode];
                   
                   const isPathEdge = path.includes(fromNode) && path.includes(toNode) && 
                                      Math.abs(path.indexOf(fromNode) - path.indexOf(toNode)) === 1;

                   return (
                     <line
                       key={`${fromNode}-${toNode}`}
                       x1={start.x} y1={start.y}
                       x2={end.x} y2={end.y}
                       stroke={isPathEdge ? '#63b3ed' : '#718096'} /* Blue for path, grey for others */
                       strokeWidth={isPathEdge ? 1.5 : 0.5}
                       strokeDasharray={isPathEdge ? 'none' : '2,1'}
                       style={{transition: 'all 0.5s'}}
                     />
                   );
                 })
               )}

               {/* Draw Nodes */}
               {Object.keys(GRAPH).map((node) => {
                 const pos = COORDS[node];
                 const isStart = node === startNode;
                 const isGoal = node === goalNode;
                 const isPath = path.includes(node);
                 const isBlocked = blockedNodes.includes(node);
                 const isExploredOnly = isExplored(node);

                 let fill = '#a0aec0'; /* Default node fill */
                 let stroke = '#718096'; /* Default node stroke */
                 let radius = 3;

                 if (isBlocked) { fill = '#c53030'; stroke = '#e53e3e'; } /* Dark red for blocked */
                 else if (isStart) { fill = '#63b3ed'; stroke = '#2b6cb0'; radius = 5; } /* Blue for start */
                 else if (isGoal) { fill = '#48bb78'; stroke = '#2f855a'; radius = 5; } /* Green for goal */
                 else if (isPath) { fill = '#90cdf4'; stroke = '#63b3ed'; } /* Light blue for path */
                 else if (isExploredOnly) { fill = '#2f855a'; stroke = '#48bb78'; } /* Dark green for explored */

                 return (
                   <g 
                     key={node} 
                     onClick={() => toggleBlocked(node)}
                     style={{cursor: 'pointer'}} 
                     // Removed onMouseEnter and onMouseLeave handlers to stop movement
                   >
                     <circle
                       cx={pos.x} cy={pos.y}
                       r={radius}
                       fill={fill}
                       stroke={stroke}
                       strokeWidth={isStart || isGoal ? 1 : 0.5}
                       style={{transition: 'fill 0.3s'}}
                     />
                     <text
                       x={pos.x} y={pos.y - 4}
                       textAnchor="middle"
                       fill={isPath ? '#2b6cb0' : '#e2e8f0'} /* Lighter text for nodes */
                       fontSize="3"
                       fontWeight="bold"
                       style={{pointerEvents: 'none', textTransform: 'uppercase'}}
                     >
                       {node}
                     </text>
                     
                     {/* Icons for Start/Goal */}
                     {isStart && (
                        <text x={pos.x} y={pos.y + 1} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="3" fontWeight="bold" style={{pointerEvents: 'none'}}>S</text>
                     )}
                     {isGoal && (
                        <text x={pos.x} y={pos.y + 1} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="3" fontWeight="bold" style={{pointerEvents: 'none'}}>G</text>
                     )}
                     {isBlocked && (
                        <text x={pos.x} y={pos.y + 1.5} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="3" fontWeight="bold" style={{pointerEvents: 'none'}}>X</text>
                     )}
                   </g>
                 );
               })}
             </svg>
          </div>
          {/* Results Card Display */}
          <ResultsCard />
        </div>
      </div>
    </div>
  );
}