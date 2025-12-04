import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw, AlertTriangle, BarChart3, List } from 'lucide-react';

// --- Internal CSS Styles for Dark Mode ---
const STYLES = `
  * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body { margin: 0; background-color: #1a202c; color: #a0aec0; }
  
  /* Scrollbar Styling */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #2d3748; }
  ::-webkit-scrollbar-thumb { background: #4a5568; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #718096; }

  .app-container {
    min-height: 100vh;
    padding: 1.5rem;
    background-color: #1a202c;
  }

  .main-grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  /* 3-Column Layout for Desktop */
  @media (min-width: 1200px) {
    .main-grid { grid-template-columns: 320px 1fr 280px; }
  }
  /* 2-Column Layout for Medium Screens (List moves to bottom or side) */
  @media (min-width: 900px) and (max-width: 1199px) {
    .main-grid { grid-template-columns: 320px 1fr; }
  }

  /* Cards */
  .card {
    background: #2d3748;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    border: 1px solid #4a5568;
    overflow: hidden;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }

  .header { margin-bottom: 1rem; }
  .subtitle { color: #cbd5e1; font-size: 0.875rem; font-weight: 700; margin-top: 0.25rem; }

  /* Controls */
  .control-group { margin-bottom: 1rem; }
  .label { display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #a0aec0; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
  
  .select-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #4a5568;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: #4a5568;
    color: #e2e8f0;
    outline: none;
    transition: border-color 0.2s;
  }
  .select-input:focus { border-color: #63b3ed; ring: 2px solid #63b3ed; }

  /* Mode Switch */
  .mode-switch {
    display: flex;
    background: #4a5568;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }
  .mode-btn {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #cbd5e1;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
  }
  .mode-btn.active { background: #63b3ed; color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }

  /* Algo Buttons */
  .algo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .algo-btn {
    padding: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid #4a5568;
    background: #2d3748;
    color: #cbd5e1;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .algo-btn:hover { background: #4a5568; }
  .algo-btn.active { background: #63b3ed; color: white; border-color: #63b3ed; }

  /* Main Action Button */
  .search-btn {
    width: 100%;
    padding: 0.875rem;
    background: linear-gradient(to right, #63b3ed, #5a67d8);
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
  .search-btn:disabled { opacity: 0.7; cursor: not-allowed; background: #718096; }
  .search-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }

  /* Messages */
  .msg-box { margin-top: 1rem; padding: 0.75rem; border-radius: 8px; font-size: 0.8rem; line-height: 1.4; }
  .msg-success { background: #2f855a; color: #d6e8dd; border: 1px solid #48bb78; }
  .msg-error { background: #c53030; color: #fcebeb; border: 1px solid #fc8181; }

  /* Constraints Area */
  .constraints { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #4a5568; }
  .constraints-title { font-size: 0.875rem; font-weight: 600; color: #e2e8f0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
  .tag-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
  .tag { 
    font-size: 0.75rem; background: #c53030; color: #fcebeb; padding: 2px 8px; 
    border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #fc8181;
  }
  .tag-close { cursor: pointer; font-weight: bold; }

  /* Explored List (Side Panel) */
  .list-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .explored-list-container {
    flex: 1;
    overflow-y: auto;
    background: #1a202c;
    border: 1px solid #4a5568;
    border-radius: 8px;
    max-height: 600px; /* Limits height on smaller screens */
  }
  @media (min-width: 1200px) {
      .explored-list-container { max-height: calc(100vh - 200px); }
  }

  .explored-item {
    padding: 0.6rem 0.75rem;
    border-bottom: 1px solid #2d3748;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    color: #cbd5e1;
  }
  .explored-item:last-child { border-bottom: none; }
  .explored-index {
    background: #4a5568;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    margin-right: 0.75rem;
    flex-shrink: 0;
  }
  .path-indicator {
    margin-left: auto;
    font-size: 0.65rem;
    color: #48bb78;
    font-weight: 700;
    text-transform: uppercase;
    background: rgba(72, 187, 120, 0.15);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(72, 187, 120, 0.3);
  }

  /* Map Area */
  .map-wrapper { position: relative; height: 500px; background: #2d3748; border-radius: 12px; overflow: hidden; margin-bottom: 1rem; }
  .map-label { 
    position: absolute; top: 1rem; left: 1rem; background: rgba(45,55,72,0.95);
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
    background: #4a5568;
    text-align: center;
    border: 1px solid #63b3ed;
  }
  .metric-value { font-size: 1.5rem; font-weight: 700; color: #e2e8f0; margin-bottom: 0.25rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem; }
  .metric-label { font-size: 0.7rem; color: #cbd5e1; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
`;

// --- Types ---
type Node = string;
type Graph = Record<Node, Record<string, number>>;
type Coords = Record<Node, { x: number; y: number }>;
type PathResult = { path: Node[], explored: Node[], message: string, note?: string, path_length: number, path_cost: number };

// --- Data (Must Match Python Backend Graph Structure) ---
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

// Coordinates used for visual representation (and heuristic in Simulation mode)
// NOTE: These should ideally align with the relative distances calculated from the Python backend's 'coordinates' data
const COORDS: Coords = {
  // Using normalized visualization coordinates for the map display
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

// The Python backend uses different coordinates for the actual HEURISTIC calculation:
// 'Meskel Square': (0, 0), 'Bole': (5, 1), 'Megenagna': (4, 4), '4 Kilo': (0, 4), 
// '6 Kilo': (0, 6), 'Piazza': (-3, 4), 'Merkato': (-5, 2), 'Mexico': (-3, 0), 
// 'Sarbet': (-3, -4), 'Gotera': (1, -5), 'CMC': (9, 5), 'Kality': (2, -9), 'Mekanisa': (-5, -6)

export default function CitySearchApp() {
  const [startNode, setStartNode] = useState<Node | ''>('');
  const [goalNode, setGoalNode] = useState<Node | ''>('');
  const [algorithm, setAlgorithm] = useState<'BFS' | 'DFS' | 'Greedy'>('BFS');
  const [blockedNodes, setBlockedNodes] = useState<Node[]>([]);
  
  const [path, setPath] = useState<Node[]>([]);
  const [finalPath, setFinalPath] = useState<Node[]>([]);
  const [exploredNodes, setExploredNodes] = useState<Node[]>([]);
  const [animatedExploredNodes, setAnimatedExploredNodes] = useState<Node[]>([]);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [pathLength, setPathLength] = useState<number | null>(null);
  const [pathCost, setPathCost] = useState<number | null>(null);
  
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'Backend' | 'Simulation'>('Simulation');

  const exploredListRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of explored list when new nodes are added
  useEffect(() => {
    if (exploredListRef.current) {
      exploredListRef.current.scrollTop = exploredListRef.current.scrollHeight;
    }
  }, [animatedExploredNodes]);

  // Animation effect for explored nodes
  useEffect(() => {
    if (!exploredNodes.length) {
      setAnimatedExploredNodes([]);
      return;
    }
    setAnimatedExploredNodes([]);
    if (animationRef.current) clearInterval(animationRef.current);

    let idx = 0;
    // Animate exploration: 400ms delay between node highlights
    animationRef.current = setInterval(() => {
      idx++;
      setAnimatedExploredNodes(exploredNodes.slice(0, idx));
      if (idx >= exploredNodes.length && animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
        // Set the final path after animation completes
        setPath(finalPath);
        setPathLength(finalPath.length - 1);
        setPathCost(calculatePathCost(finalPath));
      }
    }, 400);
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [exploredNodes, finalPath]);

  // --- Helper: Euclidean Distance (using JS Coords for simulation consistency) ---
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

  // --- Client-Side Algorithms ---
  const runSimulation = () => {
    if (!startNode || !goalNode) return;

    const actualStart = Object.keys(GRAPH).find(n => n.toLowerCase() === startNode.toLowerCase());
    if (!actualStart) {
      setError("Start address does not exist.");
      setLoading(false);
      return;
    }
    setStartNode(actualStart); // Correct the case

    const actualGoal = Object.keys(GRAPH).find(n => n.toLowerCase() === goalNode.toLowerCase());
    if (!actualGoal) {
      setError("Goal address does not exist.");
      setLoading(false);
      return;
    }
    setGoalNode(actualGoal); // Correct the case

    if (blockedNodes.includes(actualStart)) {
      setMessage("Start node is blocked.");
      setExploredNodes([]);
      setFinalPath([]);
      setLoading(false);
      return;
    }

    if (blockedNodes.includes(actualGoal)) {
      setMessage("Goal node is blocked.");
      setExploredNodes([]);
      setFinalPath([]);
      setLoading(false);
      return;
    }

    if (actualStart === actualGoal) {
      setFinalPath([actualStart]);
      setExploredNodes([actualStart]);
      setMessage("Start and Goal are the same.");
      return;
    }

    let foundPath: Node[] | null = null;
    const blockedSet = new Set(blockedNodes);
    const explored: Node[] = [];
    const visited = new Set<Node>();

    // --- Search Logic (BFS, DFS, Greedy) ---
    if (algorithm === 'BFS') {
      const queue: Node[][] = [[actualStart]];
      visited.add(actualStart);
      explored.push(actualStart);

      while (queue.length > 0) {
        const currentPath = queue.shift()!;
        const node = currentPath[currentPath.length - 1];

        if (node === actualGoal) { foundPath = currentPath; break; }

        for (const neighbor of Object.keys(GRAPH[node])) {
            if (!visited.has(neighbor) && !blockedSet.has(neighbor)) {
                visited.add(neighbor);
                explored.push(neighbor);
                queue.push([...currentPath, neighbor]);
            }
        }
      }
    } else if (algorithm === 'DFS') {
      const stack: Node[][] = [[actualStart]];

      while (stack.length > 0) {
        const currentPath = stack.pop()!;
        const node = currentPath[currentPath.length - 1];

        if (!visited.has(node)) {
          visited.add(node);
          explored.push(node);

          if (node === actualGoal) { foundPath = currentPath; break; }

          // Reversing keys to match typical DFS exploration order (e.g., left-to-right)
          for (const neighbor of Object.keys(GRAPH[node]).reverse()) {
            if (!blockedSet.has(neighbor)) {
              stack.push([...currentPath, neighbor]);
            }
          }
        }
      }
    } else if (algorithm === 'Greedy') {
        // Priority Queue stores: { cost: h(n), g_cost: g(n), node: Node, path: Node[] }
        const pq: { cost: number, g_cost: number, node: Node, path: Node[] }[] = [{
            cost: getHeuristic(actualStart, actualGoal),
            g_cost: 0, // Path cost already traveled (g(n))
            node: actualStart,
            path: [actualStart]
        }];

        // Use visited to track *fully processed* nodes (prevents loops)
        const visitedGreedy = new Set<Node>();

        while (pq.length > 0) {
            // 1. Sort by the primary cost (h(n)), then use g(n) as a tie-breaker
            pq.sort((a, b) => {
                if (a.cost !== b.cost) {
                    return a.cost - b.cost; // Primary: Smallest h(n)
                }
                return a.g_cost - b.g_cost; // Tie-breaker: Smallest g(n)
            });

            const item = pq.shift()!;
            const node = item.node;
            const currentPath = item.path;
            const currentGCost = item.g_cost;

            // 2. Skip if already processed
            if (visitedGreedy.has(node)) continue;

            visitedGreedy.add(node);
            explored.push(node);

            if (node === actualGoal) {
                foundPath = currentPath;
                break;
            }

            // 3. Expand Neighbors
            for (const neighbor of Object.keys(GRAPH[node])) {
                if (!blockedSet.has(neighbor)) {
                    if (!visitedGreedy.has(neighbor)) {
                        const edgeCost = GRAPH[node][neighbor];

                        pq.push({
                            // Primary cost is ONLY the heuristic h(n)
                            cost: getHeuristic(neighbor, actualGoal),
                            // Update the path cost g(n) for the tie-breaker
                            g_cost: currentGCost + edgeCost,
                            node: neighbor,
                            path: [...currentPath, neighbor]
                        });
                    }
                }
            }
        }
    }

    if (foundPath) {
      setFinalPath(foundPath);
      setExploredNodes(explored);
      setMessage("Path found using " + algorithm + ".");
    } else {
      setFinalPath([]);
      setExploredNodes(explored);
      setMessage("No path found.");
    }
    setLoading(false);
  };

  // --- API Call ---
  const handleSearch = async () => {
    setError('');
    setMessage('');
    setPath([]);
    setFinalPath([]);
    setExploredNodes([]);
    setPathLength(null);
    setPathCost(null);
    setAnimatedExploredNodes([]);
    if (animationRef.current) clearInterval(animationRef.current);
    setLoading(true);

    if (!startNode || !goalNode) {
      setError("Please select both start and goal states.");
      setLoading(false);
      return;
    }

    if (mode === 'Simulation') {
      // Small delay to show loading state before simulation runs
      setTimeout(() => runSimulation(), 400);
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
        setFinalPath(result.path);
        setExploredNodes(result.explored);
        setPathLength(result.path_length);
        setPathCost(result.path_cost);
        setMessage(result.message);
      } else {
        setError(data.error || 'An error occurred');
        setFinalPath([]);
        setExploredNodes(data.explored || []);
        setPathLength(0);
        setPathCost(0);
      }
    } catch (err) {
      setError('Failed to connect to backend. Is Python running? Switch to Simulation mode to test.');
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
  
  return (
    <div className="app-container">
      <style>{STYLES}</style>

      {/* Grid Layout: [Controls] [Map] [List] */}
      <div className="main-grid">
        
        {/* COLUMN 1: Controls */}
        <div>
          <div className="card">
            <div className="header">
              <p className="subtitle">Search Configuration</p>
            </div>

            <div>
              <div className="mode-switch">
                <button 
                  onClick={() => setMode('Simulation')}
                  className={`mode-btn ${mode === 'Simulation' ? 'active' : ''}`}
                >
                  Simulation
                </button>
                <button 
                  onClick={() => setMode('Backend')}
                  className={`mode-btn ${mode === 'Backend' ? 'active' : ''}`}
                >
                  Backend
                </button>
              </div>

              <div className="control-group">
                <label className="label">Start Address</label>
                <input
                  type="text"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value as Node)}
                  placeholder="Enter Start Address"
                  className="select-input"
                  list="places"
                />
              </div>

              <div className="control-group">
                <label className="label">Goal Address</label>
                <input
                  type="text"
                  value={goalNode}
                  onChange={(e) => setGoalNode(e.target.value as Node)}
                  placeholder="Enter Goal Address"
                  className="select-input"
                  list="places"
                />
              </div>

              <datalist id="places">
                {Object.keys(GRAPH).map(n => <option key={n} value={n} />)}
              </datalist>

              <div className="control-group">
                <label className="label">Algorithm</label>
                <div className="algo-grid">
                  {['BFS', 'DFS', 'Greedy'].map((alg) => (
                    <button
                      key={alg}
                      onClick={() => setAlgorithm(alg as 'BFS' | 'DFS' | 'Greedy')}
                      className={`algo-btn ${algorithm === alg ? 'active' : ''}`}
                    >
                      {alg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="constraints">
                <h3 className="constraints-title">
                  <AlertTriangle size={14} color="#f59e0b"/> 
                  Constraints
                </h3>
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
                  <div style={{fontSize: '0.75rem', color: '#718096', fontStyle: 'italic', marginTop: '0.5rem'}}>Click nodes on map to block.</div>
                )}
              </div>

              <button
                onClick={handleSearch}
                disabled={loading || !startNode || !goalNode}
                className="search-btn"
              >
                {loading ? (
                   <RotateCcw className="animate-spin" size={20}/>
                 ) : (
                  <>
                    <Search size={18} />
                    Find Path
                  </>
                )}
              </button>

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
        </div>

        {/* COLUMN 2: Map & Results */}
        <div>
           <div className="card map-wrapper">
             <div className="map-label">
               Addis Ababa Graph
             </div>
             
             <svg 
                style={{width: '100%', height: '100%', background: '#2d3748', cursor: 'crosshair'}} 
                viewBox="0 0 120 120"
             >
               {/* Edges */}
               {Object.keys(GRAPH).map((fromNode) => 
                 Object.keys(GRAPH[fromNode]).map((toNode) => {
                   if (fromNode > toNode) return null; // Draw each edge once
                   
                   const start = COORDS[fromNode];
                   const end = COORDS[toNode];
                   
                   // Check if edge is part of the final path
                   const isPathEdge = path.includes(fromNode) && path.includes(toNode) && 
                                      Math.abs(path.indexOf(fromNode) - path.indexOf(toNode)) === 1;
                   
                   // Check if both nodes were explored but the edge isn't the final path
                   const isExploredEdge = !isPathEdge && 
                                           animatedExploredNodes.includes(fromNode) && 
                                           animatedExploredNodes.includes(toNode);

                   let strokeColor = '#718096';
                   let strokeWidth = 0.5;
                   let strokeDash = '2,1';

                   if (isPathEdge) {
                       strokeColor = '#48bb78';
                       strokeWidth = 2;
                       strokeDash = 'none';
                   } else if (isExploredEdge) {
                       strokeColor = '#f6ad55';
                       strokeWidth = 1;
                       strokeDash = '4,2';
                   }

                   return (
                      <line
                        key={`${fromNode}-${toNode}`}
                        x1={start.x} y1={start.y}
                        x2={end.x} y2={end.y}
                        stroke={strokeColor} 
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        style={{transition: 'all 0.5s'}}
                      />
                   );
                 })
               )}

               {/* Nodes */}
               {Object.keys(GRAPH).map((node) => {
                 const pos = COORDS[node];
                 const isStart = node === startNode;
                 const isGoal = node === goalNode;
                 const isPath = path.includes(node);
                 const isBlocked = blockedNodes.includes(node);
                 const isExploredOnly = animatedExploredNodes.includes(node) && !path.includes(node);

                 let fill = '#a0aec0';
                 let stroke = '#718096';
                 let radius = 3;

                 if (isBlocked) { fill = '#c53030'; stroke = '#e53e3e'; }
                 else if (isStart) { fill = '#63b3ed'; stroke = '#2b6cb0'; radius = 5; }
                 else if (isGoal) { fill = '#48bb78'; stroke = '#2f855a'; radius = 5; }
                 else if (isPath) { fill = '#81e6d9'; stroke = '#48bb78'; }
                 else if (isExploredOnly) { fill = '#f6ad55'; stroke = '#dd6b20'; }

                 return (
                    <g 
                      key={node} 
                      onClick={() => toggleBlocked(node)}
                      style={{cursor: 'pointer'}} 
                    >
                      {/* Node Circle */}
                      <circle
                        cx={pos.x} cy={pos.y}
                        r={radius}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isStart || isGoal ? 1 : 0.5}
                        style={{transition: 'fill 0.3s'}}
                      />
                      {/* Node Label (Name) */}
                      <text
                        x={pos.x} y={pos.y - 4}
                        textAnchor="middle"
                        fill={isPath ? '#2f855a' : '#e2e8f0'}
                        fontSize="3"
                        fontWeight="bold"
                        style={{pointerEvents: 'none', textTransform: 'uppercase'}}
                      >
                        {node}
                      </text>
                      {/* S/G/X Indicator */}
                      {isStart && <text x={pos.x} y={pos.y + 1} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="3" fontWeight="bold" style={{pointerEvents: 'none'}}>S</text>}
                      {isGoal && <text x={pos.x} y={pos.y + 1} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="3" fontWeight="bold" style={{pointerEvents: 'none'}}>G</text>}
                      {isBlocked && <text x={pos.x} y={pos.y + 1.5} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="3" fontWeight="bold" style={{pointerEvents: 'none'}}>X</text>}
                    </g>
                 );
               })}
             </svg>
           </div>
           
           {/* Results Summary */}
           <div className="card" style={{marginTop: '0'}}>
                <h3 className="constraints-title">
                    <BarChart3 size={14} color="#63b3ed"/> 
                    Metrics
                </h3>
                {pathCost !== null ? (
                    <div className="results-grid">
                        <div className="metric-box">
                            <div className="metric-value">{pathLength}</div>
                            <div className="metric-label">Steps</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-value">{pathCost.toFixed(1)}</div>
                            <div className="metric-label">Cost</div>
                        </div>
                        <div className="metric-box">
                            <div className="metric-value">{exploredNodes.length}</div>
                            <div className="metric-label">Explored</div>
                        </div>
                    </div>
                ) : (
                    <p style={{fontSize: '0.8rem', color: '#718096', fontStyle: 'italic', margin: 0, padding: '0.5rem 0'}}>
                        Results will appear here.
                    </p>
                )}
           </div>
        </div>

        {/* COLUMN 3: Explored List (Dedicated Sidebar) */}
        <div className="card list-wrapper">
          <h3 className="constraints-title">
              <List size={14} color="#f6ad55"/>
              Explored Sequence
          </h3>
          <p style={{fontSize: '0.75rem', color: '#a0aec0', marginBottom: '1rem'}}>
              Order of visit ({exploredNodes.length} nodes)
          </p>
          
          <div className="explored-list-container" ref={exploredListRef}>
              {exploredNodes.length === 0 ? (
                <div style={{padding: '1rem', color: '#718096', fontStyle: 'italic', fontSize: '0.8rem', textAlign: 'center'}}>
                  No search run yet.
                </div>
              ) : (
                animatedExploredNodes.map((node, index) => {
                  const isPathNode = path.includes(node);
                  return (
                    <div key={`${node}-${index}`} className="explored-item">
                      <div className="explored-index">{index + 1}</div>
                      <span>{node}</span>
                      {isPathNode && (
                        <div className="path-indicator">PATH</div>
                      )}
                    </div>
                  );
                })
              )}
          </div>
        </div>

      </div>
    </div>
  );
}