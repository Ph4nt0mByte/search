# Pathfinding Search Visualization

A web application for visualizing pathfinding algorithms on a graph of Addis Ababa locations. Supports BFS, DFS, and Greedy Best-First Search with interactive node blocking.

## Features

- **Interactive Map**: Click on nodes to block/unblock them during search
- **Real-time Updates**: Blocking nodes dynamically re-computes the path
- **Multiple Algorithms**: BFS, DFS, Greedy Best-First Search
- **Dual Mode**: Simulation (client-side) and Backend (Python server)
- **Animated Exploration**: Step-by-step visualization of algorithm execution
- **Metrics Display**: Path length, cost, and explored nodes count


## Technologies

- **Frontend**: React, TypeScript, Vite
- **Backend**: Python, Flask, CORS
- **Styling**: CSS with dark theme

## Setup and Installation

### Prerequisites

- Node.js (for frontend)
- Python 3.x (for backend)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` (default Vite port).

### Backend Setup

1. Navigate to the search-backend directory:
   ```bash
   cd search-backend
   ```

2. Install Python dependencies:
   ```bash
   pip install flask flask-cors
   ```

3. Run the Flask server:
   ```bash
   python search.py
   ```

The backend API will be available at `http://127.0.0.1:5000`.

## Usage

1. Open the frontend in your browser
2. Select start and goal locations from the dropdown
3. Choose an algorithm (BFS, DFS, or Greedy)
4. Click "Find Path" to start the search
5. Click on map nodes to block/unblock them - the path will update automatically
6. Switch between "Simulation" (client-side) and "Backend" (server-side) modes

## Graph Data

The application uses a simplified graph of Addis Ababa locations with approximate distances. The graph includes nodes like Meskel Square, Bole, Piazza, Merkato, etc.

