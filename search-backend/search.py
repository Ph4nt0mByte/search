import math
from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# --- 1. Graph Data (Addis Ababa Simplified) ---
# Format: { 'Node': {'Neighbor': distance, ...} }
# Distances are approximate relative units for the graph
graph = {
    'Meskel Square': {'Bole': 5, 'Megenagna': 6, '4 Kilo': 4, 'Mexico': 3, 'Gotera': 5},
    'Bole': {'Meskel Square': 5, 'Megenagna': 4, 'Gotera': 6, 'CMC': 7},
    'Megenagna': {'Bole': 4, 'Meskel Square': 6, '4 Kilo': 5, 'CMC': 5},
    '4 Kilo': {'Meskel Square': 4, 'Megenagna': 5, 'Piazza': 3, '6 Kilo': 2},
    '6 Kilo': {'4 Kilo': 2, 'Piazza': 3},
    'Piazza': {'4 Kilo': 3, '6 Kilo': 3, 'Mexico': 4, 'Merkato': 2},
    'Merkato': {'Piazza': 2, 'Mexico': 3},
    'Mexico': {'Meskel Square': 3, 'Piazza': 4, 'Merkato': 3, 'Sarbet': 4},
    'Sarbet': {'Mexico': 4, 'Gotera': 5, 'Mekanisa': 4},
    'Gotera': {'Meskel Square': 5, 'Bole': 6, 'Sarbet': 5, 'Kality': 6},
    'CMC': {'Bole': 7, 'Megenagna': 5},
    'Kality': {'Gotera': 6},
    'Mekanisa': {'Sarbet': 4}
}

# Coordinates for Heuristic (Greedy Search)
coordinates = {
    'Meskel Square': (0, 0),
    'Bole': (5, 1),
    'Megenagna': (4, 4),
    '4 Kilo': (0, 4),
    '6 Kilo': (0, 6),
    'Piazza': (-3, 4),
    'Merkato': (-5, 2),
    'Mexico': (-3, 0),
    'Sarbet': (-3, -4),
    'Gotera': (1, -5),
    'CMC': (9, 5),
    'Kality': (2, -9),
    'Mekanisa': (-5, -6)
}

# --- 2. Helper Functions ---

def get_heuristic(node, goal):
    """Euclidean distance for Greedy Best-First Search"""
    x1, y1 = coordinates[node]
    x2, y2 = coordinates[goal]
    return math.sqrt((x1 - x2)**2 + (y1 - y2)**2)

def calculate_path_cost(path):
    """Calculates the total distance (cost) of the given path."""
    cost = 0
    if not path or len(path) < 2:
        return 0
    
    for i in range(len(path) - 1):
        current_node = path[i]
        next_node = path[i+1]
        
        # Look up the distance between current_node and next_node
        # Note: assumes the graph is undirected, but cost must be looked up correctly
        if next_node in graph.get(current_node, {}):
            cost += graph[current_node][next_node]
        else:
            # Should not happen in a valid path, but defensive check
            print(f"Warning: Edge {current_node} -> {next_node} not found in graph.")
            return -1 # Error indicator
            
    return cost

# --- 3. Algorithms (Now tracking explored_nodes) ---

def bfs(start, goal, blocked_nodes):
    queue = [[start]]
    visited = set()
    explored_nodes = []
    
    while queue:
        path = queue.pop(0)
        node = path[-1]
        
        if node not in visited:
            visited.add(node)
            explored_nodes.append(node) 
            
            if node == goal:
                return path, explored_nodes
            
            neighbors = graph.get(node, {})
            for neighbor in neighbors:
                if neighbor not in blocked_nodes:
                    new_path = list(path)
                    new_path.append(neighbor)
                    queue.append(new_path)
    return None, explored_nodes 

def dfs(start, goal, blocked_nodes):
    stack = [[start]]
    visited = set()
    explored_nodes = []

    while stack:
        path = stack.pop()
        node = path[-1]
        
        if node not in visited:
            visited.add(node)
            explored_nodes.append(node) 
            
            if node == goal:
                return path, explored_nodes
            
            neighbors = graph.get(node, {})
            for neighbor in reversed(list(neighbors.keys())): 
                if neighbor not in blocked_nodes:
                    new_path = list(path)
                    new_path.append(neighbor)
                    stack.append(new_path)
    return None, explored_nodes 

def greedy_search(start, goal, blocked_nodes):
    pq = [(get_heuristic(start, goal), start, [start])]
    visited = set()
    explored_nodes = []

    while pq:
        h_cost, node, path = heapq.heappop(pq)
        
        if node == goal:
            return path, explored_nodes

        if node not in visited:
            visited.add(node)
            explored_nodes.append(node) 
            
            neighbors = graph.get(node, {})
            for neighbor in neighbors:
                if neighbor not in blocked_nodes:
                    new_path = list(path)
                    new_path.append(neighbor)
                    priority = get_heuristic(neighbor, goal)
                    heapq.heappush(pq, (priority, neighbor, new_path))
    return None, explored_nodes 

# --- 4. API Endpoint ---

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    start = data.get('start')
    goal = data.get('goal')
    algo = data.get('algorithm')
    blocked_nodes = set(data.get('blocked', []))
    print(f"Backend search called with blocked_nodes: {blocked_nodes}")
    
    if start not in graph or goal not in graph:
        return jsonify({'error': 'Unknown start or goal state. Please check the map nodes.'}), 400

    if start == goal:
        return jsonify({
            'path': [start],
            'explored': [start],
            'path_length': 0,
            'path_cost': 0,
            'message': 'Initial state and goal state are the same. Zero distance.'
        })

    path = None
    explored = []
    
    if algo == 'BFS':
        path, explored = bfs(start, goal, blocked_nodes)
    elif algo == 'DFS':
        path, explored = dfs(start, goal, blocked_nodes)
    elif algo == 'Greedy':
        path, explored = greedy_search(start, goal, blocked_nodes)
    else:
        return jsonify({'error': 'Unknown algorithm selected.'}), 400

    if path:
        path_cost = calculate_path_cost(path)
        return jsonify({
            'path': path,
            'explored': explored,
            'path_length': len(path) - 1,
            'path_cost': round(path_cost, 2),
            'message': 'Path found successfully.',
            'note': f'{algo} explored {len(explored)} nodes.'
        })
    else:
        return jsonify({
            'error': 'No path found. The destination is unreachable or blocked.', 
            'explored': explored,
            'path_length': 0,
            'path_cost': 0,
        }), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
